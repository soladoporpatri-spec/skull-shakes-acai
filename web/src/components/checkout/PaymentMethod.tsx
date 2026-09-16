import { CheckoutState } from '@/hooks/useCheckout';

type Props = {
  payment: CheckoutState['payment'];
  updatePayment: (fields: Partial<CheckoutState['payment']>) => void;
  errors: Record<string, string>;
};

/** Maps Portuguese display labels to backend enum names */
const METHODS: { label: string; value: string }[] = [
  { label: 'PIX',               value: 'Pix'           },
  { label: 'Cartão de Crédito', value: 'CreditCard'    },
  { label: 'Cartão de Débito',  value: 'DebitCard'     },
  { label: 'Dinheiro',          value: 'PayOnDelivery' },
];

export default function PaymentMethod({ payment, updatePayment, errors }: Props) {
  return (
    <section className="mb-16">
      <h3 className="text-2xl font-bold uppercase mb-2 text-white flex justify-between items-center">
        Forma de Pagamento
        {errors.method && <span className="text-red-400 text-xs tracking-widest font-normal">{errors.method}</span>}
      </h3>
      <p className="text-zinc-400 mb-8 font-light text-sm">PIX e cartão via link seguro. Dinheiro na entrega.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {METHODS.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            onClick={() => updatePayment({ method: value, needsChange: false, changeFor: '' })}
            className={`p-5 border text-left transition-all uppercase text-sm font-bold tracking-wider ${payment.method === value ? 'border-white bg-white text-black' : 'border-white/10 text-zinc-400 hover:border-white/40 hover:text-white'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {payment.method === 'PayOnDelivery' && (
        <div className="mt-6 p-6 border border-white/10 bg-white/5">
          <label className="text-xs uppercase tracking-widest text-zinc-400 mb-4 block font-bold">Precisa de troco?</label>
          <div className="flex gap-4 mb-6">
            <button type="button" onClick={() => updatePayment({needsChange: false, changeFor: ''})} className={`px-6 py-3 border text-sm font-bold uppercase transition-colors ${!payment.needsChange ? 'border-white bg-white text-black' : 'border-white/20 text-zinc-400 hover:text-white'}`}>Não</button>
            <button type="button" onClick={() => updatePayment({needsChange: true})} className={`px-6 py-3 border text-sm font-bold uppercase transition-colors ${payment.needsChange ? 'border-white bg-white text-black' : 'border-white/20 text-zinc-400 hover:text-white'}`}>Sim</button>
          </div>

          {payment.needsChange && (
            <div className="flex flex-col mt-6">
              <label htmlFor="changeFor" className="text-xs uppercase tracking-widest text-zinc-400 mb-2 font-bold flex justify-between">
                Troco para quanto?
                {errors.changeFor && <span className="text-red-400 font-normal">{errors.changeFor}</span>}
              </label>
              <input
                id="changeFor"
                type="text"
                inputMode="numeric"
                value={payment.changeFor}
                onChange={(e) => updatePayment({ changeFor: e.target.value })}
                placeholder="Ex: 50"
                className={`bg-transparent border-b ${errors.changeFor ? 'border-red-500' : 'border-white/20 focus:border-white'} outline-none py-3 px-2 text-white placeholder:text-zinc-700 transition-colors rounded-none w-full max-w-xs focus:bg-white/5`}
              />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
