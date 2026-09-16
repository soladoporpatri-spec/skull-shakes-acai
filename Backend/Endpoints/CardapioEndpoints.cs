using Microsoft.EntityFrameworkCore;
using SkullShakes.Api.BancoDeDados;
namespace SkullShakes.Api.Endpoints;

public static class CardapioEndpoints
{
    public static void MapCardapioEndpoints(this WebApplication app)
    {
        var cardapio = app.MapGroup("/cardapio");
        cardapio.MapGet("/produtos", async (AppDbContext db) =>
        {
            var produtos = await db.Produtos
                .AsNoTracking()
                .Where(p => p.Disponivel)
                .ToListAsync();

            return Results.Ok(produtos);
        });

        cardapio.MapGet("/adicionais", async (AppDbContext db) =>
        {
            var adicionais = await db.Adicionais
                .AsNoTracking()
                .Where(a => a.Disponivel)
                .ToListAsync();

            return Results.Ok(adicionais);
        });
    }
}
