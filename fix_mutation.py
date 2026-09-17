# -*- coding: utf-8 -*-
with open('skull-shakes-admin/src/hooks/usePedidos.ts', 'r', encoding='utf-8') as f:
    content = f.read()

import re

old_mut = r"""  return useMutation\(\{
    mutationFn: async \(\{
      id,
      status,
    \}: \{
      id: number;
      status: OrderStatus;
    \}\) => \{
      await api\.put\(/admin/pedidos/\$\{id\}/status, \{ status \}\);
    \},"""

new_mut = """  return useMutation({
    mutationFn: async ({
      id,
      status,
      paymentStatus,
    }: {
      id: number;
      status?: OrderStatus;
      paymentStatus?: string;
    }) => {
      await api.put(/admin/pedidos//status, { status, paymentStatus });
    },"""

content = re.sub(old_mut, new_mut, content)

with open('skull-shakes-admin/src/hooks/usePedidos.ts', 'w', encoding='utf-8') as f:
    f.write(content)
