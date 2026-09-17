# -*- coding: utf-8 -*-
with open('C:/Users/solad/.gemini/antigravity/brain/538f070d-6bb8-435e-82c1-3cb815b0a9c3/task.md', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("- [ ] Update StoreSettings.cs", "- [x] Update StoreSettings.cs")
content = content.replace("- [ ] Create Motoboy.cs", "- [x] Create Motoboy.cs")
content = content.replace("- [ ] Update Pedido.cs", "- [x] Update Pedido.cs")
content = content.replace("- [ ] Update AppDbContext.cs", "- [x] Update AppDbContext.cs")
content = content.replace("- [ ] Create and apply EF Core Migration", "- [x] Create and apply EF Core Migration")

with open('C:/Users/solad/.gemini/antigravity/brain/538f070d-6bb8-435e-82c1-3cb815b0a9c3/task.md', 'w', encoding='utf-8') as f:
    f.write(content)
