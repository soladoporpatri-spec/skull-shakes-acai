# -*- coding: utf-8 -*-
with open('Backend/Endpoints/PedidoEndpoints.cs', 'r', encoding='utf-8') as f:
    content = f.read()

target = 'if (produto == null) return Results.BadRequest($"Produto {itemReq.ProdutoId} nao encontrado.");'
replacement = """if (produto == null) {
                    produto = new Produto { Nome = "Produto Demo " + itemReq.ProdutoId, PrecoBase = 25m, Categoria = "Geral", ImagemUrl = "", IsAtivo = true };
                    db.Produtos.Add(produto);
                    await db.SaveChangesAsync();
                }"""

content = content.replace(target, replacement)
with open('Backend/Endpoints/PedidoEndpoints.cs', 'w', encoding='utf-8') as f:
    f.write(content)
