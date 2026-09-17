# -*- coding: utf-8 -*-
with open('web/src/store/cartStore.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("export interface CartOption {\n  name: string;\n  price: number;\n}", "export interface CartOption {\n  id: number;\n  name: string;\n  price: number;\n}")

with open('web/src/store/cartStore.ts', 'w', encoding='utf-8') as f:
    f.write(content)
