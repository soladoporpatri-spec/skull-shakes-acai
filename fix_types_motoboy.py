# -*- coding: utf-8 -*-
with open('skull-shakes-admin/src/types/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

import re

content = content.replace("  idempotencyKey?: string;", "  idempotencyKey?: string;\n  motoboyId?: number;")

with open('skull-shakes-admin/src/types/index.ts', 'w', encoding='utf-8') as f:
    f.write(content)
