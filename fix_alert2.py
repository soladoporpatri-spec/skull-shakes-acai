# -*- coding: utf-8 -*-
with open('web/src/components/checkout/CheckoutSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = "const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5210';"
replacement = """const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5210';
        
        if (API_URL.includes("localhost")) {
            alert("ERRO: O navegador esta tentando enviar para Localhost porque o site na Vercel foi gerado ANTES de voce salvar a variavel de ambiente. Va na Vercel -> Deployments -> Clique no ultimo deploy -> Redeploy.");
            setStatus('idle');
            return;
        }
"""
content = content.replace(target, replacement)
with open('web/src/components/checkout/CheckoutSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
