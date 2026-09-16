import { useCartStore } from '@/store/cartStore';
import { Loader2 } from 'lucide-react';

type Props = {
  onSubmit: () => void;
  isSubmitting: boolean;
  status: 'idle' | 'submitting' | 'success' | 'pix_pending';
  deliveryFee: number | null;
};

export default function OrderSummary({ onSubmit, isSubmitting, status, deliveryFee }: Props) {
  const { items } = useCartStore();
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const total = subtotal + (deliveryFee || 0);

  return (
    <div className="bg-[#111] border border-white/10 p-6 md:p-8 sticky top-8">
      <h3 className="text-xl font-bold uppercase mb-8 text-white border-b border-white/10 pb-4">Resumo do Pedido</h3>
      
      <div className="flex flex-col gap-4 mb-8 min-h-[100px]">
        {items.length === 0 ? (
          <p className="text-zinc-500 text-sm">Seu carrinho está vazio.</p>
        ) : (
          items.map(item => {
            const cid = item.cartItemId || item.id;
            return (
              <div key={cid} className="flex flex-col gap-2 mb-4 pb-4 border-b border-white/5 last:border-0">
                <div className="flex justify-between items-start text-sm">
                  <div className="flex flex-col">
                    <span className="text-zinc-300 font-bold">{item.name}</span>
                    {item.options && item.options.length > 0 && (
                      <span className="text-xs text-zinc-500 mt-1">
                        + {item.options.map(opt => opt.name).join(', ')}
                      </span>
                    )}
                  </div>
                  <span className="text-white whitespace-nowrap ml-4 font-bold">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-3 bg-white/5 px-2 py-1 rounded-sm border border-white/10">
                    <button onClick={() => { if(item.quantity > 1) useCartStore.getState().updateQuantity(cid, item.quantity - 1) }} className="text-zinc-400 hover:text-white px-2 py-1" aria-label="Diminuir quantidade">-</button>
                    <span className="text-sm w-4 text-center">{item.quantity}</span>
                    <button onClick={() => useCartStore.getState().updateQuantity(cid, item.quantity + 1)} className="text-zinc-400 hover:text-white px-2 py-1" aria-label="Aumentar quantidade">+</button>
                  </div>
                  <button onClick={() => useCartStore.getState().removeItem(cid)} className="text-xs uppercase tracking-widest text-red-400 hover:text-red-300 font-bold px-2 py-2" aria-label={`Remover ${item.name}`}>Remover</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-white/10 pt-6 flex flex-col gap-3 mb-8 text-sm">
        <div className="flex justify-between text-zinc-400">
          <span>Subtotal</span>
          <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="flex justify-between text-zinc-400">
          <span>Entrega</span>
          <span className="text-xs uppercase tracking-widest opacity-80">
            {deliveryFee !== null ? `R$ ${deliveryFee.toFixed(2).replace('.', ',')}` : 'A calcular (Digite o CEP)'}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-end mb-12">
        <span className="text-sm font-bold uppercase tracking-widest text-zinc-400">Total</span>
        <span className="text-4xl font-display text-white">R$ {total.toFixed(2).replace('.', ',')}</span>
      </div>

      <button 
        onClick={onSubmit}
        disabled={items.length === 0 || isSubmitting || status === 'success'}
        className="w-full bg-white hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold uppercase tracking-widest py-5 flex items-center justify-center transition-colors"
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : status === 'success' ? 'Pedido Preparado' : 'Confirmar Pedido'}
      </button>
    </div>
  );
}
