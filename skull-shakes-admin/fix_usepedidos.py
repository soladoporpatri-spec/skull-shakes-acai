# -*- coding: utf-8 -*-
with open('src/hooks/usePedidos.ts', 'r', encoding='utf-8') as f:
    content = f.read()

import re
content = re.sub(r'import \{ Pedido, OrderStatus \} from "@/types";', 'import { Pedido, OrderStatus, PaymentStatus } from "@/types";', content)

with open('src/hooks/usePedidos.ts', 'w', encoding='utf-8') as f:
    f.write(content)
