# -*- coding: utf-8 -*-
with open('C:/Users/solad/.gemini/antigravity/brain/538f070d-6bb8-435e-82c1-3cb815b0a9c3/task.md', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("- [ ] Implement CRUD /admin/motoboys in AdminEndpoints.cs", "- [x] Implement CRUD /admin/motoboys in AdminEndpoints.cs")
content = content.replace("- [ ] Implement PUT /admin/pedidos/{id}/motoboy", "- [x] Implement PUT /admin/pedidos/{id}/motoboy")
content = content.replace("- [ ] Implement GET /admin/relatorios/fechamento endpoint", "- [x] Implement GET /admin/relatorios/fechamento endpoint")
content = content.replace("- [ ] Update PedidoSheet.tsx to assign driver", "- [x] Update PedidoSheet.tsx to assign driver")
content = content.replace("- [ ] Create Frontend UI in /fechamento", "- [x] Create Frontend UI in /fechamento")

with open('C:/Users/solad/.gemini/antigravity/brain/538f070d-6bb8-435e-82c1-3cb815b0a9c3/task.md', 'w', encoding='utf-8') as f:
    f.write(content)
