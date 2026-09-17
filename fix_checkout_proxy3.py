# -*- coding: utf-8 -*-
with open('web/src/components/checkout/CheckoutSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Remove the old API_URL logic and the fetch
old_block = r"// Public endpoint - no authentication header required\s*const API_URL = process\.env\.NEXT_PUBLIC_API_URL \|\| 'http://localhost:5210';\s*if \(API_URL\.includes\(\"localhost\"\)\) \{\s*alert\(\"ERRO: O navegador esta tentando enviar para Localhost porque o site na Vercel foi gerado ANTES de voce salvar a variavel de ambiente\. Va na Vercel -> Deployments -> Clique no ultimo deploy -> Redeploy\.\"\);\s*setStatus\('idle'\);\s*return;\s*\}\s*const response = await fetch\(\$\{API_URL\}/pedidos, \{"

new_block = """// Usando a rota de Proxy para contornar Adblock/Antivirus/Brave Shields
        const response = await fetch('/api/pedidos', {"""

content = re.sub(old_block, new_block, content)

with open('web/src/components/checkout/CheckoutSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
