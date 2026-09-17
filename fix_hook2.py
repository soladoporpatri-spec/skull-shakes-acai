# -*- coding: utf-8 -*-
with open('web/src/hooks/useCheckout.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "payment: { method: '', needsChange: false, changeFor: '' },",
    "payment: { method: 'Pix', modality: 'Online', needsChange: false, changeFor: '' },"
)

with open('web/src/hooks/useCheckout.ts', 'w', encoding='utf-8') as f:
    f.write(content)
