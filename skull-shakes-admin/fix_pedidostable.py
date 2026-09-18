# -*- coding: utf-8 -*-
with open('src/components/pedidos/PedidosTable.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('"Ready"', '"Processing"')
content = content.replace('"InTransit"', '"Shipped"')
content = content.replace('"Cancelled"', '"Canceled"')
content = content.replace('"Confirmed"', '"Processing"')

with open('src/components/pedidos/PedidosTable.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
