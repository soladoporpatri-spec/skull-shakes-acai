# -*- coding: utf-8 -*-
with open('C:/Users/solad/.gemini/antigravity/brain/538f070d-6bb8-435e-82c1-3cb815b0a9c3/task.md', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("- [ ] Update usePedidos.ts to add efetchInterval: 10000", "- [x] Update usePedidos.ts to add efetchInterval: 10000")
content = content.replace("- [ ] Implement audio notification for new orders", "- [x] Implement audio notification for new orders")

with open('C:/Users/solad/.gemini/antigravity/brain/538f070d-6bb8-435e-82c1-3cb815b0a9c3/task.md', 'w', encoding='utf-8') as f:
    f.write(content)
