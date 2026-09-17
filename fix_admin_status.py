# -*- coding: utf-8 -*-
import re

with open('Backend/Endpoints/AdminEndpoints.cs', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'public record StatusUpdateRequest(string Status);',
    'public record StatusUpdateRequest(string? Status, string? PaymentStatus);'
)

old_endpoint = '''        admin.MapPut("/pedidos/{id}/status", async (
            int id, StatusUpdateRequest request, AppDbContext db, ClaimsPrincipal user, ILogger<Program> logger) =>
        {
            var pedido = await db.Pedidos.FindAsync(id);
            if (pedido is null) return Results.NotFound();
            if (!Enum.TryParse<OrderStatus>(request.Status, out var novoStatus)) return Results.BadRequest("Status invalido.");
            var anterior = pedido.StatusPedido;
            pedido.StatusPedido = novoStatus;
            await db.SaveChangesAsync();
            logger.LogInformation("Admin {Admin} updated Pedido #{Id} from {Old} to {New}", user.Identity?.Name, id, anterior, novoStatus);
            return Results.Ok(new { pedido.Id, StatusPedido = pedido.StatusPedido.ToString() });
        });'''

new_endpoint = '''        admin.MapPut("/pedidos/{id}/status", async (
            int id, StatusUpdateRequest request, AppDbContext db, ClaimsPrincipal user, ILogger<Program> logger) =>
        {
            var pedido = await db.Pedidos.FindAsync(id);
            if (pedido is null) return Results.NotFound();
            
            if (!string.IsNullOrWhiteSpace(request.Status))
            {
                if (!Enum.TryParse<OrderStatus>(request.Status, out var novoStatus)) return Results.BadRequest("Status invalido.");
                var anterior = pedido.StatusPedido;
                pedido.StatusPedido = novoStatus;
                logger.LogInformation("Admin {Admin} updated Pedido #{Id} from {Old} to {New}", user.Identity?.Name, id, anterior, novoStatus);
            }

            if (!string.IsNullOrWhiteSpace(request.PaymentStatus))
            {
                if (!Enum.TryParse<PaymentStatus>(request.PaymentStatus, out var novoPgto)) return Results.BadRequest("Payment Status invalido.");
                pedido.StatusPagamento = novoPgto;
                logger.LogInformation("Admin {Admin} updated Pedido #{Id} Payment to {New}", user.Identity?.Name, id, novoPgto);
            }

            await db.SaveChangesAsync();
            return Results.Ok(new { 
                pedido.Id, 
                StatusPedido = pedido.StatusPedido.ToString(),
                StatusPagamento = pedido.StatusPagamento.ToString()
            });
        });'''

content = content.replace(old_endpoint, new_endpoint)

with open('Backend/Endpoints/AdminEndpoints.cs', 'w', encoding='utf-8') as f:
    f.write(content)
