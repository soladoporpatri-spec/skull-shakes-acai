# -*- coding: utf-8 -*-
with open('Backend/Endpoints/AdminEndpoints.cs', 'r', encoding='utf-8') as f:
    content = f.read()

import re

new_endpoints = """        admin.MapPut("/produtos/{id}/preco", async (
            int id, PrecoUpdateRequest request, AppDbContext db, ClaimsPrincipal user, ILogger<Program> logger) =>
        {
            if (request.NovoPreco <= 0) return Results.BadRequest("Preco invalido.");
            var produto = await db.Produtos.FindAsync(id);
            if (produto is null) return Results.NotFound();
            var anterior = produto.PrecoBase;
            produto.PrecoBase = request.NovoPreco;
            await db.SaveChangesAsync();
            logger.LogInformation("Admin {Admin} updated Produto #{Id} price {Old}->{New}", user.Identity?.Name, id, anterior, request.NovoPreco);
            return Results.Ok(produto);
        });

        // --- GESTAO DE ESTOQUE (ADICIONAIS) ---
        admin.MapGet("/adicionais", async (AppDbContext db) =>
        {
            var adicionais = await db.Adicionais.OrderBy(a => a.Nome).ToListAsync();
            return Results.Ok(adicionais);
        });

        admin.MapPut("/adicionais/{id}/toggle", async (int id, AppDbContext db, ClaimsPrincipal user, ILogger<Program> logger) =>
        {
            var adic = await db.Adicionais.FindAsync(id);
            if (adic == null) return Results.NotFound();

            adic.Disponivel = !adic.Disponivel;
            adic.IsDisponivel = adic.Disponivel; // Keep both synced just in case

            await db.SaveChangesAsync();
            logger.LogInformation("Admin {Admin} toggled Adicional #{Id} to {Status}", user.Identity?.Name, id, adic.Disponivel);
            
            return Results.Ok(adic);
        });"""

# We search for the MapPut preco endpoint to replace/append to it.
old_put_preco = r"""        admin\.MapPut\("/produtos/\{id\}/preco"[\s\S]*?return Results\.Ok\(produto\);\n        \}\);"""

content = re.sub(old_put_preco, new_endpoints, content)

with open('Backend/Endpoints/AdminEndpoints.cs', 'w', encoding='utf-8') as f:
    f.write(content)
