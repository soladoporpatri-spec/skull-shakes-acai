'use client';

import { useCartStore } from '@/store/cartStore';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export default function CartButton() {
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const scrollToCheckout = () => {
    document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (totalItems === 0) return null;

  return (
    <button 
      onClick={scrollToCheckout}
      aria-label={`Carrinho de Compras com ${totalItems} itens`}
      className="fixed bottom-6 right-6 z-50 bg-white text-black backdrop-blur-md pl-5 pr-6 py-3 rounded-full border border-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white transition-all flex items-center gap-3 group shadow-2xl"
    >
      <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span className="font-bold text-sm uppercase tracking-wider">
        Carrinho ({totalItems})
      </span>
    </button>
  );
}
