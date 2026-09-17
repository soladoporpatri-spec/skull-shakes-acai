using Microsoft.AspNetCore.Identity;
using SkullShakes.Api.BancoDeDados;
using SkullShakes.Api.Modelos;
using System.Linq;
using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;

namespace SkullShakes.Api.BancoDeDados;

public static class SeedData
{
    public static void Initialize(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        
        // Garante que as tabelas sejam criadas rodando as Migrations (compativel com Supabase)
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
    }
}