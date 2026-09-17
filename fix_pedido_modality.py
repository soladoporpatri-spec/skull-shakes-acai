# -*- coding: utf-8 -*-
import re

with open('Backend/Endpoints/PedidoEndpoints.cs', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'formaPagamento = pedido.FormaPagamento.ToString(),',
    'formaPagamento = pedido.FormaPagamento.ToString(),\n                modalidadePagamento = pedido.ModalidadePagamento.ToString(),'
)

with open('Backend/Endpoints/PedidoEndpoints.cs', 'w', encoding='utf-8') as f:
    f.write(content)
