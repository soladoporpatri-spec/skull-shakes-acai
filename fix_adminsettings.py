# -*- coding: utf-8 -*-
with open('Backend/Endpoints/AdminEndpoints.cs', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'public record StatusUpdateRequest(string? Status, string? PaymentStatus);',
    '''public record StatusUpdateRequest(string? Status, string? PaymentStatus);
public record StoreStatusRequest(bool IsAberta);'''
)

content = content.replace(
    'admin.MapPost("/produtos", async (Produto produto, AppDbContext db) =>',
    '''admin.MapPut("/configuracoes/status", async (StoreStatusRequest req, AppDbContext db) =>
        {
            var config = await db.StoreSettings.FindAsync(1);
            if (config == null)
            {
                config = new StoreSettings { Id = 1, IsAberta = req.IsAberta };
                db.StoreSettings.Add(config);
            }
            else
            {
                config.IsAberta = req.IsAberta;
            }
            await db.SaveChangesAsync();
            return Results.Ok(new { isAberta = config.IsAberta });
        });
        
        admin.MapPost("/produtos", async (Produto produto, AppDbContext db) =>'''
)

with open('Backend/Endpoints/AdminEndpoints.cs', 'w', encoding='utf-8') as f:
    f.write(content)
