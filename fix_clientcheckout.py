# -*- coding: utf-8 -*-
with open('web/src/components/checkout/CheckoutSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
content = content.replace(
    'import { useCheckout } from "@/hooks/useCheckout";',
    '''import { useCheckout } from "@/hooks/useCheckout";
import { useStoreStatus } from "@/hooks/useStoreStatus";'''
)

# Use hook in component
content = content.replace(
    'const { state, updateAddress, updatePayment, updateNotes } = useCheckout();',
    '''const { state, updateAddress, updatePayment, updateNotes } = useCheckout();
  const { data: storeStatus } = useStoreStatus();
  const isAberta = storeStatus?.isAberta ?? true;'''
)

# Render banner and disable button
content = content.replace(
    '''        {createPedido.isError && (
          <div className="p-4 mb-6 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
            Erro ao processar pedido. Tente novamente.
          </div>
        )}''',
    '''        {!isAberta && (
          <div className="p-4 mb-6 bg-yellow-500/20 border border-yellow-500/50 rounded text-yellow-200 text-sm font-bold text-center">
            A loja está fechada no momento. Não é possível realizar novos pedidos agora.
          </div>
        )}
        
        {createPedido.isError && (
          <div className="p-4 mb-6 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
            Erro ao processar pedido. Tente novamente.
          </div>
        )}'''
)

content = content.replace(
    '''          <button
            onClick={handleSubmit}
            disabled={createPedido.isPending || !state.address.isValid}
            className="w-full bg-white text-black font-bold uppercase tracking-wider py-5 rounded-none hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createPedido.isPending ? 'Processando...' : 'Finalizar Pedido'}
          </button>''',
    '''          <button
            onClick={handleSubmit}
            disabled={createPedido.isPending || !state.address.isValid || !isAberta}
            className="w-full bg-white text-black font-bold uppercase tracking-wider py-5 rounded-none hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!isAberta ? 'Loja Fechada' : createPedido.isPending ? 'Processando...' : 'Finalizar Pedido'}
          </button>'''
)

with open('web/src/components/checkout/CheckoutSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
