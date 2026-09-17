# -*- coding: utf-8 -*-
with open('web/src/components/checkout/CheckoutSection.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

out = []
skip = False
for line in lines:
    if "// Public endpoint" in line:
        skip = True
        out.append("        // Usando a rota de Proxy para contornar Adblock/Antivirus/Brave Shields\n")
        out.append("        const response = await fetch('/api/pedidos', {\n")
        continue
    
    if skip and "method: 'POST'," in line:
        skip = False
        out.append(line)
        continue
        
    if not skip:
        out.append(line)

with open('web/src/components/checkout/CheckoutSection.tsx', 'w', encoding='utf-8') as f:
    f.writelines(out)
