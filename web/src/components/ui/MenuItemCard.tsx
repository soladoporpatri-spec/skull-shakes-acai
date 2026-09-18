import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Check, ShoppingBag, Plus } from 'lucide-react';

export default function MenuItemCard({ item, isInCart, onAdd }: any) {
  const [expanded, setExpanded] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  const handleToggleOption = (opt: any) => {
    setSelectedOptions(prev => 
      prev.find(o => o.name === opt.name)
        ? prev.filter(o => o.name !== opt.name)
        : [...prev, opt]
    );
  };

  const totalPrice = item.price + selectedOptions.reduce((sum, o) => sum + o.price, 0);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.customizable && !expanded) {
      setExpanded(true);
      return;
    }
    
    onAdd(e, { 
      ...item, 
      price: totalPrice, 
      options: selectedOptions.length > 0 ? selectedOptions : undefined 
    });
    
    setExpanded(false);
    setSelectedOptions([]);
  };

  return (
    <div className="group flex flex-col p-6 md:p-8 border border-white/10 hover:border-white/30 transition-all bg-white/5">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex-1 pr-4 mb-4 md:mb-0">
          <h4 className="text-xl font-bold mb-2 text-white transition-colors group-hover:text-brand">
            {item.name}
          </h4>
          <p className="text-sm text-zinc-400">
            {item.desc}
          </p>
          <div className="text-zinc-500 text-[10px] mt-3 font-bold uppercase tracking-widest">500 ml</div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between md:justify-end gap-4 sm:gap-6 w-full md:w-auto mt-2 md:mt-0">
          <span className="font-display text-2xl sm:text-3xl text-white">
            R$ {totalPrice.toFixed(2).replace('.', ',')}
          </span>
          <button 
            onClick={handleAdd} 
            className={`flex items-center justify-center w-full sm:w-auto gap-2 border px-6 py-3 text-sm uppercase font-bold transition-all ${(!item.customizable && isInCart(item.id)) ? 'bg-brand border-brand text-white' : 'border-white/20 text-white hover:bg-white hover:text-black hover:border-white bg-black/30'}`}
          >
            {(!item.customizable && isInCart(item.id)) ? <Check size={16} /> : (item.customizable && !expanded ? <Plus size={16} /> : <ShoppingBag size={16} />)}
            {(!item.customizable && isInCart(item.id)) ? 'Adicionado' : (item.customizable && !expanded ? 'Montar' : 'Adicionar')}
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {item.customizable && expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="mt-6 pt-6 border-t border-white/10 overflow-hidden"
          >
            <h5 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">Adicionais (+ R$)</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {item.options?.map((opt: any) => {
                const isSelected = selectedOptions.some(o => o.name === opt.name);
                return (
                  <button 
                    key={opt.name} 
                    onClick={() => handleToggleOption(opt)}
                    className={`flex justify-between items-center px-4 py-3 border text-sm transition-all ${isSelected ? 'border-brand text-white bg-brand/20' : 'border-white/10 text-zinc-400 hover:border-white/30'}`}
                  >
                    <span>{opt.name}</span>
                    <span className="font-bold">+R$ {opt.price.toFixed(2).replace('.', ',')}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
