# -*- coding: utf-8 -*-
with open('web/src/components/checkout/CheckoutSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# find: alert(e.message || 'Ocorreu um erro ao realizar o pedido.');
old_alert = "alert(e.message || 'Ocorreu um erro ao realizar o pedido.');"
new_alert = "alert(DEBUG ERRO FETCH:\\nURL Tentada: /pedidos\\nErro: \\n\\nSe o erro for 'Failed to fetch', DESATIVE O ESCUDO DO BRAVE (leaozinho no topo) ou qualquer AdBlock, pois ele esta bloqueando a API.);"

content = content.replace(old_alert, new_alert)

with open('web/src/components/checkout/CheckoutSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
