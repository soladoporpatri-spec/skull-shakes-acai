# -*- coding: utf-8 -*-
with open('skull-shakes-admin/src/components/dashboard/PagamentosPieChart.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Add Cash to COLORS
content = content.replace('PayOnDelivery: "#ef4444",', 'PayOnDelivery: "#ef4444",\n  Cash: "#10b981",')

# Fix legend color
# We can use formatter={(value) => <span style={{ color: "#a1a1aa" }}>{value}</span>}
legend_old = '<Legend\n\n              wrapperStyle={{ color: "#a1a1aa", fontSize: "12px" }}\n\n            />'
legend_new = '<Legend\n              wrapperStyle={{ fontSize: "12px" }}\n              formatter={(value) => <span style={{ color: "#a1a1aa" }}>{value}</span>}\n            />'

content = content.replace(legend_old, legend_new)

with open('skull-shakes-admin/src/components/dashboard/PagamentosPieChart.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
