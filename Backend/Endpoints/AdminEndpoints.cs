using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using SkullShakes.Api.BancoDeDados;
using SkullShakes.Api.DTOs;
using SkullShakes.Api.Enums;
using SkullShakes.Api.Modelos;
using SkullShakes.Api.Servicos;

namespace SkullShakes.Api.Endpoints;

// Supporting request types
public record RefreshRequest(string RefreshToken);
public record StatusUpdateRequest(string? Status, string? PaymentStatus);
public record StoreStatusRequest(bool IsAberta);
public record PrecoUpdateRequest(decimal NovoPreco);

public static class AdminEndpoints
{
    public static void MapAdminEndpoints(this WebApplication app)
    {
        // --- PUBLIC AUTH ENDPOINTS ---
        var auth = app.MapGroup("/admin/auth");

        auth.MapPost("/login", async (
            LoginRequest request,
            AuthServico authServico,
            HttpContext context,
            ILogger<Program> logger) =>
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
                return Results.Unauthorized();

            var deviceInfo = context.Request.Headers["User-Agent"].ToString();
            var result = await authServico.LoginAsync(request.Username, request.Password, deviceInfo);

            if (result is null)
            {
                // Generic message - never reveal if user exists
                logger.LogWarning("Failed login from IP:{IP}", context.Connection.RemoteIpAddress);
                return Results.Unauthorized();
            }

            logger.LogInformation("Admin login: {Username}", request.Username);
            return Results.Ok(result);
        }).RequireRateLimiting("login");

        auth.MapPost("/refresh", async (RefreshRequest request, AuthServico authServico, HttpContext context) =>
        {
            if (string.IsNullOrEmpty(request.RefreshToken)) return Results.BadRequest();
            var deviceInfo = context.Request.Headers["User-Agent"].ToString();
            var result = await authServico.RefreshAsync(request.RefreshToken, deviceInfo);
            return result is null ? Results.Unauthorized() : Results.Ok(result);
        });

        auth.MapPost("/logout", async (RefreshRequest request, AuthServico authServico) =>
        {
            if (!string.IsNullOrEmpty(request.RefreshToken))
                await authServico.LogoutAsync(request.RefreshToken);
            return Results.Ok();
        });

        // --- PROTECTED ADMIN ENDPOINTS ---
        var admin = app.MapGroup("/admin").RequireAuthorization("AdminPolicy");

        admin.MapGet("/pedidos", async (AppDbContext db) =>
        {
            var pedidos = await db.Pedidos
                .Include(p => p.Itens).ThenInclude(i => i.Produto)
                .Include(p => p.Itens).ThenInclude(i => i.Adicionais)
                .OrderByDescending(p => p.DataPedido)
                .Select(p => new
                {
                    p.Id, p.NomeCliente, p.Telefone, p.Endereco, p.DataPedido,
                    StatusPedido = p.StatusPedido.ToString(),
                    StatusPagamento = p.StatusPagamento.ToString(),
                    FormaPagamento = p.FormaPagamento.ToString(),
                    p.Subtotal, p.DeliveryFee, p.Total, p.PagamentoExternoId,
                    Itens = p.Itens.Select(i => new { 
                        i.Quantidade, 
                        i.PrecoUnitario, 
                        Produto = i.Produto != null ? i.Produto.Nome : "N/A",
                        Adicionais = i.Adicionais.Select(a => a.Nome).ToList()
                    })
                }).ToListAsync();
            return Results.Ok(pedidos);
        });

        admin.MapPut("/pedidos/{id}/status", async (
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
        });

        admin.MapPut("/configuracoes/status", async (StoreStatusRequest req, AppDbContext db) =>
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
        
        
        admin.MapPost("/produtos/upload", async (HttpRequest req, IConfiguration config, ILogger<Program> logger) =>
        {
            if (!req.HasFormContentType) return Results.BadRequest("Invalid content type");
            
            var form = await req.ReadFormAsync();
            var file = form.Files.FirstOrDefault();
            if (file == null || file.Length == 0) return Results.BadRequest("No file uploaded");

            if (!file.ContentType.StartsWith("image/")) return Results.BadRequest("Only images allowed");

            var supabaseUrl = config["SUPABASE_URL"];
            var supabaseKey = config["SUPABASE_SERVICE_ROLE_KEY"] ?? config["SUPABASE_KEY"];

            if (string.IsNullOrEmpty(supabaseUrl) || string.IsNullOrEmpty(supabaseKey))
            {
                logger.LogError("Supabase URL or Key not configured");
                return Results.StatusCode(500);
            }

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var requestUrl = $"{supabaseUrl}/storage/v1/object/produtos/{fileName}";
            
            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {supabaseKey}");
            httpClient.DefaultRequestHeaders.Add("apikey", supabaseKey);

            using var stream = file.OpenReadStream();
            using var streamContent = new StreamContent(stream);
            streamContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(file.ContentType);

            var response = await httpClient.PostAsync(requestUrl, streamContent);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                logger.LogError("Supabase Upload Error: {StatusCode} - {Body}", response.StatusCode, responseBody);
                return Results.StatusCode(502);
            }

            var publicUrl = $"{supabaseUrl}/storage/v1/object/public/produtos/{fileName}";
            return Results.Ok(new { url = publicUrl });
        }).DisableAntiforgery();

        admin.MapPost("/produtos", async (Produto produto, AppDbContext db) =>
        {
            db.Produtos.Add(produto);
            await db.SaveChangesAsync();
            return Results.Created($"/admin/produtos/{produto.Id}", produto);
        });

        admin.MapPut("/produtos/{id}/preco", async (
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
    }
}
