# -*- coding: utf-8 -*-
with open('Backend/BancoDeDados/AppDbContext.cs', 'r', encoding='utf-8') as f:
    content = f.read()

import re

new_dbset = """    public DbSet<AdminUser> AdminUsers { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<StoreSettings> StoreSettings { get; set; }
    public DbSet<Motoboy> Motoboys { get; set; }"""

content = content.replace("    public DbSet<AdminUser> AdminUsers { get; set; }\n    public DbSet<RefreshToken> RefreshTokens { get; set; }\n    public DbSet<StoreSettings> StoreSettings { get; set; }", new_dbset)

with open('Backend/BancoDeDados/AppDbContext.cs', 'w', encoding='utf-8') as f:
    f.write(content)
