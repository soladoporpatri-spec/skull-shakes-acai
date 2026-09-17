# -*- coding: utf-8 -*-
with open('Backend/Endpoints/AdminEndpoints.cs', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for i, line in enumerate(lines[:30]):
        print(f"{i}: {line.strip()}")
