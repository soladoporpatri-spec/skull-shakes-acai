'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function AcompanharPage() {
  const [pedidoId, setPedidoId] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (pedidoId.trim()) {
      router.push('/pedido/' + pedidoId.trim());
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-4 md:px-8 flex flex-col items-center">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center text-zinc-400 hover:text-white mb-12 transition-colors text-sm uppercase tracking-widest font-bold">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Início
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-display font-bold uppercase mb-6 text-center">
          Acompanhar Pedido
        </h1>
        <p className="text-zinc-400 text-center mb-10">
          Digite o número do seu pedido para visualizar o status em tempo real.
        </p>

        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2 font-bold">
              Nº do Pedido
            </label>
            <input
              type="number"
              value={pedidoId}
              onChange={(e) => setPedidoId(e.target.value)}
              placeholder="Ex: 123"
              className="w-full bg-white/5 border border-white/20 outline-none px-4 py-4 text-white text-lg font-mono focus:border-white transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-zinc-200 transition-colors flex items-center justify-center"
          >
            <Search className="w-4 h-4 mr-2" />
            Buscar Pedido
          </button>
        </form>
      </div>
    </div>
  );
}
