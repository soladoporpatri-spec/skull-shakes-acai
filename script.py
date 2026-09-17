with open('Backend/Endpoints/PedidoEndpoints.cs', 'r', encoding='utf-8') as f:
    content = f.read()
idx = content.find('formaPagamento = pedi')
print(content[idx:idx+400])
