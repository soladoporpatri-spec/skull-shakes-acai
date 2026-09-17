# -*- coding: utf-8 -*-
with open('web/src/components/checkout/CheckoutSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("adicionaisIds: [] as number[],", "adicionaisIds: item.options?.map((o: any) => o.id).filter(Boolean) || [],")

with open('web/src/components/checkout/CheckoutSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
