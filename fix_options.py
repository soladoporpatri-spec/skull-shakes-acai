# -*- coding: utf-8 -*-
with open('web/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

old_options = r"options:\s*\[\s*\{\s*name:\s*'Banana',\s*price:\s*3\s*\},\s*\{\s*name:\s*'Morango',\s*price:\s*3\s*\},\s*\{\s*name:\s*'Pa.oca',\s*price:\s*3\s*\},\s*\{\s*name:\s*'Ninho',\s*price:\s*3\s*\},\s*\{\s*name:\s*'Guaran.',\s*price:\s*3\s*\},\s*\{\s*name:\s*'Nutella',\s*price:\s*5\s*\}\s*\]"

new_options = """options: [
              { id: 1, name: 'Banana', price: 3 },
              { id: 2, name: 'Morango', price: 3 },
              { id: 3, name: 'Paçoca', price: 3 },
              { id: 4, name: 'Ninho', price: 3 },
              { id: 5, name: 'Guaraná', price: 3 },
              { id: 6, name: 'Nutella', price: 5 }
            ]"""

content = re.sub(old_options, new_options, content)

with open('web/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
