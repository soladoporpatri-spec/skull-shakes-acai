# -*- coding: utf-8 -*-
with open('skull-shakes-admin/src/components/dashboard/PagamentosPieChart.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# More robust regex for legend
content = re.sub(r'<Legend[\s\S]*?/>', '<Legend wrapperStyle={{ fontSize: "12px" }} formatter={(value) => <span style={{ color: "#a1a1aa" }}>{value}</span>} />', content)

with open('skull-shakes-admin/src/components/dashboard/PagamentosPieChart.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
