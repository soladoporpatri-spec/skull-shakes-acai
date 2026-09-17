# -*- coding: utf-8 -*-
with open('web/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("id: 'ss-trad-1'", "id: '1'")
content = content.replace("id: 'ss-trad-2'", "id: '2'")
content = content.replace("id: 'ss-trad-custom'", "id: '3'")
content = content.replace("id: 'ss-trad-nutella'", "id: '4'")
content = content.replace("id: 'ss-pacoca-nutella'", "id: '5'")
content = content.replace("id: 'ss-limao-nutella'", "id: '6'")
content = content.replace("id: 'ss-morango-nutella'", "id: '7'")
content = content.replace("id: 'ss-maracuja-nutella'", "id: '8'")

with open('web/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
