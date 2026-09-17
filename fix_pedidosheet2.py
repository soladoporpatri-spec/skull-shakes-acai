# -*- coding: utf-8 -*-
import re

with open('skull-shakes-admin/src/components/pedidos/PedidoSheet.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
'''              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>{paymentMethodLabels[pedido.formaPagamento]}</span>
              </div>''',
'''              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>{paymentMethodLabels[pedido.formaPagamento]} ({pedido.modalidadePagamento === 'Online' ? 'No site' : 'Na entrega'})</span>
              </div>'''
)

with open('skull-shakes-admin/src/components/pedidos/PedidoSheet.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
