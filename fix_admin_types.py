# -*- coding: utf-8 -*-
with open('skull-shakes-admin/src/types/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

import re

old_item = r"""export interface ItemPedido \{
  quantidade: number;
  precoUnitario: number;
  produto: string;
\}"""

new_item = """export interface ItemPedido {
  quantidade: number;
  precoUnitario: number;
  produto: string;
  adicionais?: string[];
}"""

content = re.sub(old_item, new_item, content)

with open('skull-shakes-admin/src/types/index.ts', 'w', encoding='utf-8') as f:
    f.write(content)
