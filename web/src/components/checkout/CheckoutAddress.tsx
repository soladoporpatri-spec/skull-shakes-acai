import { useState } from 'react';
import { CheckoutState } from '@/hooks/useCheckout';
import { lookupAddressByCep, calculateDistance } from '@/lib/address';
import { Loader2 } from 'lucide-react';

// Store Coordinates (Anápolis - Jardim Primavera 2ª Etapa)
const STORE_LAT = -16.32667;
const STORE_LNG = -48.95278;
const BASE_FEE = 3.00;
const COST_PER_KM = 1.50;

type Props = {
  address: CheckoutState['address'];
  updateAddress: (fields: Partial<CheckoutState['address']>) => void;
  errors: Record<string, string>;
};

const FormInput = ({ label, error, value, onChange, placeholder, type = "text", maxLength, autoComplete, inputMode, id }: any) => (
  <div className="flex flex-col mb-6 w-full">
    <label htmlFor={id} className="text-xs uppercase tracking-widest text-zinc-400 mb-2 font-bold flex justify-between">
      {label}
      {error && <span className="text-red-400 font-normal">{error}</span>}
    </label>
    <input
      id={id}
      type={type}
      inputMode={inputMode}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      autoComplete={autoComplete}
      className={`bg-transparent border-b ${error ? 'border-red-500' : 'border-white/20 focus:border-white'} outline-none py-3 text-white placeholder:text-zinc-700 transition-colors rounded-none focus:bg-white/5 px-2`}
    />
  </div>
);

export default function CheckoutAddress({ address, updateAddress, errors }: Props) {
  const [cepStatus, setCepStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [cepMsg, setCepMsg] = useState('');

  const formatCep = (v: string) => {
    const clean = v.replace(/\D/g, '');
    return clean.replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = formatCep(e.target.value);
    updateAddress({ cep: val });
    if (val.length === 9) {
      setCepStatus('loading');
      setCepMsg('Buscando endereço...');
      try {
        const data = await lookupAddressByCep(val);
        let distance = null;
        let fee = null;
        
        if (data.lat && data.lng) {
            distance = calculateDistance(STORE_LAT, STORE_LNG, parseFloat(data.lat), parseFloat(data.lng));
            fee = BASE_FEE + (distance * COST_PER_KM);
        }

        updateAddress({ 
          street: data.street, 
          neighborhood: data.neighborhood, 
          city: data.city, 
          state: data.state,
          lat: data.lat,
          lng: data.lng,
          distance: distance,
          deliveryFee: fee
        });
        setCepStatus('success');
        setCepMsg(fee !== null ? `Endereço encontrado (Entrega: R$ ${fee.toFixed(2).replace('.', ',')})` : 'Endereço encontrado (Distância exata indisponível)');
      } catch (err: any) {
        setCepStatus('error');
        setCepMsg(err.message === 'not_found' ? 'CEP não encontrado. Preencha manualmente.' : 'Erro ao buscar CEP. Preencha manualmente.');
      }
    } else {
      setCepStatus('idle');
      setCepMsg('');
      updateAddress({ distance: null, deliveryFee: null });
    }
  };

  return (
    <section className="mb-16">
      <h3 className="text-2xl font-bold uppercase mb-2 text-white">Endereço de Entrega</h3>
      <p className="text-zinc-400 mb-8 font-light text-sm">Informe onde devemos entregar seu pedido.</p>
      
      <div className="max-w-xs">
        <FormInput id="cep" label="CEP" error={errors.cep} value={address.cep} onChange={(v: string) => handleCepChange({target:{value:v}} as any)} placeholder="00000-000" maxLength={9} autoComplete="postal-code" inputMode="numeric" />
        {cepStatus !== 'idle' && (
          <p className={`text-sm mb-6 -mt-4 flex items-center gap-2 ${cepStatus === 'error' ? 'text-amber-400' : cepStatus === 'success' ? 'text-green-400' : 'text-zinc-400'}`}>
            {cepStatus === 'loading' && <Loader2 size={14} className="animate-spin" />}
            {cepMsg}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8">
        <div className="md:col-span-9">
          <FormInput id="street" label="Rua / Avenida" error={errors.street} value={address.street} onChange={(v: string) => updateAddress({street: v})} autoComplete="street-address" />
        </div>
        <div className="md:col-span-3">
          <FormInput id="number" label="Número" error={errors.number} value={address.number} onChange={(v: string) => updateAddress({number: v})} placeholder="Ex: 120" inputMode="numeric" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <FormInput id="complement" label="Complemento (Opcional)" value={address.complement} onChange={(v: string) => updateAddress({complement: v})} placeholder="Apto, Bloco..." />
        <FormInput id="neighborhood" label="Bairro" error={errors.neighborhood} value={address.neighborhood} onChange={(v: string) => updateAddress({neighborhood: v})} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <FormInput id="city" label="Cidade" error={errors.city} value={address.city} onChange={(v: string) => updateAddress({city: v})} />
        <FormInput id="state" label="Estado" error={errors.state} value={address.state} onChange={(v: string) => updateAddress({state: v})} placeholder="GO" maxLength={2} />
      </div>

      <div className="mt-8 border-t border-white/10 pt-16">
        <h3 className="text-xl font-bold uppercase mb-2 text-white">Quem vai receber?</h3>
        <p className="text-zinc-400 mb-8 font-light text-sm">Dados de quem receberá o pedido.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <FormInput
            id="nomeCliente"
            label="Nome Completo"
            error={errors.nomeCliente}
            value={address.nomeCliente}
            onChange={(v: string) => updateAddress({ nomeCliente: v, receiverName: v })}
            placeholder="Seu nome completo"
            autoComplete="name"
          />
          <FormInput
            id="telefone"
            label="Telefone / WhatsApp"
            error={errors.telefone}
            value={address.telefone}
            onChange={(v: string) => updateAddress({ telefone: v })}
            placeholder="(62) 99999-9999"
            autoComplete="tel"
            inputMode="tel"
            maxLength={15}
          />
        </div>
      </div>

    </section>
  );
}
