import re

with open('Backend/Endpoints/PedidoEndpoints.cs', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Enum.TryParse for FormaPagamento
content = content.replace(
'''            if (!Enum.TryParse<PaymentMethod>(request.FormaPagamento, out var formaPagamento))
                return Results.BadRequest($"Forma de pagamento invalida: {request.FormaPagamento}");''',
'''            if (!Enum.TryParse<PaymentMethod>(request.FormaPagamento, out var formaPagamento))
                return Results.BadRequest($"Forma de pagamento invalida: {request.FormaPagamento}");
            
            if (!Enum.TryParse<PaymentModality>(request.ModalidadePagamento, out var modalidade))
                modalidade = PaymentModality.Online;
            
            if (formaPagamento == PaymentMethod.Cash && modalidade == PaymentModality.Online)
                return Results.BadRequest("Dinheiro so pode ser pago na entrega.");'''
)

# Replace Pedido creation block to include Modalidade
content = content.replace(
'''                Observacoes = (request.Observacoes ?? "").Trim()[..Math.Min((request.Observacoes ?? "").Trim().Length, 500)],
                FormaPagamento = formaPagamento,''',
'''                Observacoes = (request.Observacoes ?? "").Trim()[..Math.Min((request.Observacoes ?? "").Trim().Length, 500)],
                FormaPagamento = formaPagamento,
                ModalidadePagamento = modalidade,'''
)

# Replace the Routing Switch
old_switch = '''            // --- PAYMENT ROUTING ---
            switch (formaPagamento)
            {
                case PaymentMethod.Pix:
                {
                    var pix = await mp.GerarPixAsync(pedido.Total, pedido.Id.ToString());
                    
                    pedido.StatusPedido = OrderStatus.PaymentPending;
                    pedido.StatusPagamento = PaymentStatus.Pending;
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
                    var (checkoutUrl, prefId) = await mp.GerarPreferenciaCartaoAsync(pedido, deliveryFee);
                    
                    pedido.StatusPedido = OrderStatus.PaymentPending;
                    pedido.StatusPagamento = PaymentStatus.Pending;
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
                {
                    pedido.StatusPedido = OrderStatus.Preparing;
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
            }'''

new_switch = '''            // --- PAYMENT ROUTING ---
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
                    var pix = await mp.GerarPixAsync(pedido.Total, pedido.Id.ToString());
                    
                    pedido.StatusPedido = OrderStatus.PaymentPending;
                    pedido.StatusPagamento = PaymentStatus.Pending;
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
                    var (checkoutUrl, prefId) = await mp.GerarPreferenciaCartaoAsync(pedido, deliveryFee);
                    
                    pedido.StatusPedido = OrderStatus.PaymentPending;
                    pedido.StatusPagamento = PaymentStatus.Pending;
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
            }'''

if old_switch in content:
    content = content.replace(old_switch, new_switch)
else:
    print("WARNING: Switch block not found exactly as expected!")

with open('Backend/Endpoints/PedidoEndpoints.cs', 'w', encoding='utf-8') as f:
    f.write(content)
