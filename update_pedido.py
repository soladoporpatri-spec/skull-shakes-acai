# -*- coding: utf-8 -*-
with open('Backend/Modelos/Pedido.cs', 'r', encoding='utf-8') as f:
    content = f.read()

import re

new_field = """    public string? IdempotencyKey { get; set; } // To prevent duplicate charges

    public int? MotoboyId { get; set; }
    public Motoboy? Motoboy { get; set; }"""

content = content.replace("    public string? IdempotencyKey { get; set; } // To prevent duplicate charges", new_field)

with open('Backend/Modelos/Pedido.cs', 'w', encoding='utf-8') as f:
    f.write(content)
