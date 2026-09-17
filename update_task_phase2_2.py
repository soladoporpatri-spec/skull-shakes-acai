# -*- coding: utf-8 -*-
with open('C:/Users/solad/.gemini/antigravity/brain/538f070d-6bb8-435e-82c1-3cb815b0a9c3/task.md', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("- [ ] Implement GET /admin/adicionais and PUT /admin/adicionais/{id}/toggle in AdminEndpoints.cs", "- [x] Implement GET /admin/adicionais and PUT /admin/adicionais/{id}/toggle in AdminEndpoints.cs")
content = content.replace("- [ ] Create Frontend UI in /produtos/adicionais", "- [x] Create Frontend UI in /produtos/adicionais")

with open('C:/Users/solad/.gemini/antigravity/brain/538f070d-6bb8-435e-82c1-3cb815b0a9c3/task.md', 'w', encoding='utf-8') as f:
    f.write(content)
