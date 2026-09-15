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

  return (
    <button 
      onClick={scrollToCheckout}
      aria-label={`Carrinho de Compras com ${totalItems} itens`}
      className="fixed top-4 right-4 md:top-8 md:right-8 z-50 bg-black/80 backdrop-blur-md p-4 rounded-full border border-white/10 hover:border-white focus:outline-none focus:ring-2 focus:ring-white transition-all flex items-center gap-2 group shadow-xl"
    >
      <ShoppingCart className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      {totalItems > 0 && (
        <span className="bg-white text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center absolute -top-2 -right-2 shadow-lg border border-black">
          {totalItems}
        </span>
      )}
    </button>
  );
}
