# -*- coding: utf-8 -*-
import re

with open('web/src/components/checkout/CheckoutSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'formaPagamento: state.payment.method,',
    'formaPagamento: state.payment.method,\n        modalidadePagamento: state.payment.modality,'
)

with open('web/src/components/checkout/CheckoutSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
