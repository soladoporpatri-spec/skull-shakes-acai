using Microsoft.AspNetCore.Identity;
using SkullShakes.Api.BancoDeDados;
using SkullShakes.Api.Modelos;
using System.Linq;
using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace SkullShakes.Api.BancoDeDados;

public static class SeedData
{
    public static void Initialize(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        
        context.Database.Migrate();
        
        if (!context.AdminUsers.Any())
        {
            var hasher = new PasswordHasher<AdminUser>();
            var user = new AdminUser 
            { 
                Username = "SkullShakes",
                Email = "admin@skullshakes.com",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            user.PasswordHash = hasher.HashPassword(user, "Shakes@Acai31201204");
            context.AdminUsers.Add(user);
            context.SaveChanges();
            Console.WriteLine("SUPER ADMIN CREADO COM SUCESSO!");
        }

        if (!context.Produtos.Any())
        {
            var produtos = new List<Produto>
            {
                new Produto { Nome = "SS Tradicional", Descricao = "Açaí puro expresso.", PrecoBase = 20m, Categoria = "Açaís", ImagemUrl = "/products/bottle-acai.png", IsAtivo = true }, // 1
                new Produto { Nome = "SS com Leite em Pó", Descricao = "Açaí, leite em pó e leite condensado.", PrecoBase = 20m, Categoria = "Açaís", ImagemUrl = "/products/bottle-acai.png", IsAtivo = true }, // 2
                new Produto { Nome = "Monte o seu SS", Descricao = "Açaí puro. Escolha seus adicionais.", PrecoBase = 20m, Categoria = "Açaís", ImagemUrl = "/products/bottle-acai.png", IsAtivo = true }, // 3
                new Produto { Nome = "SS Tradicional com Nutella", Descricao = "Açaí, leite Ninho, leite condensado e Nutella.", PrecoBase = 25m, Categoria = "Linha Nutella", ImagemUrl = "/products/bottle-acai.png", IsAtivo = true }, // 4
                new Produto { Nome = "SS Paçoca com Nutella", Descricao = "Açaí, creme de paçoca especial e Nutella.", PrecoBase = 28m, Categoria = "Linha Nutella", ImagemUrl = "/products/bottle-acai.png", IsAtivo = true }, // 5
                new Produto { Nome = "SS Limão com Nutella", Descricao = "Batidinha gourmet de limão especial e Nutella.", PrecoBase = 28m, Categoria = "Linha Nutella", ImagemUrl = "/products/bottle-maracuja.png", IsAtivo = true }, // 6
                new Produto { Nome = "SS Morango com Nutella", Descricao = "Batidinha gourmet de morango especial e muita Nutella.", PrecoBase = 28m, Categoria = "Linha Nutella", ImagemUrl = "/products/bottle-morango.png", IsAtivo = true }, // 7
                new Produto { Nome = "SS Maracujá com Nutella", Descricao = "Batidinha gourmet de maracujá especial e muita Nutella.", PrecoBase = 28m, Categoria = "Linha Nutella", ImagemUrl = "/products/bottle-maracuja.png", IsAtivo = true } // 8
            };
            context.Produtos.AddRange(produtos);
            context.SaveChanges();
            Console.WriteLine("PRODUTOS DEMO CRIADOS COM SUCESSO!");
        }

        if (!context.Adicionais.Any())
        {
            var adicionais = new List<Adicional>
            {
                new Adicional { Nome = "Banana", PrecoBase = 3m, Disponivel = true }, // 1
                new Adicional { Nome = "Morango", PrecoBase = 3m, Disponivel = true }, // 2
                new Adicional { Nome = "Paçoca", PrecoBase = 3m, Disponivel = true }, // 3
                new Adicional { Nome = "Ninho", PrecoBase = 3m, Disponivel = true }, // 4
                new Adicional { Nome = "Guaraná", PrecoBase = 3m, Disponivel = true }, // 5
                new Adicional { Nome = "Nutella", PrecoBase = 5m, Disponivel = true } // 6
            };
            context.Adicionais.AddRange(adicionais);
            context.SaveChanges();
            Console.WriteLine("ADICIONAIS DEMO CRIADOS COM SUCESSO!");
        }
    }
}
