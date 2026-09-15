using Microsoft.EntityFrameworkCore;
using SkullShakes.Api.BancoDeDados;

namespace SkullShakes.Api.Endpoints;

public static class CardapioEndpoints
{
    public static void MapCardapioEndpoints(this WebApplication app)
    {
        app.MapGet("/api/cardapio", async (AppDbContext db) =>
        {
            var produtos = await db.Produtos
                .Include(p => p.Adicionais)
                .Where(p => p.Ativo)
                .ToListAsync();

            return Results.Ok(produtos);
        });
    }
}
