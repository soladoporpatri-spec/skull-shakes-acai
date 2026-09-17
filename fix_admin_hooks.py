# -*- coding: utf-8 -*-
import re

with open('skull-shakes-admin/src/hooks/usePedidos.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
'''    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: OrderStatus;
    }) => {
      await api.put(/admin/pedidos//status, { status });
    },''',
'''    mutationFn: async ({
      id,
      status,
      paymentStatus,
    }: {
      id: number;
      status?: OrderStatus;
      paymentStatus?: string;
    }) => {
      await api.put(/admin/pedidos//status, { status, paymentStatus });
    },'''
)

with open('skull-shakes-admin/src/hooks/usePedidos.ts', 'w', encoding='utf-8') as f:
    f.write(content)
