# -*- coding: utf-8 -*-
with open('C:/Users/solad/.gemini/antigravity/brain/538f070d-6bb8-435e-82c1-3cb815b0a9c3/task.md', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("- [ ] Fix ReceitaHoje calculation in page.tsx", "- [x] Fix ReceitaHoje calculation in page.tsx")
content = content.replace("- [ ] Fix PieChart legend colors in PagamentosPieChart.tsx", "- [x] Fix PieChart legend colors in PagamentosPieChart.tsx")

with open('C:/Users/solad/.gemini/antigravity/brain/538f070d-6bb8-435e-82c1-3cb815b0a9c3/task.md', 'w', encoding='utf-8') as f:
    f.write(content)
