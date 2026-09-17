# -*- coding: utf-8 -*-
import re

with open('web/src/hooks/useCheckout.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'payment: { method: string; needsChange: boolean; changeFor: string; };',
    'payment: { method: string; modality: string; needsChange: boolean; changeFor: string; };'
)
content = content.replace(
    "payment: { method: 'Pix', needsChange: false, changeFor: '' },",
    "payment: { method: 'Pix', modality: 'Online', needsChange: false, changeFor: '' },"
)

with open('web/src/hooks/useCheckout.ts', 'w', encoding='utf-8') as f:
    f.write(content)
