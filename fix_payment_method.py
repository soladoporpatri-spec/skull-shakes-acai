# -*- coding: utf-8 -*-
with open('Backend/Endpoints/AdminEndpoints.cs', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("p.FormaPagamento == PaymentMethod.PayOnDelivery || p.FormaPagamento == PaymentMethod.Cash", "p.FormaPagamento == PaymentMethod.Cash")

with open('Backend/Endpoints/AdminEndpoints.cs', 'w', encoding='utf-8') as f:
    f.write(content)
