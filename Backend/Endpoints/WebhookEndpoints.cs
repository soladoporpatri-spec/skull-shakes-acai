using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using SkullShakes.Api.BancoDeDados;
using SkullShakes.Api.Enums;
using SkullShakes.Api.Servicos;

namespace SkullShakes.Api.Endpoints;

public static class WebhookEndpoints
{
    public static void MapWebhookEndpoints(this WebApplication app)
    {
        app.MapPost("/webhook/mercadopago", async (
            HttpContext context,
            AppDbContext db,
            MercadoPagoServico mpServico,
            WhatsAppServico wpServico,
            IConfiguration config,
            ILogger<Program> logger) =>
        {
            // --- VALIDATE SIGNATURE (MP v2) ---
            // See: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
            var mpSecret = config["MERCADOPAGO_WEBHOOK_SECRET"];
            if (string.IsNullOrEmpty(mpSecret))
            {
                logger.LogWarning("MERCADOPAGO_WEBHOOK_SECRET not configured. Rejecting webhook.");
                return Results.Unauthorized();
            }

            if (!context.Request.Headers.TryGetValue("x-signature", out var xSig) ||
                !context.Request.Headers.TryGetValue("x-request-id", out var xReqId))
            {
                logger.LogWarning("Webhook received without required headers.");
                return Results.Unauthorized();
            }

            var dataId = context.Request.Query["data.id"].ToString();
            var ts = context.Request.Query["ts"].ToString();
            var manifest = $"id:{dataId};request-id:{xReqId};ts:{ts}";
            var expected = ComputeHmac(manifest, mpSecret);

            var v1Part = xSig.ToString().Split(',').FirstOrDefault(p => p.Trim().StartsWith("v1="));
            var v1Sig = v1Part?.Split('=').LastOrDefault() ?? "";

            if (!CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(v1Sig), Encoding.UTF8.GetBytes(expected)))
            {
                logger.LogWarning("Webhook signature mismatch. Rejecting.");
                return Results.Unauthorized();
            }

            if (!long.TryParse(dataId, out var paymentId))
            {
                logger.LogWarning("Invalid data.id in webhook: {DataId}", dataId);
                return Results.Ok();
            }

            // --- CONSULT MP API - never trust webhook body alone ---
            string mpStatus; decimal mpAmount; string extRef;
            try
            {
                (mpStatus, mpAmount, extRef) = await mpServico.ConsultarPagamentoAsync(paymentId);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to consult MP payment {PaymentId}", paymentId);
                return Results.Problem(statusCode: 500, title: "Erro interno.");
            }

            if (!int.TryParse(extRef, out var pedidoId))
            {
                logger.LogWarning("Webhook PaymentId {PaymentId} has no valid external_reference", paymentId);
                return Results.Ok();
            }

            var pedido = await db.Pedidos.FindAsync(pedidoId);
            if (pedido is null)
            {
                logger.LogWarning("Webhook references unknown Pedido #{PedidoId}", pedidoId);
                return Results.Ok();
            }

            // --- IDEMPOTENCY ---
            if (pedido.StatusPagamento == PaymentStatus.Paid)
            {
                logger.LogInformation("Webhook for already-paid Pedido #{PedidoId}. Skipping.", pedidoId);
                return Results.Ok();
            }

            // --- VALIDATE AMOUNT (tolerance R$0.01) ---
            if (Math.Abs(mpAmount - pedido.Total) > 0.01m)
            {
                logger.LogWarning("SECURITY: Amount mismatch Pedido #{Id}. Expected:{Exp} Got:{Got}",
                    pedidoId, pedido.Total, mpAmount);
                return Results.Ok();
            }

            // --- STATE MACHINE TRANSITIONS ---
            switch (mpStatus)
            {
                case "approved":
                    if (pedido.StatusPedido == OrderStatus.PaymentPending)
                    {
                        pedido.StatusPagamento = PaymentStatus.Paid;
                        pedido.StatusPedido = OrderStatus.Paid;
                        pedido.DataPagamento = DateTime.UtcNow;
                        pedido.PagamentoExternoId = paymentId.ToString();
                        await db.SaveChangesAsync();
                        logger.LogInformation("Pedido #{Id} PAID via webhook. PaymentId:{PaymentId}", pedidoId, paymentId);
                        await wpServico.EnviarMensagemLojaAsync(
                            $"PAGAMENTO APROVADO - Pedido #{pedido.Id} de {pedido.NomeCliente}. Pode preparar!");
                    }
                    break;

                case "rejected":
                case "cancelled":
                    if (pedido.StatusPedido == OrderStatus.PaymentPending)
                    {
                        pedido.StatusPagamento = mpStatus == "rejected" ? PaymentStatus.Failed : PaymentStatus.Canceled;
                        pedido.StatusPedido = OrderStatus.Canceled;
                        await db.SaveChangesAsync();
                        logger.LogInformation("Pedido #{Id} payment {Status}", pedidoId, mpStatus);
                    }
                    break;
            }

            return Results.Ok();
        });
    }

    private static string ComputeHmac(string message, string secret)
    {
        var key = Encoding.UTF8.GetBytes(secret);
        var data = Encoding.UTF8.GetBytes(message);
        return Convert.ToHexString(HMACSHA256.HashData(key, data)).ToLower();
    }
}
