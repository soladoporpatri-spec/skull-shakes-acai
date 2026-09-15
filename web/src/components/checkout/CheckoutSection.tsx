'use client';

import { useState } from 'react';
import { useCheckout } from '@/hooks/useCheckout';
import CheckoutAddress from './CheckoutAddress';
import PaymentMethod from './PaymentMethod';
import OrderSummary from './OrderSummary';
import { useCartStore } from '@/store/cartStore';

export default function CheckoutSection() {
  const { state, updateAddress, updatePayment, updateNotes } = useCheckout();
  const clearCart = useCartStore((s) => s.clearCart);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle'|'submitting'|'success'>('idle');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!state.address.cep) newErrors.cep = 'Obrigatório';
    if (!state.address.street) newErrors.street = 'Obrigatório';
    if (!state.address.number) newErrors.number = 'Obrigatório';
    if (!state.address.neighborhood) newErrors.neighborhood = 'Obrigatório';
    if (!state.address.city) newErrors.city = 'Obrigatório';
    if (!state.address.state) newErrors.state = 'Obrigatório';
    if (!state.payment.method) newErrors.method = 'Escolha uma forma';
    
    if (state.payment.method === 'Dinheiro' && state.payment.needsChange && !state.payment.changeFor) {
      newErrors.changeFor = 'Informe o valor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }
    
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      clearCart();
    }, 1500);
  };

  if (status === 'success') {
    return (
      <section id="checkout" className="w-full min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center py-24 px-4 border-t border-white/5 relative z-10">
        <h2 className="text-5xl md:text-7xl font-display font-bold mb-6 uppercase text-center text-white">Pedido Preparado!</h2>
        <p className="text-zinc-400 mb-12 max-w-lg text-center text-lg leading-relaxed">
          Sua solicitação foi processada. Em um ambiente real, você seria redirecionado para o acompanhamento do entregador.
        </p>
        <button onClick={() => {
          setStatus('idle');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} className="px-10 py-5 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-zinc-200 transition-colors shadow-xl">
          Voltar ao Início
        </button>
      </section>
    );
  }

  return (
    <section id="checkout" className="w-full bg-[#0a0a0a] text-white py-24 px-4 md:px-8 lg:px-16 border-t border-white/5 relative z-10">
      <header className="mb-16 max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-[6rem] leading-none font-display font-bold uppercase mb-6">Finalizar Pedido.</h2>
        <p className="text-zinc-400 font-light text-xl">Confira seus dados antes de enviar.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative max-w-7xl mx-auto">
        
        <div className="flex-1 max-w-3xl">
          <CheckoutAddress address={state.address} updateAddress={updateAddress} errors={errors} />
          
          <section className="mb-16 border-t border-white/10 pt-16">
            <h3 className="text-2xl font-bold uppercase mb-2 text-white">Entrega</h3>
            <p className="text-zinc-400 mb-8 font-light text-sm">Entrega em domicílio.</p>
            <div className="p-6 border border-white/10 bg-white/5 text-zinc-300 text-sm">
              <span className="block mb-2 font-bold uppercase tracking-widest text-xs opacity-60">Sobre a Entrega</span>
              O valor da taxa de entrega é calculado automaticamente com base na distância (km) do nosso estabelecimento até o seu endereço.
            </div>
          </section>

          <div className="border-t border-white/10 pt-16">
             <PaymentMethod payment={state.payment} updatePayment={updatePayment} errors={errors} />
          </div>

          <section className="mb-16 border-t border-white/10 pt-16">
            <h3 className="text-2xl font-bold uppercase mb-2 text-white">Observações</h3>
            <p className="text-zinc-400 mb-6 font-light text-sm">Detalhes adicionais para o pedido.</p>
            <textarea 
              value={state.notes}
              onChange={(e) => updateNotes(e.target.value)}
              placeholder="Ex: Pode deixar na portaria."
              className="w-full bg-transparent border border-white/20 outline-none p-4 text-white placeholder:text-zinc-700 min-h-[120px] focus:border-white transition-colors resize-y"
            />
          </section>

        </div>

        <aside className="w-full lg:w-[400px]">
          <OrderSummary onSubmit={handleSubmit} isSubmitting={status === 'submitting'} status={status} deliveryFee={state.address.deliveryFee} />
        </aside>

      </div>
    </section>
  );
}
