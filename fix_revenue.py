# -*- coding: utf-8 -*-
with open('skull-shakes-admin/src/app/(admin)/dashboard/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Update todayRevenue logic
old_revenue = """    const todayRevenue = todayPedidos
      .filter((p) => p.statusPagamento === "Paid")
      .reduce((sum, p) => sum + p.total, 0);"""

new_revenue = """    // Includes Paid orders AND orders that are PayOnDelivery (which will be paid) unless Canceled
    const todayRevenue = todayPedidos
      .filter((p) => p.statusPedido !== "Canceled" && (p.statusPagamento === "Paid" || p.formaPagamento === "PayOnDelivery" || p.formaPagamento === "Cash"))
      .reduce((sum, p) => sum + p.total, 0);"""

content = content.replace(old_revenue, new_revenue)

# Update description of Revenue card
content = content.replace('description="Pedidos pagos"', 'description="Pedidos pagos e a pagar"')

with open('skull-shakes-admin/src/app/(admin)/dashboard/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
