# -*- coding: utf-8 -*-
with open('Backend/Endpoints/AdminEndpoints.cs', 'r', encoding='utf-8') as f:
    content = f.read()

import re

new_dtos = """
public class MotoboyRequest
{
    public string Nome { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
}

public class PedidoMotoboyRequest
{
    public int? MotoboyId { get; set; }
}
"""
content = content.replace("public class PrecoUpdateRequest", new_dtos + "\n\npublic class PrecoUpdateRequest")

new_endpoints = """        // --- MOTOBOYS ---
        admin.MapGet("/motoboys", async (AppDbContext db) =>
        {
            var motoboys = await db.Motoboys.OrderBy(m => m.Nome).ToListAsync();
            return Results.Ok(motoboys);
        });

        admin.MapPost("/motoboys", async (MotoboyRequest req, AppDbContext db, ClaimsPrincipal user) =>
        {
            var m = new Motoboy { Nome = req.Nome, Telefone = req.Telefone, Ativo = true };
            db.Motoboys.Add(m);
            await db.SaveChangesAsync();
            return Results.Ok(m);
        });

        admin.MapPut("/pedidos/{id}/motoboy", async (int id, PedidoMotoboyRequest req, AppDbContext db, ClaimsPrincipal user) =>
        {
            var pedido = await db.Pedidos.FindAsync(id);
            if (pedido == null) return Results.NotFound();
            pedido.MotoboyId = req.MotoboyId;
            await db.SaveChangesAsync();
            return Results.Ok(pedido);
        });

        // --- FECHAMENTO ---
        admin.MapGet("/relatorios/fechamento", async (string date, AppDbContext db) =>
        {
            if (!DateTime.TryParse(date, out var parsedDate)) return Results.BadRequest("Data invalida");
            
            var start = parsedDate.Date;
            var end = start.AddDays(1);

            var pedidos = await db.Pedidos
                .Include(p => p.Motoboy)
                .Where(p => p.DataPedido >= start && p.DataPedido < end && p.StatusPedido != OrderStatus.Canceled)
                .ToListAsync();

            var motoboysStats = pedidos
                .Where(p => p.MotoboyId != null)
                .GroupBy(p => p.MotoboyId)
                .Select(g => new
                {
                    MotoboyId = g.Key,
                    MotoboyNome = g.First().Motoboy?.Nome ?? "Desconhecido",
                    TotalEntregas = g.Count(),
                    TotalTaxas = g.Sum(p => p.DeliveryFee),
                    TotalDinheiroRecebido = g.Where(p => p.FormaPagamento == PaymentMethod.PayOnDelivery || p.FormaPagamento == PaymentMethod.Cash).Sum(p => p.Total)
                }).ToList();

            var lojaStats = new {
                TotalPedidos = pedidos.Count,
                ReceitaBruta = pedidos.Sum(p => p.Total),
                Pix = pedidos.Where(p => p.FormaPagamento == PaymentMethod.Pix).Sum(p => p.Total),
                Cartao = pedidos.Where(p => p.FormaPagamento == PaymentMethod.CreditCard || p.FormaPagamento == PaymentMethod.DebitCard).Sum(p => p.Total),
                Dinheiro = pedidos.Where(p => p.FormaPagamento == PaymentMethod.PayOnDelivery || p.FormaPagamento == PaymentMethod.Cash).Sum(p => p.Total)
            };

            return Results.Ok(new { Loja = lojaStats, Motoboys = motoboysStats });
        });"""

content = content.replace('// --- GESTAO DE ESTOQUE (ADICIONAIS) ---', new_endpoints + '\n\n        // --- GESTAO DE ESTOQUE (ADICIONAIS) ---')

with open('Backend/Endpoints/AdminEndpoints.cs', 'w', encoding='utf-8') as f:
    f.write(content)
