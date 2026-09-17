# -*- coding: utf-8 -*-
with open('web/src/components/checkout/CheckoutSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Remove the alert
content = re.sub(r"const fallbackUrl = process\.env\.NEXT_PUBLIC_API_URL \|\| \"http://localhost:5210\"; alert\(\"ALERTA DE DEBUG:\\nURL: \" \+ fallbackUrl \+ \"\\nERRO: \" \+ msg \+ \"\\n\\nSe o erro for 'Failed to fetch', DESATIVE O ESCUDO DO BRAVE \(leaozinho\) ou outro AdBlock\. Ele bloqueia pedidos pra APIs externas\.\"\);", "alert(\"Houve uma falha na comunicação. Verifique sua conexão e tente novamente.\");", content)

with open('web/src/components/checkout/CheckoutSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
