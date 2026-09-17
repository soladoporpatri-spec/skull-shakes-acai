# -*- coding: utf-8 -*-
with open('web/src/components/checkout/CheckoutSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_fetch = '''        // Public endpoint - no authentication header required
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5210';
        const response = await fetch(${API_URL}/pedidos, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });'''

new_fetch = '''        // Public endpoint - no authentication header required
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5210';
        
        // DEBUG: Alert the URL so we know exactly where it's trying to connect
        if (API_URL.includes("localhost")) {
            alert("ERRO DE CONFIGURAÇÃO: O site está tentando enviar para o Localhost em vez do Servidor. Você precisa fazer o Redeploy na Vercel para injetar a variável NEXT_PUBLIC_API_URL.");
            setStatus('idle');
            return;
        }

        const response = await fetch(${API_URL}/pedidos, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });'''

if old_fetch in content:
    content = content.replace(old_fetch, new_fetch)
    with open('web/src/components/checkout/CheckoutSection.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected alert guard.")
else:
    print("Could not find fetch block.")
