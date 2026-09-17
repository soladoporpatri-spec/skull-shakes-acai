# -*- coding: utf-8 -*-
with open('C:/Users/solad/.gemini/antigravity/brain/538f070d-6bb8-435e-82c1-3cb815b0a9c3/task.md', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("- [ ] Update PedidoEndpoints.cs (GET /pedidos/configuracoes/status) to evaluate BRT time", "- [x] Update PedidoEndpoints.cs (GET /pedidos/configuracoes/status) to evaluate BRT time")
content = content.replace("- [ ] Create GET /admin/configuracoes and PUT /admin/configuracoes for schedule", "- [x] Create GET /admin/configuracoes and PUT /admin/configuracoes for schedule")
content = content.replace("- [ ] Create Frontend UI in /configuracoes with manual override logic", "- [x] Create Frontend UI in /configuracoes with manual override logic")

with open('C:/Users/solad/.gemini/antigravity/brain/538f070d-6bb8-435e-82c1-3cb815b0a9c3/task.md', 'w', encoding='utf-8') as f:
    f.write(content)
