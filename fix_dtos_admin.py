# -*- coding: utf-8 -*-
with open('Backend/Endpoints/AdminEndpoints.cs', 'r', encoding='utf-8') as f:
    content = f.read()

import re

new_dtos = """
public class StoreSettingsRequest
{
    public bool UseAutoSchedule { get; set; }
    public string ScheduleJson { get; set; } = "{}";
}

public class MotoboyRequest
{
    public string Nome { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
}

public class PedidoMotoboyRequest
{
    public int? MotoboyId { get; set; }
}
"""
content = content.replace("public record PrecoUpdateRequest(decimal NovoPreco);", "public record PrecoUpdateRequest(decimal NovoPreco);" + new_dtos)

# Also fix PaymentMethod.PayOnDelivery which is actually CashOnDelivery?
# Let's check Enums/PaymentMethod.cs
with open('Backend/Enums/PaymentMethod.cs', 'r', encoding='utf-8') as f:
    enum_content = f.read()
print(enum_content)

with open('Backend/Endpoints/AdminEndpoints.cs', 'w', encoding='utf-8') as f:
    f.write(content)
