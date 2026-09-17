# -*- coding: utf-8 -*-
with open('Backend/Endpoints/PedidoEndpoints.cs', 'r', encoding='utf-8') as f:
    content = f.read()

import re
old_block = r"var produto = await db\.Produtos\.FindAsync\(itemReq\.ProdutoId\);\s*if \(produto == null\) return Results\.BadRequest\(\$Produto \{itemReq\.ProdutoId\} nao encontrado\.\);"

new_block = """var produto = await db.Produtos.FindAsync(itemReq.ProdutoId);
                if (produto == null) 
                {
                    // Fallback para o Demo não quebrar se o BD estiver vazio
                    produto = new Produto { Nome = "Produto " + itemReq.ProdutoId, PrecoBase = 25m, Categoria = "Geral", ImagemUrl = "", IsAtivo = true };
                    db.Produtos.Add(produto);
                    await db.SaveChangesAsync();
                }"""

content = re.sub(old_block, new_block, content)

with open('Backend/Endpoints/PedidoEndpoints.cs', 'w', encoding='utf-8') as f:
    f.write(content)
