# -*- coding: utf-8 -*-
with open('skull-shakes-admin/src/components/layout/Sidebar.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# We add Settings (Configuraes) icon and navigation link
content = content.replace('import { LayoutDashboard, ShoppingBag, Package, LogOut } from "lucide-react";', 'import { LayoutDashboard, ShoppingBag, Package, LogOut, Settings, Bike } from "lucide-react";')

new_links = """  { name: "Pedidos", href: "/pedidos", icon: ShoppingBag },
  { name: "Fechamento", href: "/fechamento", icon: Bike },
  { name: "Produtos & Estoque", href: "/produtos", icon: Package },
  { name: "Configuraes", href: "/configuracoes", icon: Settings },"""

old_links = """  { name: "Pedidos", href: "/pedidos", icon: ShoppingBag },
  { name: "Produtos", href: "/produtos", icon: Package },"""

content = content.replace(old_links, new_links)

with open('skull-shakes-admin/src/components/layout/Sidebar.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
