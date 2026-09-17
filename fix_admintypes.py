# -*- coding: utf-8 -*-
import re

with open('skull-shakes-admin/src/types/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'formaPagamento: string;',
    'formaPagamento: string;\n  modalidadePagamento: string;'
)

with open('skull-shakes-admin/src/types/index.ts', 'w', encoding='utf-8') as f:
    f.write(content)
