using Microsoft.EntityFrameworkCore;
using SkullShakes.Api.BancoDeDados;
using SkullShakes.Api.DTOs;
using SkullShakes.Api.Enums;
using SkullShakes.Api.Modelos;
using SkullShakes.Api.Servicos;

namespace SkullShakes.Api.Endpoints;

public static class PedidoEndpoints
{
    public static void MapPedidoEndpoints(this WebApplication app)
    {
        app.MapPost("/pedidos", async (
            PedidoRequest request,
            AppDbContext db,
            MercadoPagoServico mpServico,
            WhatsAppServico wpServico,
            IDeliveryCalculator entregaServico,
            ILogger<Program> logger) =>
        {
            // --- IDEMPOTENCY CHECK ---
            if (!string.IsNullOrEmpty(request.IdempotencyKey))
            {
                var existing = await db.Pedidos.FirstOrDefaultAsync(p => p.IdempotencyKey == request.IdempotencyKey);
                if (existing is not null)
                {
                    logger.LogInformation("Duplicate IdempotencyKey {Key}. Returning existing Pedido #{Id}", request.IdempotencyKey, existing.Id);
                    return Results.Ok(new PedidoCreatedResponse
                    {
                        PedidoId = existing.Id,
                        FormaPagamento = existing.FormaPagamento.ToString(),
                        StatusPagamento = existing.StatusPagamento.ToString(),
                        Mensagem = "Pedido ja registrado."
                    });
                }
            }

            // --- INPUT VALIDATION ---
            if (string.IsNullOrWhiteSpace(request.NomeCliente)) return Results.BadRequest("Nome do cliente e obrigatorio.");
            if (string.IsNullOrWhiteSpace(request.Telefone)) return Results.BadRequest("Telefone e obrigatorio.");
            if (string.IsNullOrWhiteSpace(request.Endereco)) return Results.BadRequest("Endereco e obrigatorio.");
            if (!request.Itens.Any()) return Results.BadRequest("O pedido deve conter pelo menos um item.");

            if (!Enum.TryParse<PaymentMethod>(request.FormaPagamento, out var formaPagamento))
                return Results.BadRequest($"Forma de pagamento invalida: {request.FormaPagamento}");

            foreach (var item in request.Itens)
                if (item.Quantidade <= 0 || item.Quantidade > 50)
                    return Results.BadRequest($"Quantidade invalida para produto {item.ProdutoId}.");

            // --- BUILD ORDER ---
            var nome = request.NomeCliente.Trim();
            var pedido = new Pedido
            {
                NomeCliente = nome[..Math.Min(nome.Length, 100)],
                Telefone = request.Telefone.Trim()[..Math.Min(request.Telefone.Trim().Length, 20)],
                Endereco = request.Endereco.Trim()[..Math.Min(request.Endereco.Trim().Length, 300)],
                Observacoes = (request.Observacoes ?? "").Trim()[..Math.Min((request.Observacoes ?? "").Trim().Length, 500)],
                FormaPagamento = formaPagamento,
                StatusPedido = OrderStatus.Pending,
                StatusPagamento = PaymentStatus.Pending,
                IdempotencyKey = request.IdempotencyKey
            };

            // --- ZERO-TRUST: Prices from DB only ---
            decimal subtotal = 0;
            foreach (var itemReq in request.Itens)
            {
                var produto = await db.Produtos.FindAsync(itemReq.ProdutoId);
                if (produto == null) return Results.BadRequest($"Produto {itemReq.ProdutoId} nao encontrado.");

                var itemPedido = new ItemPedido
                {
                    ProdutoId = produto.Id,
                    Quantidade = itemReq.Quantidade,
                    PrecoUnitario = produto.PrecoBase  // Trusted: always from DB
                };

                decimal itemSubtotal = produto.PrecoBase * itemReq.Quantidade;

                foreach (var adicId in itemReq.AdicionaisIds)
                {
                    var adic = await db.Adicionais.FindAsync(adicId);
                    if (adic != null) { itemPedido.Adicionais.Add(adic); itemSubtotal += adic.PrecoBase * itemReq.Quantidade; }
                }

                pedido.Itens.Add(itemPedido);
                subtotal += itemSubtotal;
            }

            // --- DELIVERY FEE ---
            var deliveryFee = request.DeliveryFee ?? await entregaServico.CalcularTaxaAsync(request.Cep);

            pedido.Subtotal = subtotal;
            pedido.Discount = 0;
            pedido.DeliveryFee = deliveryFee;
            pedido.Total = subtotal + deliveryFee;

            db.Pedidos.Add(pedido);
            await db.SaveChangesAsync();

            logger.LogInformation("Pedido #{Id} created. Total:{Total} Method:{Method}", pedido.Id, pedido.Total, formaPagamento);

            // --- PAYMENT ROUTING ---
            switch (formaPagamento)
            {
                case PaymentMethod.Pix:
                {
                    pedido.StatusPedido = OrderStatus.PaymentPending;
                    pedido.StatusPagamento = PaymentStatus.Pending;
                    await db.SaveChangesAsync();

                    var pix = await mpServico.GerarPixAsync(pedido.Id, pedido.Total, pedido.NomeCliente);
                    pedido.PagamentoExternoId = pix.TransacaoId.ToString();
                    await db.SaveChangesAsync();

                    return Results.Ok(new PedidoCreatedResponse
                    {
                        PedidoId = pedido.Id, FormaPagamento = "Pix",
                        StatusPagamento = pedido.StatusPagamento.ToString(), Pix = pix
                    });
                }

                case PaymentMethod.CreditCard:
                case PaymentMethod.DebitCard:
                {
                    pedido.StatusPedido = OrderStatus.PaymentPending;
                    pedido.StatusPagamento = PaymentStatus.Pending;
                    await db.SaveChangesAsync();

                    // TODO: Replace with your production domain URLs
                    var successUrl = "https://skullshakes.com.br/pedido/sucesso";
                    var failureUrl = "https://skullshakes.com.br/pedido/falha";

                    var (checkoutUrl, prefId) = await mpServico.GerarPreferenciaCartaoAsync(
                        pedido.Id, pedido.Total, $"Pedido #{pedido.Id} - Skull Shakes", successUrl, failureUrl);

                    pedido.PagamentoExternoId = prefId;
                    await db.SaveChangesAsync();

                    return Results.Ok(new PedidoCreatedResponse
                    {
                        PedidoId = pedido.Id, FormaPagamento = formaPagamento.ToString(),
                        StatusPagamento = pedido.StatusPagamento.ToString(),
                        CheckoutUrl = checkoutUrl, PreferenceId = prefId
                    });
                }

                case PaymentMethod.PayOnDelivery:
                {
                    pedido.StatusPedido = OrderStatus.Processing;
                    pedido.StatusPagamento = PaymentStatus.Pending;
                    await db.SaveChangesAsync();

                    await wpServico.EnviarMensagemLojaAsync(
                        $"Novo pedido #{pedido.Id} de {pedido.NomeCliente}! Total: R$ {pedido.Total:N2}. Pagar na entrega.");

                    return Results.Ok(new PedidoCreatedResponse
                    {
                        PedidoId = pedido.Id, FormaPagamento = "PayOnDelivery",
                        StatusPagamento = pedido.StatusPagamento.ToString(),
                        Mensagem = "Pedido recebido! O pagamento sera realizado na entrega."
                    });
                }

                default:
                    return Results.BadRequest("Forma de pagamento nao suportada.");
            }
        });

        // --- NEW: PUBLIC ORDER TRACKING ENDPOINT ---
        app.MapGet("/pedidos/{id:int}", async (int id, AppDbContext db) =>
        {
            var pedido = await db.Pedidos
                .AsNoTracking()
                .Include(p => p.Itens)
                    .ThenInclude(i => i.Produto)
                .Include(p => p.Itens)
                    .ThenInclude(i => i.Adicionais)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pedido == null)
                return Results.NotFound();

            return Results.Ok(new 
            {
                id = pedido.Id,
                nomeCliente = pedido.NomeCliente,
                total = pedido.Total,
                statusPedido = pedido.StatusPedido.ToString(),
                statusPagamento = pedido.StatusPagamento.ToString(),
                formaPagamento = pedido.FormaPagamento.ToString(),
                dataCriacao = pedido.DataPedido
            });
        });
    }
}
