# -*- coding: utf-8 -*-
with open('web/src/components/checkout/CheckoutSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("alert(ALERTA DE DEBUG:\\nURL:  + API_URL + \\nERRO:  + msg + \\n\\nSe o erro for 'Failed to fetch', DESATIVE O ESCUDO DO BRAVE (leaozinho) ou outro AdBlock. Ele bloqueia pedidos pra APIs externas.);", "")

# The actual string I used was double quotes:
old = 'alert("ALERTA DE DEBUG:\\nURL: " + API_URL + "\\nERRO: " + msg + "\\n\\nSe o erro for \'Failed to fetch\', DESATIVE O ESCUDO DO BRAVE (leaozinho) ou outro AdBlock. Ele bloqueia pedidos pra APIs externas.");'

new = 'const fallbackUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5210"; alert("ALERTA DE DEBUG:\\nURL: " + fallbackUrl + "\\nERRO: " + msg + "\\n\\nSe o erro for \'Failed to fetch\', DESATIVE O ESCUDO DO BRAVE (leaozinho) ou outro AdBlock. Ele bloqueia pedidos pra APIs externas.");'

content = content.replace(old, new)

with open('web/src/components/checkout/CheckoutSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
