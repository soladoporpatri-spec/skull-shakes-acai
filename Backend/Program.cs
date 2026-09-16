using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SkullShakes.Api.BancoDeDados;
using SkullShakes.Api.Endpoints;
using SkullShakes.Api.Servicos;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// === SECRETS - must come from Environment Variables ===
var jwtSecret = builder.Configuration["JWT_SECRET"]
    ?? throw new InvalidOperationException("JWT_SECRET env var must be set.");

// === SERVICES ===
builder.Services.AddScoped<AuthServico>();
builder.Services.AddScoped<WhatsAppServico>();
builder.Services.AddScoped<IDeliveryCalculator, CepPrefixDeliveryCalculator>();
builder.Services.AddHttpClient<MercadoPagoServico>();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// === JWT AUTHENTICATION ===
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "SkullShakes",
            ValidAudience = "SkullShakesAdmin",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ClockSkew = TimeSpan.FromSeconds(30)
        };
    });

builder.Services.AddAuthorizationBuilder()
    .AddPolicy("AdminPolicy", policy =>
        policy.RequireAuthenticatedUser().RequireRole("Admin"));

// === RATE LIMITING ===
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("login", opt =>
    {
        opt.Window = TimeSpan.FromMinutes(1);
        opt.PermitLimit = 5;
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 0;
    });
    options.RejectionStatusCode = 429;
});

// === CORS ===
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
        policy.WithOrigins(
            "http://localhost:3000", 
            "http://localhost:3001", 
            "https://skullshakes.com.br",
            "https://skull-shakes-acai.vercel.app",
            "https://skull-shakes-admin.vercel.app"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// === SECURITY HEADERS MIDDLEWARE ===
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "SAMEORIGIN");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    context.Response.Headers.Append("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    await next();
});

// === GLOBAL EXCEPTION HANDLER - never expose internals ===
app.UseExceptionHandler(errApp =>
{
    errApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { Mensagem = "Ocorreu um erro interno. Tente novamente." });
    });
});

// Order matters!
app.UseRateLimiter();
app.UseCors("FrontendPolicy");
app.UseAuthentication();
app.UseAuthorization();

SkullShakes.Api.BancoDeDados.SeedData.Initialize(app.Services);

app.MapGet("/", () => "Skull Shakes API funcionando!");

app.MapCardapioEndpoints();
app.MapPedidoEndpoints();
app.MapWebhookEndpoints();
app.MapAdminEndpoints();

app.Run();
