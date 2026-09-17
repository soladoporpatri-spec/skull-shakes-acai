# -*- coding: utf-8 -*-
with open('Backend/Endpoints/PedidoEndpoints.cs', 'r', encoding='utf-8') as f:
    content = f.read()

# Add GET /configuracoes/status
content = content.replace(
    'var pedidos = app.MapGroup("/pedidos");',
    '''var pedidos = app.MapGroup("/pedidos");
        
        app.MapGet("/configuracoes/status", async (AppDbContext db) =>
        {
            var config = await db.StoreSettings.FindAsync(1);
            return Results.Ok(new { isAberta = config?.IsAberta ?? true });
        });'''
)

# Add check to POST /pedidos
content = content.replace(
    'pedidos.MapPost("/", async (PedidoRequest req, AppDbContext db, MercadoPagoServico mpServico, IDeliveryCalculator deliveryCalculator) =>',
    '''pedidos.MapPost("/", async (PedidoRequest req, AppDbContext db, MercadoPagoServico mpServico, IDeliveryCalculator deliveryCalculator) =>
        {
            var config = await db.StoreSettings.FindAsync(1);
            if (config != null && !config.IsAberta)
            {
                return Results.BadRequest("A loja está fechada no momento.");
            }'''
)
content = content.replace(
    '''pedidos.MapPost("/", async (PedidoRequest req, AppDbContext db, MercadoPagoServico mpServico, IDeliveryCalculator deliveryCalculator) =>
        {
            var config = await db.StoreSettings.FindAsync(1);
            if (config != null && !config.IsAberta)
            {
                return Results.BadRequest("A loja está fechada no momento.");
            }
        {''',
    '''pedidos.MapPost("/", async (PedidoRequest req, AppDbContext db, MercadoPagoServico mpServico, IDeliveryCalculator deliveryCalculator) =>
        {
            var config = await db.StoreSettings.FindAsync(1);
            if (config != null && !config.IsAberta)
            {
                return Results.BadRequest("A loja está fechada no momento.");
            }'''
)

with open('Backend/Endpoints/PedidoEndpoints.cs', 'w', encoding='utf-8') as f:
    f.write(content)
