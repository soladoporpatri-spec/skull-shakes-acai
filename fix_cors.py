# -*- coding: utf-8 -*-
with open('Backend/Program.cs', 'r', encoding='utf-8') as f:
    content = f.read()

old_cors = '''builder.Services.AddCors(options =>
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
});'''

new_cors = '''builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
        policy.SetIsOriginAllowed(origin => 
            origin.EndsWith(".vercel.app") || 
            origin.EndsWith("skullshakes.com.br") || 
            origin.StartsWith("http://localhost:") ||
            origin.StartsWith("http://192.168."))
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});'''

content = content.replace(old_cors, new_cors)

with open('Backend/Program.cs', 'w', encoding='utf-8') as f:
    f.write(content)
