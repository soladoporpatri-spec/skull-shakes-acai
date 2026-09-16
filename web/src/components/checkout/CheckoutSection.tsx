'use client';

import { useState, useRef, useCallback } from 'react';
import { useCheckout } from '@/hooks/useCheckout';
import CheckoutAddress from './CheckoutAddress';
import PaymentMethod from './PaymentMethod';
import OrderSummary from './OrderSummary';
import { useCartStore } from '@/store/cartStore';

// ---------------------------------------------------------------------------
// Types for the possible backend responses
// ---------------------------------------------------------------------------
type PixData = {
  qrCodeBase64: string;
  qrCode: string; // the "copia e cola" string
};

type OrderResponse = {
  id?: number | string;
  pix?: PixData;
  checkoutUrl?: string;
};

// ---------------------------------------------------------------------------
// Status type - extends 'success' to cover card redirect & pix
// ---------------------------------------------------------------------------
type Status = 'idle' | 'submitting' | 'success' | 'pix_pending';

export default function CheckoutSection() {
  const { state, updateAddress, updatePayment, updateNotes } = useCheckout();
  const clearCart = useCartStore((s) => s.clearCart);
  const cartItems = useCartStore((s) => s.items);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [copied, setCopied] = useState(false);

  // Idempotency key - generated once per mount, lives for the component lifecycle.
  // Not a security measure; just prevents double-click duplicates.
  const idempotencyKeyRef = useRef<string>(crypto.randomUUID());

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!state.address.cep)           newErrors.cep          = 'Obrigatório';
    if (!state.address.street)        newErrors.street       = 'Obrigatório';
    if (!state.address.number)        newErrors.number       = 'Obrigatório';
    if (!state.address.neighborhood)  newErrors.neighborhood = 'Obrigatório';
    if (!state.address.city)          newErrors.city         = 'Obrigatório';
    if (!state.address.state)         newErrors.state        = 'Obrigatório';
    if (!state.address.nomeCliente)   newErrors.nomeCliente  = 'Obrigatório';
    if (!state.address.telefone)      newErrors.telefone     = 'Obrigatório';
    if (!state.payment.method)        newErrors.method       = 'Escolha uma forma';

    if (
      state.payment.method === 'PayOnDelivery' &&
      state.payment.needsChange &&
      !state.payment.changeFor
    ) {
      newErrors.changeFor = 'Informe o valor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------------------------------------------------------------------
  // Submit handler
  // ---------------------------------------------------------------------------
  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    setStatus('submitting');

    try {
      // Build the payload - NEVER include price, total, subtotal, or deliveryFee.
      // The backend recalculates all monetary values from its own database.
      const payload = {
        nomeCliente: state.address.nomeCliente.trim(),
        telefone: state.address.telefone.trim(),
        cep: state.address.cep,
        endereco: [
          state.address.street,
          state.address.number,
          state.address.complement,
          state.address.neighborhood,
          `${state.address.city}/${state.address.state}`,
        ]
          .filter(Boolean)
          .join(', '),
        formaPagamento: state.payment.method, // already the backend enum value
        observacoes: state.notes,
        idempotencyKey: idempotencyKeyRef.current,
        itens: cartItems.map((item) => ({
          produtoId: item.id,
          quantidade: item.quantity,
          adicionaisIds: [] as string[],
        })),
      };

      // Public endpoint - no authentication header required
      const response = await fetch('http://localhost:5210/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let msg = 'Não foi possível registrar seu pedido. Tente novamente.';
        try {
          const body = await response.json();
          if (body?.message) msg = body.message;
        } catch { /* ignore parse errors */ }
        throw new Error(msg);
      }

      const data: OrderResponse = await response.json();

      // Route based on payment method response
      if (data.pix) {
        // PIX - show QR code screen; do NOT clear cart yet (user hasn't paid)
        setPixData(data.pix);
        setStatus('pix_pending');
        return;
      }

      if (data.checkoutUrl) {
        // Card (Mercado Pago) - redirect to the secure hosted checkout page
        window.location.href = data.checkoutUrl;
        return;
      }

      // PayOnDelivery or any other method without extra data
      setStatus('success');
      clearCart();
    } catch (error: unknown) {
      console.error('[checkout]', error);
      setStatus('idle');
      const msg =
        error instanceof Error
          ? error.message
          : 'Ocorreu um erro inesperado. Tente novamente.';
      alert(msg);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, cartItems, clearCart]);

  // ---------------------------------------------------------------------------
  // PIX pending screen
  // ---------------------------------------------------------------------------
  if (status === 'pix_pending' && pixData) {
    const handleCopy = () => {
      navigator.clipboard.writeText(pixData!.qrCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });
    };

    return (
      <section
        id="checkout"
        className="w-full min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center py-24 px-4 border-t border-white/5 relative z-10"
      >
        <h2 className="text-5xl md:text-7xl font-display font-bold mb-4 uppercase text-center text-white">
          PAGUE VIA PIX
        </h2>
        <p className="text-zinc-400 mb-12 max-w-lg text-center text-lg leading-relaxed">
          Escaneie o QR Code ou copie o código abaixo para finalizar seu pedido.
        </p>

        {/* QR Code image */}
        <div className="mb-8 p-4 bg-white rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/png;base64,${pixData.qrCodeBase64}`}
            alt="QR Code PIX"
            width={220}
            height={220}
            className="block"
          />
        </div>

        {/* Copia e cola */}
        <div className="w-full max-w-lg mb-6">
          <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2 font-bold">
            Código Pix (copia e cola)
          </label>
          <div className="flex gap-2">
            <input
              readOnly
              value={pixData.qrCode}
              className="flex-1 bg-white/5 border border-white/20 outline-none px-4 py-3 text-white text-sm font-mono truncate"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              type="button"
              onClick={handleCopy}
              className="px-6 py-3 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-zinc-200 transition-colors shrink-0"
            >
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>

        <p className="text-zinc-500 text-sm text-center max-w-sm">
          Após o pagamento confirmado, você receberá uma notificação. Guarde o comprovante.
        </p>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // PayOnDelivery success screen
  // ---------------------------------------------------------------------------
  if (status === 'success') {
    return (
      <section
        id="checkout"
        className="w-full min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center py-24 px-4 border-t border-white/5 relative z-10"
      >
        <h2 className="text-5xl md:text-7xl font-display font-bold mb-6 uppercase text-center text-white">
          PEDIDO RECEBIDO!
        </h2>
        <p className="text-zinc-400 mb-12 max-w-lg text-center text-lg leading-relaxed">
          Seu pedido foi registrado com sucesso.<br />
          Em breve entraremos em contato para confirmar a entrega.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus('idle');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-10 py-5 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-zinc-200 transition-colors shadow-xl"
        >
          Voltar ao Início
        </button>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // Main checkout form
  // ---------------------------------------------------------------------------
  return (
    <section
      id="checkout"
      className="w-full bg-[#0a0a0a] text-white py-24 px-4 md:px-8 lg:px-16 border-t border-white/5 relative z-10"
    >
      <header className="mb-16 max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-[6rem] leading-none font-display font-bold uppercase mb-6">
          Finalizar Pedido.
        </h2>
        <p className="text-zinc-400 font-light text-xl">Confira seus dados antes de enviar.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative max-w-7xl mx-auto">

        <div className="flex-1 max-w-3xl">
          <CheckoutAddress
            address={state.address}
            updateAddress={updateAddress}
            errors={errors}
          />

          <section className="mb-16 border-t border-white/10 pt-16">
            <h3 className="text-2xl font-bold uppercase mb-2 text-white">Entrega</h3>
            <p className="text-zinc-400 mb-8 font-light text-sm">Entrega em domicílio.</p>
            <div className="p-6 border border-white/10 bg-white/5 text-zinc-300 text-sm">
              <span className="block mb-2 font-bold uppercase tracking-widest text-xs opacity-60">
                Sobre a Entrega
              </span>
              O valor da taxa de entrega é calculado automaticamente com base na distância (km) do
              nosso estabelecimento até o seu endereço.
            </div>
          </section>

          <div className="border-t border-white/10 pt-16">
            <PaymentMethod
              payment={state.payment}
              updatePayment={updatePayment}
              errors={errors}
            />
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
          <OrderSummary
            onSubmit={handleSubmit}
            isSubmitting={status === 'submitting'}
            status={status}
            deliveryFee={state.address.deliveryFee}
          />
        </aside>
      </div>
    </section>
  );
}
