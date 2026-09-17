# -*- coding: utf-8 -*-
with open('skull-shakes-admin/src/components/layout/Header.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'import { useStoreStatus, useUpdateStoreStatus } from "@/hooks/useStoreStatus";',
    '''import { useStoreStatus, useUpdateStoreStatus } from "@/hooks/useStoreStatus";
import { OrderNotifier } from "@/components/pedidos/OrderNotifier";'''
)

content = content.replace(
    '''      <div className="ml-auto flex items-center gap-4">
        {!isLoading && status && (''',
    '''      <div className="ml-auto flex items-center gap-4">
        <OrderNotifier />
        {!isLoading && status && ('''
)

with open('skull-shakes-admin/src/components/layout/Header.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
