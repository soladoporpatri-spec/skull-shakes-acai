using Microsoft.EntityFrameworkCore;
using SkullShakes.Api.Modelos;

namespace SkullShakes.Api.BancoDeDados;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Produto> Produtos => Set<Produto>();
    public DbSet<Adicional> Adicionais => Set<Adicional>();
    public DbSet<Pedido> Pedidos => Set<Pedido>();
    public DbSet<ItemPedido> ItensPedido => Set<ItemPedido>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Mapeamento simples
        modelBuilder.Entity<Produto>()
            .HasMany(p => p.Adicionais)
            .WithOne()
            .HasForeignKey(a => a.ProdutoId);

        modelBuilder.Entity<Pedido>()
            .HasMany(p => p.Itens)
            .WithOne()
            .HasForeignKey(i => i.PedidoId);
    }
}
