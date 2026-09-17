# -*- coding: utf-8 -*-
with open('web/src/components/checkout/CheckoutSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# find: const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5210';
# followed by const response = await fetch(${API_URL}/pedidos...
pattern = r"(const API_URL = process\.env\.NEXT_PUBLIC_API_URL \|\| 'http://localhost:5210';\s*const response = await fetch\(\$\{API_URL\}/pedidos, \{)"

replacement = r"""const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5210';
        
        if (API_URL.includes("localhost")) {
            alert("ERRO DE CONFIGURAÇÃO VERCEL: O código no seu navegador ainda está tentando conectar no localhost. A Vercel NÃO injetou a variável NEXT_PUBLIC_API_URL. Por favor, vá na aba Deployments da Vercel e clique em REDEPLOY para forçar ela a ler a variável que você adicionou.");
            setStatus('idle');
            return;
        }
        
        const response = await fetch(${API_URL}/pedidos, {"""

content = re.sub(pattern, replacement, content)

with open('web/src/components/checkout/CheckoutSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Regex injected")
