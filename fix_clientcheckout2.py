# -*- coding: utf-8 -*-
with open('web/src/components/checkout/CheckoutSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add useEffect hook
content = content.replace(
    "import { useState, useRef, useCallback } from 'react';",
    "import { useState, useRef, useCallback, useEffect } from 'react';"
)

# Add state for store status
content = content.replace(
    "const { state, updateAddress, updatePayment, updateNotes } = useCheckout();",
    '''const { state, updateAddress, updatePayment, updateNotes } = useCheckout();
  const [isAberta, setIsAberta] = useState<boolean>(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5210'}/pedidos/configuracoes/status);
        const data = await res.json();
        setIsAberta(data.isAberta);
      } catch (e) {
        console.error('Failed to fetch store status', e);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);'''
)

# Render banner in CheckoutSection
content = content.replace(
    '''      <header className="mb-16 max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-[6rem] leading-none font-display font-bold uppercase mb-6">
          Finalizar Pedido.
        </h2>
        <p className="text-zinc-400 font-light text-xl">Confira seus dados antes de enviar.</p>
      </header>''',
    '''      <header className="mb-16 max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-[6rem] leading-none font-display font-bold uppercase mb-6">
          Finalizar Pedido.
        </h2>
        <p className="text-zinc-400 font-light text-xl mb-6">Confira seus dados antes de enviar.</p>
        
        {!isAberta && (
          <div className="p-6 bg-red-900/30 border border-red-500/50 rounded-none text-red-200 text-base font-bold text-center">
            A loja está fechada no momento. Não é possível realizar novos pedidos agora.
          </div>
        )}
      </header>'''
)

# Update OrderSummary prop and disable logic
content = content.replace(
    '''        <aside className="w-full lg:w-[400px]">
          <OrderSummary
            onSubmit={handleSubmit}
            isSubmitting={status === 'submitting'}
            status={status}
            deliveryFee={state.address.deliveryFee}
          />
        </aside>''',
    '''        <aside className="w-full lg:w-[400px]">
          <OrderSummary
            onSubmit={handleSubmit}
            isSubmitting={status === 'submitting'}
            status={status}
            deliveryFee={state.address.deliveryFee}
            isAberta={isAberta}
          />
        </aside>'''
)

with open('web/src/components/checkout/CheckoutSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
