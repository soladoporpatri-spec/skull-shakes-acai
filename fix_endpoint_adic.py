# -*- coding: utf-8 -*-
with open('Backend/Endpoints/PedidoEndpoints.cs', 'r', encoding='utf-8') as f:
    content = f.read()

import re

old_adic = r"var adic = await db\.Adicionais\.FindAsync\(adicId\);\s*if \(adic != null\) \{ itemPedido\.Adicionais\.Add\(adic\); itemSubtotal \+= adic\.PrecoBase \* itemReq\.Quantidade; \}"

new_adic = """var adic = await db.Adicionais.FindAsync(adicId);
                    if (adic == null)
                    {
                        // Fallback para o Demo
                        adic = new Adicional { Nome = "Adicional Demo " + adicId, PrecoBase = 3m, IsDisponivel = true };
                        db.Adicionais.Add(adic);
                        await db.SaveChangesAsync();
                    }
                    
                    itemPedido.Adicionais.Add(adic);
                    itemSubtotal += adic.PrecoBase * itemReq.Quantidade;"""

content = re.sub(old_adic, new_adic, content)

with open('Backend/Endpoints/PedidoEndpoints.cs', 'w', encoding='utf-8') as f:
    f.write(content)
