using Microsoft.AspNetCore.Mvc;
using SkullShakes.Api.BancoDeDados;
using SkullShakes.Api.Servicos;

namespace SkullShakes.Api.Endpoints;

public static class WebhookEndpoints
{
    public static void MapWebhookEndpoints(this WebApplication app)
    {
        // Mock payload do mercado pago (simplificado)
        app.MapPost("/api/webhooks/pix", async ([FromBody] WebhookPayload payload, AppDbContext db, WhatsAppServico whats) =>
        {
            var pedido = await db.Pedidos.FindAsync(payload.PedidoId);
            if (pedido != null && !pedido.Pago && payload.Status == "approved")
            {
                pedido.Pago = true;
                pedido.Status = "Preparando";
                await db.SaveChangesAsync();

                await whats.NotificarNovaVendaAsync($"✅ NOVO PEDIDO PAGO!\n\nCliente: {pedido.NomeCliente}\nTotal: R$ {pedido.Total}\nStatus: PAGO (Pix)");
            }

            return Results.Ok();
        });
    }
}

public class WebhookPayload
{
    public Guid PedidoId { get; set; }
    public string Status { get; set; } = string.Empty;
}
