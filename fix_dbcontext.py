# -*- coding: utf-8 -*-
with open('Backend/BancoDeDados/AppDbContext.cs', 'r', encoding='utf-8') as f:
    content = f.read()

# Add DbSet
content = content.replace(
    'public DbSet<RefreshToken> RefreshTokens { get; set; }',
    'public DbSet<RefreshToken> RefreshTokens { get; set; }\n    public DbSet<StoreSettings> StoreSettings { get; set; }'
)

# Seed StoreSettings
content = content.replace(
    'protected override void OnModelCreating(ModelBuilder modelBuilder)\n    {',
    '''protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<StoreSettings>().HasData(new StoreSettings { Id = 1, IsAberta = true });'''
)

with open('Backend/BancoDeDados/AppDbContext.cs', 'w', encoding='utf-8') as f:
    f.write(content)
