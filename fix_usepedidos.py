# -*- coding: utf-8 -*-
with open('skull-shakes-admin/src/hooks/usePedidos.ts', 'r', encoding='utf-8') as f:
    content = f.read()

import re

old_query = r"""  return useQuery\(\{
    queryKey: \["pedidos"\]\,
    queryFn: async \(\) => \{
      const response = await api\.get<Pedido\[\]>\("/admin/pedidos"\);
      return response\.data;
    \},
  \}\);"""

new_query = """  return useQuery({
    queryKey: ["pedidos"],
    queryFn: async () => {
      const response = await api.get<Pedido[]>("/admin/pedidos");
      return response.data;
    },
    refetchInterval: 10000, // Auto-refresh every 10 seconds
  });"""

content = re.sub(old_query, new_query, content)

with open('skull-shakes-admin/src/hooks/usePedidos.ts', 'w', encoding='utf-8') as f:
    f.write(content)
