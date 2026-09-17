# -*- coding: utf-8 -*-
import re

with open('Backend/Endpoints/AdminEndpoints.cs', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'formaPagamento = p.FormaPagamento.ToString(),',
    'formaPagamento = p.FormaPagamento.ToString(), modalidadePagamento = p.ModalidadePagamento.ToString(),'
)

with open('Backend/Endpoints/AdminEndpoints.cs', 'w', encoding='utf-8') as f:
    f.write(content)
