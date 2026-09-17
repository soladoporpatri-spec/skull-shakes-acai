# -*- coding: utf-8 -*-
with open('web/src/components/checkout/CheckoutSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("alert(\"Houve uma falha na comunicação. Verifique sua conexão e tente novamente.\");", "alert(msg);")

with open('web/src/components/checkout/CheckoutSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
