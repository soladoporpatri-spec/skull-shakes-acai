# -*- coding: utf-8 -*-
with open('skull-shakes-admin/src/hooks/useProdutos.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('await api.get<Produto[]>("/cardapio");', 'await api.get<Produto[]>("/admin/produtos");')

with open('skull-shakes-admin/src/hooks/useProdutos.ts', 'w', encoding='utf-8') as f:
    f.write(content)
