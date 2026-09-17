# -*- coding: utf-8 -*-
with open('web/src/components/checkout/CheckoutSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5210';
        
        if (API_URL.includes("localhost")) {
            alert("ERRO: O site está tentando enviar para o Localhost. Isso significa que a Vercel não leu sua variável de ambiente. Vá na Vercel -> Deployments -> Clique em Redeploy e aguarde.");
            setStatus('idle');
            return;
        }

        const response = await fetch(${API_URL}/pedidos, {"""

import re
content = re.sub(r"const API_URL = process\.env\.NEXT_PUBLIC_API_URL \|\| 'http://localhost:5210';\s*const response = await fetch\(\$\{API_URL\}/pedidos, \{", replacement, content)

with open('web/src/components/checkout/CheckoutSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
