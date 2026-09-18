'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, Clock } from 'lucide-react';

interface HistItem {
  id: number;
  date: string;
  total: number;
}


export default function AcompanharPage() {
  const [pedidoId, setPedidoId] = useState('');
  const [historico, setHistorico] = useState<HistItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    try {
      const histStr = localStorage.getItem('skullshakes_historico');
      if (histStr) {
        const parsed = JSON.parse(histStr);
        setHistorico(parsed.reverse()); // most recent first
      }
    } catch(e){}
  }, []);

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

        {historico.length > 0 && (
          <div className="mt-12 border-t border-white/10 pt-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Seus Pedidos Recentes
            </h2>
            <div className="space-y-3">
              {historico.map((h, i) => (
                <Link
                  key={i}
                  href={/pedido/}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <span className="font-mono text-white text-lg">#{h.id}</span>
                  <div className="text-right">
                    <span className="block text-zinc-300 text-sm font-medium">
                      R$ {h.total.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="block text-zinc-500 text-xs">
                      {new Date(h.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
