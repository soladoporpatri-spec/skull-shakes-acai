using Microsoft.EntityFrameworkCore;
using SkullShakes.Api.BancoDeDados;
using SkullShakes.Api.Endpoints;
using SkullShakes.Api.Servicos;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Banco de Dados PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Serviços
builder.Services.AddScoped<MercadoPagoServico>();
builder.Services.AddScoped<WhatsAppServico>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Registro das Rotas (Minimal APIs)
app.MapCardapioEndpoints();
app.MapPedidoEndpoints();
app.MapWebhookEndpoints();

app.MapGet("/health", () => Results.Ok(new { status = "Healthy", message = "Skull Shakes API OK" }));

app.Run();
