# -*- coding: utf-8 -*-
with open('skull-shakes-admin/src/app/(admin)/layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# We need to import usePedidos and useOrderNotification
imports = """import { usePedidos } from "@/hooks/usePedidos";
import { useOrderNotification } from "@/hooks/useOrderNotification";"""

content = content.replace('import { useAuthStore } from "@/store/authStore";', 
                          'import { useAuthStore } from "@/store/authStore";\n' + imports)

# We need to call useOrderNotification
call_hook = """  const { data: pedidos } = usePedidos();
  useOrderNotification(pedidos);

  if (!hydrated) {"""

content = content.replace("  if (!hydrated) {", call_hook)

with open('skull-shakes-admin/src/app/(admin)/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
