# -*- coding: utf-8 -*-
with open('Backend/Endpoints/PedidoEndpoints.cs', 'r', encoding='utf-8') as f:
    content = f.read()

import re

old_status = """        app.MapGet("/pedidos/configuracoes/status", async (AppDbContext db) =>
        {
            var config = await db.StoreSettings.FindAsync(1);
            return Results.Ok(new { isAberta = config?.IsAberta ?? true });
        });"""

new_status = """        app.MapGet("/pedidos/configuracoes/status", async (AppDbContext db) =>
        {
            var config = await db.StoreSettings.FindAsync(1);
            if (config == null) return Results.Ok(new { isAberta = true });

            if (!config.UseAutoSchedule)
            {
                return Results.Ok(new { isAberta = config.IsAberta });
            }

            // Auto-Schedule logic
            try {
                var brt = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");
                var now = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, brt);
                
                int dayOfWeek = (int)now.DayOfWeek;
                var scheduleDict = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, Dictionary<string, string>>>(config.ScheduleJson);
                
                if (scheduleDict != null && scheduleDict.TryGetValue(dayOfWeek.ToString(), out var todaySchedule))
                {
                    if (todaySchedule.TryGetValue("open", out var openStr) && todaySchedule.TryGetValue("close", out var closeStr)
                        && TimeSpan.TryParse(openStr, out var openTime) && TimeSpan.TryParse(closeStr, out var closeTime))
                    {
                        var currentTime = now.TimeOfDay;
                        bool isOpenNow = false;
                        if (closeTime > openTime)
                        {
                            isOpenNow = currentTime >= openTime && currentTime <= closeTime;
                        }
                        else
                        {
                            // Handles cases like 18:00 to 02:00
                            isOpenNow = currentTime >= openTime || currentTime <= closeTime;
                        }

                        // If auto-schedule says we are open, but the manual toggle is FALSE, 
                        // the manual toggle wins as an emergency close.
                        if (isOpenNow && !config.IsAberta) return Results.Ok(new { isAberta = false });

                        return Results.Ok(new { isAberta = isOpenNow });
                    }
                }
            } catch {
                // If json parsing fails, fallback to manual toggle
            }

            return Results.Ok(new { isAberta = config.IsAberta });
        });"""

content = content.replace(old_status, new_status)

with open('Backend/Endpoints/PedidoEndpoints.cs', 'w', encoding='utf-8') as f:
    f.write(content)
