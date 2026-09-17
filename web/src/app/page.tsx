'use client';

import { useState } from 'react';
import CartButton from '@/components/ui/CartButton';
import CheckoutMap from '@/components/ui/CheckoutMap';
import CheckoutSection from '@/components/checkout/CheckoutSection';
import MenuItemCard from '@/components/ui/MenuItemCard';
import { useCartStore } from '@/store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShoppingBag, ChevronRight, ChevronLeft, ArrowDown } from 'lucide-react';

type CategoryType = 'Açaís' | 'Linha Nutella' | 'Batidinhas Gourmet';

export default function Home() {
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  const [activeCategory, setActiveCategory] = useState<CategoryType>('Açaís');
  
  // Hero Carousel State
  const featuredProducts = [
    {
      id: '1',
      shortName: 'TRADICIONAL',
      label: 'AÇAÍ',
      desc: 'Açaí puro expresso incrivelmente cremoso.',
      flavorType: 'acai',
      image: '/products/bottle-acai.png',
      theme: { bg: '#1c0330', text: '#ffffff', accent: '#a855f7' }
    },
    {
      id: 'ss-maracuja',
      shortName: 'MARACUJÁ',
      label: 'BATIDINHA GOURMET',
      desc: 'Batidinha gourmet de maracujá suíço com geleia, incrivelmente refrescante.',
      flavorType: 'passion',
      image: '/products/bottle-maracuja.png',
      theme: { bg: '#fbbf24', text: '#1c1917', accent: '#d97706' }
    },
    {
      id: 'ss-morango',
      shortName: 'MORANGO',
      label: 'BATIDINHA GOURMET',
      desc: 'Batidinha gourmet de morango ao leite com geleia, cremosa e marcante.',
      flavorType: 'strawberry',
      image: '/products/bottle-morango.png',
      theme: { bg: '#881337', text: '#ffffff', accent: '#fda4af' }
    },
  ];

  const [heroIndex, setHeroIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev

  const activeHero = featuredProducts[heroIndex];

  const menu = [
    {
      category: "Açaís",
      subtitle: "Açaí cremoso na garrafa de 500 ml.",
      items: [
        { id: '1', name: 'SS Tradicional', desc: 'Açaí puro expresso.', price: 20, flavorType: 'acai', image: '/products/bottle-acai.png' },
        { id: '2', name: 'SS com Leite em Pó', desc: 'Açaí, leite em pó e leite condensado.', price: 20, flavorType: 'acai', image: '/products/bottle-acai.png' },
        { 
          id: '3', 
          name: 'Monte o seu SS', 
          desc: 'Açaí puro. Escolha seus adicionais.', 
          price: 20, 
          flavorType: 'acai', 
          image: '/products/bottle-acai.png',
          customizable: true,
          options: [
              { id: 1, name: 'Banana', price: 3 },
              { id: 2, name: 'Morango', price: 3 },
              { id: 3, name: 'Paçoca', price: 3 },
              { id: 4, name: 'Ninho', price: 3 },
              { id: 5, name: 'Guaraná', price: 3 },
              { id: 6, name: 'Nutella', price: 5 }
            ]
        }
      ]
    },
    {
      category: "Linha Nutella",
      subtitle: "Pra quem não abre mão de muita Nutella.",
      items: [
        { id: '4', name: 'SS Tradicional com Nutella', desc: 'Açaí, leite Ninho, leite condensado e Nutella.', price: 25, flavorType: 'acai', image: '/products/bottle-acai.png' },
        { id: '5', name: 'SS Paçoca com Nutella', desc: 'Açaí, creme de paçoca especial e Nutella.', price: 28, flavorType: 'acai', image: '/products/bottle-acai.png' },
        { id: '6', name: 'SS Limão com Nutella', desc: 'Batidinha gourmet de limão especial e Nutella.', price: 28, flavorType: 'passion', image: '/products/bottle-maracuja.png' },
        { id: '7', name: 'SS Morango com Nutella', desc: 'Batidinha gourmet de morango especial e muita Nutella.', price: 28, flavorType: 'strawberry', image: '/products/bottle-morango.png' },
        { id: '8', name: 'SS Maracujá com Nutella', desc: 'Batidinha gourmet de maracujá especial e muita Nutella.', price: 28, flavorType: 'passion', image: '/products/bottle-maracuja.png' },
      ]
    },
    {
      category: "Batidinhas Gourmet",
      subtitle: "Batidas gourmet, ultra cremosas e geladas prontas pra beber no canudo.",
      items: [
        { id: 'bg-morango-geleia', name: 'Morango ao Leite c/ Geleia', desc: 'Nossa exclusiva batidinha gourmet de morango ao leite com deliciosa geleia.', price: 18, flavorType: 'strawberry', image: '/products/bottle-morango.png' },
        { id: 'bg-maracuja-geleia', name: 'Maracujá Suíço c/ Geleia', desc: 'Batidinha gourmet refrescante de maracujá suíço finalizada com geleia.', price: 18, flavorType: 'passion', image: '/products/bottle-maracuja.png' },
        { id: 'bg-ninho-nutella', name: 'Creme de Ninho c/ Nutella', desc: 'Cremosa batidinha gourmet de leite Ninho recheada de Nutella.', price: 23, flavorType: 'acai', image: '/products/bottle-acai.png' },
        { id: 'bg-morango-nutella', name: 'Morango c/ Nutella', desc: 'Batidinha gourmet de morango especial acompanhada de Nutella.', price: 20, flavorType: 'strawberry', image: '/products/bottle-morango.png' },
        { id: 'bg-maracuja-nutella', name: 'Maracujá c/ Nutella', desc: 'Batidinha gourmet de maracujá suíço com uma dose generosa de Nutella.', price: 20, flavorType: 'passion', image: '/products/bottle-maracuja.png' },
        { id: 'bg-uva-nutella', name: 'Uva c/ Nutella', desc: 'Incrível batidinha gourmet sabor uva perfeitamente harmonizada com Nutella.', price: 20, flavorType: 'acai', image: '/products/bottle-acai.png' },
      ]
    }
  ];

  const handleAddToCart = (e: React.MouseEvent, item: any) => {
    e.stopPropagation(); 
    addItem({ 
      id: item.id, 
      name: item.name, 
      price: item.price, 
      quantity: 1, 
      options: item.options 
    });
  };

  const isInCart = (id: string) => cartItems.some(item => item.id === id);

  const nextHero = () => {
    setDirection(1);
    setHeroIndex((prev) => (prev + 1) % featuredProducts.length);
  };
  const prevHero = () => {
    setDirection(-1);
    setHeroIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const scrollToMenu = () => {
    document.getElementById('cardapio')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fake 3D Bottle Illusion Animation variants
  const bottleVariants: any = {
    enter: (dir: number) => ({
      x: dir > 0 ? 250 : -250,
      scaleX: 0.85,
      scale: 0.9,
      rotate: dir > 0 ? 12 : -12,
      opacity: 0
    }),
    center: {
      x: 0,
      scaleX: 1,
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -250 : 250,
      scaleX: 0.85,
      scale: 0.9,
      rotate: dir > 0 ? -12 : 12,
      opacity: 0,
      transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] }
    })
  };

  // Text Animation variants (follows direction)
  const textVariants: any = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut", delay: 0.1 } },
    exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0, transition: { duration: 0.3 } })
  };

  return (
    <main className="relative min-h-screen w-full selection:bg-brand selection:text-white font-sans bg-black">
      <CartButton />
      
      {/* Solid background color that transitions smoothly */}
      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none"
        initial={false}
        animate={{ backgroundColor: activeHero.theme.bg }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      {/* Hero Showcase Section - Editorial Composition */}
      <section 
        onClick={nextHero}
        className="relative z-10 w-full min-h-screen flex flex-col justify-center items-center overflow-hidden cursor-pointer"
      >
        
        {/* Header / Logo */}
        <div className="absolute top-8 left-8 md:top-12 md:left-12 z-50">
          <h1 className="text-3xl font-display font-black tracking-tight uppercase drop-shadow-lg">
            <span className="transition-colors duration-500" style={{ color: activeHero.theme.text }}>SKULL</span> <span className="bg-gradient-to-r from-[#d946ef] to-[#a855f7] bg-clip-text text-transparent">SHAKES</span>
          </h1>
        </div>

        {/* Editorial Layout Wrapper */}
        <div className="relative w-full max-w-7xl h-full grid grid-cols-1 md:grid-cols-2 flex-1 mt-32 md:mt-0">
          
          {/* Left Column: Huge Title & Description */}
          <div className="flex flex-col justify-center px-5 sm:px-8 md:px-0 md:pl-20 z-20 order-2 md:order-1 pt-8 md:pt-0 pb-32 md:pb-0 w-full">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeHero.id}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col items-start w-full"
              >
                <motion.span 
                   animate={{ color: activeHero.theme.text }}
                   className="text-lg md:text-xl font-bold tracking-[0.2em] mb-4 uppercase opacity-80"
                >
                  SS {activeHero.label}
                </motion.span>
                <motion.h2 
                  animate={{ color: activeHero.theme.text }}
                  className="text-[11.5vw] md:text-[6.5vw] xl:text-[7rem] font-black uppercase leading-[0.85] tracking-tight mb-8 drop-shadow-sm whitespace-nowrap"
                >
                  {activeHero.shortName}
                </motion.h2>
                <motion.p 
                  animate={{ color: activeHero.theme.text }}
                  className="text-lg md:text-2xl font-light mb-12 max-w-md leading-relaxed opacity-90"
                >
                  {activeHero.desc}
                </motion.p>
                <button 
                  onClick={(e) => { e.stopPropagation(); scrollToMenu(); }}
                  style={{ backgroundColor: activeHero.theme.text, color: activeHero.theme.bg }}
                  className="group flex items-center gap-3 px-8 py-5 text-lg font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl"
                >
                  Ver Cardápio
                  <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: The Bottle Illusion */}
          <div className="relative flex items-center justify-center md:justify-end pr-0 md:pr-12 z-10 order-1 md:order-2 h-[45vh] md:h-full pointer-events-none">
            <div className="relative w-full max-w-[34rem] h-full md:max-w-[48rem] flex items-center justify-center">
              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.img
                  key={activeHero.image}
                  src={activeHero.image}
                  alt={activeHero.shortName}
                  custom={direction}
                  variants={bottleVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute object-contain max-h-[calc(125%+50px)] md:max-h-[calc(155%+50px)] drop-shadow-[0_20px_50px_rgba(0,0,0,0.7)] z-10 bottom-0 md:bottom-[-2%] -translate-y-[10px]"
                />
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Custom Sophisticated Navigation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 md:gap-16 z-50">
          <button 
            onClick={(e) => { e.stopPropagation(); prevHero(); }}
            aria-label="Produto anterior"
            className="flex items-center gap-2 font-bold tracking-widest text-xs md:text-sm uppercase opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white p-2"
            style={{ color: activeHero.theme.text }}
          >
            <ChevronLeft size={20} /> <span className="hidden md:inline">Anterior</span>
          </button>
          
          <div className="flex gap-4 md:gap-8">
            {featuredProducts.map((p, i) => (
              <button 
                key={p.id}
                aria-label={`Ver destaque ${p.label}`}
                onClick={(e) => {
                   e.stopPropagation();
                   if(i === heroIndex) return;
                   setDirection(i > heroIndex ? 1 : -1);
                   setHeroIndex(i);
                }}
                className={`text-xs md:text-sm font-bold tracking-[0.15em] uppercase transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white p-2 ${i === heroIndex ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-70'}`}
                style={{ color: activeHero.theme.text }}
              >
                {i === heroIndex ? '●' : '○'} <span className="hidden md:inline ml-2">{p.label}</span>
              </button>
            ))}
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); nextHero(); }}
            aria-label="Próximo produto"
            className="flex items-center gap-2 font-bold tracking-widest text-xs md:text-sm uppercase opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white p-2"
            style={{ color: activeHero.theme.text }}
          >
            <span className="hidden md:inline">Próximo</span> <ChevronRight size={20} />
          </button>
        </div>

      </section>

      {/* Menu Section */}
      <section id="cardapio" className="relative z-10 w-full min-h-screen bg-[#0a0a0a] border-t border-white/5 pt-24 pb-12 px-4 md:px-8 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-12 uppercase border-b border-white/10 pb-4">
            Cardápio.
          </h2>
          
          <div className="flex gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
            {menu.map(cat => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category as CategoryType)}
                className={`whitespace-nowrap px-8 py-3 uppercase font-bold text-sm transition-all border ${
                  activeCategory === cat.category 
                    ? 'border-white bg-white text-black' 
                    : 'border-white/20 text-white hover:border-white/50 bg-black/30'
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4"
              >
                {menu.find(c => c.category === activeCategory)?.items.map((item) => (
                  <MenuItemCard 
                    key={item.id} 
                    item={item} 
                    isInCart={isInCart} 
                    onAdd={handleAddToCart} 
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <CheckoutSection />

      {/* Footer Section */}
      <footer className="w-full bg-black border-t border-white/10 py-12 px-6 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-xl font-display font-black tracking-widest uppercase">
              <span className="text-white">Skull</span> <span className="bg-gradient-to-r from-[#d946ef] to-[#a855f7] bg-clip-text text-transparent">Shakes</span>
            </h2>
            <p className="text-zinc-500 text-sm mt-2">© {new Date().getFullYear()} Todos os direitos reservados.</p>
          </div>
          
          <div className="flex gap-8">
            <a 
              href="https://instagram.com/skullshakes" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm uppercase tracking-widest font-bold"
            >
              Instagram
            </a>
            <a 
              href="https://wa.me/5562998832935" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm uppercase tracking-widest font-bold"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
