using Microsoft.EntityFrameworkCore;
using SkullShakes.Api.Modelos;
using SkullShakes.Api.Enums;

namespace SkullShakes.Api.BancoDeDados;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Produto> Produtos { get; set; }
    public DbSet<Adicional> Adicionais { get; set; }
    public DbSet<Pedido> Pedidos { get; set; }
    public DbSet<ItemPedido> ItensPedido { get; set; }
    public DbSet<AdminUser> AdminUsers { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<StoreSettings> StoreSettings { get; set; }
    public DbSet<Motoboy> Motoboys { get; set; }
    public DbSet<PedidoHistorico> PedidosHistorico { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<StoreSettings>().HasData(new StoreSettings { Id = 1, IsAberta = true });
        // Store enums as strings for readability in the DB
        modelBuilder.Entity<Pedido>()
            .Property(p => p.StatusPedido)
            .HasConversion<string>();

        modelBuilder.Entity<Pedido>()
            .Property(p => p.StatusPagamento)
            .HasConversion<string>();

        modelBuilder.Entity<Pedido>()
            .Property(p => p.FormaPagamento)
            .HasConversion<string>();

        // Unique constraint on idempotency key
        modelBuilder.Entity<Pedido>()
            .HasIndex(p => p.IdempotencyKey)
            .IsUnique()
            .HasFilter("\"IdempotencyKey\" IS NOT NULL");

        modelBuilder.Entity<Adicional>().HasData(
            new Adicional { Id = 1, Nome = "Banana", PrecoBase = 3.00m, Categoria = "Fruta" },
            new Adicional { Id = 2, Nome = "Ninho", PrecoBase = 3.00m, Categoria = "Po" },
            new Adicional { Id = 3, Nome = "Morango", PrecoBase = 3.00m, Categoria = "Fruta" },
            new Adicional { Id = 4, Nome = "Guaraná", PrecoBase = 3.00m, Categoria = "Fruta" },
            new Adicional { Id = 5, Nome = "Paçoca", PrecoBase = 3.00m, Categoria = "Po" },
            new Adicional { Id = 6, Nome = "Nutella", PrecoBase = 5.00m, Categoria = "Creme" }
        );

        modelBuilder.Entity<Produto>().HasData(
            new Produto { Id = 1, Nome = "SS Tradicional", PrecoBase = 20.00m, Descricao = "Açaí puro expresso, 500ml.", TamanhoMl = 500 },
            new Produto { Id = 2, Nome = "SS com Leite em Pó", PrecoBase = 20.00m, Descricao = "Açaí, leite ninho e leite condensado. 500ml.", TamanhoMl = 500 },
            new Produto { Id = 3, Nome = "Monte o seu SS", PrecoBase = 20.00m, Descricao = "Açaí puro. Escolha seus adicionais.", TamanhoMl = 500, Personalizavel = true }
        );
    }
}
