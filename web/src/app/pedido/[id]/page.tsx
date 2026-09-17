'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, CheckCircle2, Clock, Package, Truck, ArrowLeft } from 'lucide-react';

interface OrderData {
  id: number;
  nomeCliente: string;
  total: number;
  statusPedido: string;
  statusPagamento: string;
  formaPagamento: string;
  modalidadePagamento: string;
  dataCriacao: string;
}

export default function PedidoTrackingPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchOrder = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5210';
        const res = await fetch(`${API_URL}/pedidos/${params.id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error('Pedido não encontrado.');
          throw new Error('Erro ao carregar pedido.');
        }
        const data = await res.json();
        setOrder(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Poll every 5 seconds
    interval = setInterval(fetchOrder, 5000);

    return () => clearInterval(interval);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <Loader2 className="animate-spin w-10 h-10 text-zinc-500" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white px-4 text-center">
        <h2 className="text-3xl font-display font-bold mb-4">Ops!</h2>
        <p className="text-zinc-400 mb-8">{error || 'Pedido não encontrado.'}</p>
        <Link href="/" className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors">
          Voltar ao Início
        </Link>
      </div>
    );
  }

  // Determine the current step index
  // Steps: 
  // 0: Aguardando pagamento
  // 1: Pagamento aprovado
  // 2: Pedido em preparação
  // 3: Enviado para entrega
  // 4: Entregue
  
  let currentStep = 0;
  
  if (order.statusPagamento === 'Paid' || order.modalidadePagamento === 'OnDelivery') {
    currentStep = 1; // Pagamento aprovado (ou pagar na entrega)
  }

  if (order.statusPedido === 'Processing' && currentStep >= 1) {
    currentStep = 2; // Preparação
  }
  if (order.statusPedido === 'OutForDelivery') {
    currentStep = 3; // Entrega
  }
  if (order.statusPedido === 'Delivered') {
    currentStep = 4; // Entregue
  }

  const steps = [
    { label: order.modalidadePagamento === 'OnDelivery' ? 'Pagamento na entrega' : 'Aguardando pagamento', icon: Clock },
    { label: order.modalidadePagamento === 'OnDelivery' ? 'Pedido confirmado' : 'Pagamento aprovado', icon: CheckCircle2 },
    { label: 'Pedido em preparação', icon: Package },
    { label: 'Enviado para entrega', icon: Truck },
    { label: 'Entregue', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-zinc-400 hover:text-white mb-8 transition-colors text-sm uppercase tracking-widest font-bold">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Início
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold uppercase mb-4">
            Pedido #{order.id}
          </h1>
          <p className="text-zinc-400 text-lg">
            Olá, <strong className="text-white">{order.nomeCliente}</strong>! Acompanhe o status do seu pedido abaixo.
          </p>
        </header>

        {/* Info Box */}
        <div className="mb-12 p-6 border border-white/10 bg-white/5">
          <p className="text-zinc-300 text-sm font-light text-center">
            Prazo estimado de entrega: <br />
            <strong className="text-white font-bold text-lg mt-2 inline-block">mínimo 30 minutos e máximo 2 horas</strong>
          </p>
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-white/10 ml-6 md:ml-8 mb-16 space-y-8 py-4">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const Icon = step.icon;
            
            let circleColor = "bg-[#0a0a0a] border-white/20 text-zinc-600";
            let textColor = "text-zinc-500";
            
            if (isCompleted) {
              circleColor = "bg-white border-white text-black";
              textColor = "text-white";
            } else if (isCurrent) {
              circleColor = "bg-[#0a0a0a] border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.5)]";
              textColor = "text-white font-bold";
            }

            return (
              <div key={index} className="relative pl-8 md:pl-12">
                <div className={`absolute -left-[17px] top-0.5 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${circleColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className={`pt-1.5 transition-colors duration-500 ${textColor}`}>
                  <span className="uppercase tracking-widest text-sm">{step.label}</span>
                  {isCurrent && index === 0 && order.formaPagamento === 'Pix' && (
                    <p className="mt-2 text-xs text-zinc-400 normal-case tracking-normal">
                      Estamos aguardando a confirmação do seu PIX.
                    </p>
                  )}
                  {isCurrent && index === 3 && (
                    <p className="mt-2 text-xs text-zinc-400 normal-case tracking-normal">
                      Seu pedido já saiu e está a caminho!
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Details Summary */}
        <div className="border-t border-white/10 pt-8">
          <h3 className="text-xl font-bold uppercase mb-4">Resumo</h3>
          <div className="flex justify-between text-zinc-400 text-sm mb-2">
            <span>Total a pagar</span>
            <span className="text-white font-bold text-lg">R$ {order.total.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between text-zinc-400 text-sm">
            <span>Forma de pagamento</span>
            <span className="text-white uppercase tracking-widest text-xs">
              {order.formaPagamento === 'Pix' ? 'PIX' : order.formaPagamento === 'Cash' ? 'Dinheiro' : 'Cartão'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
