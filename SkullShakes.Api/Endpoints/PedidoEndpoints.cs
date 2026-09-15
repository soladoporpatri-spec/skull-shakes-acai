using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkullShakes.Api.BancoDeDados;
using SkullShakes.Api.DTOs;
using SkullShakes.Api.Modelos;
using SkullShakes.Api.Servicos;
using System.Text.Json;

namespace SkullShakes.Api.Endpoints;

public static class PedidoEndpoints
{
    public static void MapPedidoEndpoints(this WebApplication app)
    {
        app.MapPost("/api/pedidos", async ([FromBody] PedidoRequest req, AppDbContext db, MercadoPagoServico mp) =>
        {
            decimal subTotal = 0;
            var itensPedido = new List<ItemPedido>();

            foreach (var reqItem in req.Itens)
            {
                var produtoDb = await db.Produtos.Include(p => p.Adicionais).FirstOrDefaultAsync(p => p.Id == reqItem.ProdutoId);
                if (produtoDb == null) return Results.BadRequest($"Produto {reqItem.ProdutoId} não encontrado");

                decimal precoItem = produtoDb.PrecoBase;
                var nomesAdicionais = new List<string>();

                if (produtoDb.AceitaAdicionais && reqItem.AdicionaisNomes.Any())
                {
                    foreach (var adicNome in reqItem.AdicionaisNomes)
                    {
                        var adicionalDb = produtoDb.Adicionais.FirstOrDefault(a => a.Nome == adicNome);
                        if (adicionalDb != null)
                        {
                            precoItem += adicionalDb.Preco;
                            nomesAdicionais.Add(adicionalDb.Nome);
                        }
                    }
                }

                subTotal += precoItem * reqItem.Quantidade;
                
                itensPedido.Add(new ItemPedido
                {
                    ProdutoId = produtoDb.Id,
                    NomeProduto = produtoDb.Nome,
                    Quantidade = reqItem.Quantidade,
                    PrecoUnitario = precoItem,
                    AdicionaisSelecionados = JsonSerializer.Serialize(nomesAdicionais)
                });
            }

            var pedido = new Pedido
            {
                NomeCliente = req.NomeCliente,
                TelefoneCliente = req.TelefoneCliente,
                Observacoes = req.Observacoes,
                Rua = req.Rua,
                Numero = req.Numero,
                Complemento = req.Complemento,
                Bairro = req.Bairro,
                Cidade = req.Cidade,
                Estado = req.Estado,
                Cep = req.Cep,
                Latitude = req.Latitude,
                Longitude = req.Longitude,
                MetodoPagamento = req.MetodoPagamento,
                TrocoPara = req.TrocoPara,
                TaxaEntrega = req.TaxaEntregaCalculada,
                SubTotal = subTotal,
                Total = subTotal + req.TaxaEntregaCalculada,
                Itens = itensPedido,
                Status = "Aguardando",
                Pago = false
            };

            db.Pedidos.Add(pedido);
            await db.SaveChangesAsync();

            if (req.MetodoPagamento.Equals("Pix", StringComparison.OrdinalIgnoreCase))
            {
                var pix = await mp.GerarPixAsync(pedido.Total, pedido.Id);
                pedido.IdTransacaoExterna = pix.TransacaoId;
                await db.SaveChangesAsync();
                
                return Results.Ok(new { pedidoId = pedido.Id, qrCodeBase64 = pix.QrCodeBase64, copiaECola = pix.CopiaECola });
            }

            // Se for dinheiro ou cartão na entrega, o status pode ser diferente
            return Results.Ok(new { pedidoId = pedido.Id });
        });
    }
}
