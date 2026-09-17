# -*- coding: utf-8 -*-
import re

# Fix SeedData.cs
with open('Backend/BancoDeDados/SeedData.cs', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r', Categoria = "[^"]*", ImagemUrl = "", IsAtivo = true', '', content)
content = re.sub(r'IsDisponivel = true', 'Disponivel = true', content)

with open('Backend/BancoDeDados/SeedData.cs', 'w', encoding='utf-8') as f:
    f.write(content)

# Fix PedidoEndpoints.cs
with open('Backend/Endpoints/PedidoEndpoints.cs', 'r', encoding='utf-8') as f:
    content2 = f.read()

content2 = re.sub(r', Categoria = "Acai", ImagemUrl = "", IsAtivo = true', '', content2)
content2 = re.sub(r'IsDisponivel = true', 'Disponivel = true', content2)

with open('Backend/Endpoints/PedidoEndpoints.cs', 'w', encoding='utf-8') as f:
    f.write(content2)
