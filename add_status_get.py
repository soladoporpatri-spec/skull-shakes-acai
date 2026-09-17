# -*- coding: utf-8 -*-
with open('Backend/Endpoints/PedidoEndpoints.cs', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Insert the GET config status endpoint
new_endpoint = """        app.MapGet("/pedidos/configuracoes/status", async (AppDbContext db) =>
        {
            var config = await db.StoreSettings.FindAsync(1);
            return Results.Ok(new { isAberta = config?.IsAberta ?? true });
        });

        // --- NEW: PUBLIC ORDER TRACKING ENDPOINT ---"""

content = content.replace("        // --- NEW: PUBLIC ORDER TRACKING ENDPOINT ---", new_endpoint)

with open('Backend/Endpoints/PedidoEndpoints.cs', 'w', encoding='utf-8') as f:
    f.write(content)
