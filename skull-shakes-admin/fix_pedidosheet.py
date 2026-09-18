# -*- coding: utf-8 -*-
with open('src/components/pedidos/PedidoSheet.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("m.motoboyId", "m.id")
content = content.replace("m.motoboyNome", "m.nome")
content = content.replace("pedidoId: pedido.id", "id: pedido.id")

content = content.replace('"Ready"', '"Processing"')
content = content.replace('"InTransit"', '"Shipped"')
content = content.replace('"Cancelled"', '"Canceled"')

with open('src/components/pedidos/PedidoSheet.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
