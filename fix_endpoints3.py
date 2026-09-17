# -*- coding: utf-8 -*-
import re

with open('Backend/Endpoints/PedidoEndpoints.cs', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(r'// --- PAYMENT ROUTING ---.*?default:.*?return Results\.BadRequest\([^)]+\);\s*\}\s*\}\);', re.DOTALL)

new_switch = '''// --- PAYMENT ROUTING ---
            if (modalidade == PaymentModality.OnDelivery)
            {
                pedido.StatusPedido = OrderStatus.Preparing;
                pedido.StatusPagamento = PaymentStatus.Pending;
                await db.SaveChangesAsync();
                
                await wpServico.EnviarMensagemLojaAsync(
                    $"Novo pedido #{pedido.Id} de {pedido.NomeCliente}! Total: R$ {pedido.Total:N2}. Pagar na entrega ({formaPagamento}).");

                return Results.Ok(new PedidoCreatedResponse
                {
                    PedidoId = pedido.Id, 
                    FormaPagamento = formaPagamento.ToString(),
                    StatusPagamento = pedido.StatusPagamento.ToString(),
                    Mensagem = "Pedido recebido! O pagamento sera realizado na entrega."
                });
            }

            // Online Payment Routing
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
                    var successUrl = "https://skullshakes-acai.vercel.app/tracking/" + pedido.Id;
                    var failureUrl = "https://skullshakes-acai.vercel.app/tracking/" + pedido.Id;

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

                default:
                    return Results.BadRequest("Método de pagamento não suportado para pagamento online.");
            }
        });'''

new_content = pattern.sub(new_switch, content)

with open('Backend/Endpoints/PedidoEndpoints.cs', 'w', encoding='utf-8') as f:
    f.write(new_content)
