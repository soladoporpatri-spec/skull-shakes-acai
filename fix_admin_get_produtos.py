# -*- coding: utf-8 -*-
with open('Backend/Endpoints/AdminEndpoints.cs', 'r', encoding='utf-8') as f:
    content = f.read()

import re

new_get = """        admin.MapGet("/produtos", async (AppDbContext db) =>
        {
            var produtos = await db.Produtos.OrderBy(p => p.Nome).ToListAsync();
            return Results.Ok(produtos);
        });

        admin.MapPost("/produtos/upload","""

content = content.replace('admin.MapPost("/produtos/upload",', new_get)

with open('Backend/Endpoints/AdminEndpoints.cs', 'w', encoding='utf-8') as f:
    f.write(content)
