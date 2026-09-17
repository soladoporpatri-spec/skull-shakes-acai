# -*- coding: utf-8 -*-
import re

with open('skull-shakes-admin/src/components/pedidos/PedidosTable.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'PayOnDelivery: "Pagar na Entrega"',
    'Cash: "Dinheiro"'
)

content = content.replace(
    '<TableHead>Pagamento</TableHead>',
    '<TableHead>Pagamento</TableHead>\n              <TableHead>Modalidade</TableHead>'
)

content = content.replace(
'''                      <TableCell className="text-sm">
                        {paymentMethodLabels[pedido.formaPagamento] || pedido.formaPagamento}
                      </TableCell>''',
'''                      <TableCell className="text-sm">
                        {paymentMethodLabels[pedido.formaPagamento] || pedido.formaPagamento}
                      </TableCell>
                      <TableCell className="text-sm">
                        {pedido.modalidadePagamento === 'Online' ? 'No Site' : 'Na Entrega'}
                      </TableCell>'''
)

with open('skull-shakes-admin/src/components/pedidos/PedidosTable.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
