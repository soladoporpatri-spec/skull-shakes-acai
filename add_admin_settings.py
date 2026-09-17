# -*- coding: utf-8 -*-
with open('Backend/Endpoints/AdminEndpoints.cs', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Add settings DTO
dto_str = """public class StoreSettingsRequest
{
    public bool UseAutoSchedule { get; set; }
    public string ScheduleJson { get; set; } = "{}";
}"""
content = content.replace("public class StoreStatusRequest", dto_str + "\n\npublic class StoreStatusRequest")

# Add the GET and PUT for settings
new_endpoints = """        admin.MapGet("/configuracoes", async (AppDbContext db) =>
        {
            var config = await db.StoreSettings.FindAsync(1);
            if (config == null)
            {
                config = new StoreSettings { Id = 1, IsAberta = true, UseAutoSchedule = false, ScheduleJson = "{}" };
                db.StoreSettings.Add(config);
                await db.SaveChangesAsync();
            }
            return Results.Ok(new { config.IsAberta, config.UseAutoSchedule, config.ScheduleJson });
        });

        admin.MapPut("/configuracoes", async (StoreSettingsRequest req, AppDbContext db, ClaimsPrincipal user, ILogger<Program> logger) =>
        {
            var config = await db.StoreSettings.FindAsync(1);
            if (config == null) return Results.NotFound();

            config.UseAutoSchedule = req.UseAutoSchedule;
            config.ScheduleJson = req.ScheduleJson;
            await db.SaveChangesAsync();

            logger.LogInformation("Admin {Admin} updated store schedule settings", user.Identity?.Name);
            return Results.Ok(config);
        });"""

old_status_put = r"""        admin\.MapPut\("/configuracoes/status"[\s\S]*?return Results\.Ok\(new \{ isAberta = config\.IsAberta \}\);\n        \}\);"""

# I will append the new endpoints right before the /produtos/upload
content = content.replace('admin.MapPost("/produtos/upload"', new_endpoints + '\n\n        admin.MapPost("/produtos/upload"')

with open('Backend/Endpoints/AdminEndpoints.cs', 'w', encoding='utf-8') as f:
    f.write(content)
