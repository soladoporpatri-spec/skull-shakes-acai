# -*- coding: utf-8 -*-
with open('web/src/components/checkout/CheckoutSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("const res = await fetch(${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5210'}/pedidos/configuracoes/status);", "const res = await fetch('/api/status');")

with open('web/src/components/checkout/CheckoutSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
