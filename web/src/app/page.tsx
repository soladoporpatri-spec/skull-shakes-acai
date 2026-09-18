'use client';

import { useState } from 'react';
import CartButton from '@/components/ui/CartButton';
import CheckoutMap from '@/components/ui/CheckoutMap';
import CheckoutSection from '@/components/checkout/CheckoutSection';
import MenuItemCard from '@/components/ui/MenuItemCard';
import { useCartStore } from '@/store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { Check, ShoppingBag, ChevronRight, ChevronLeft, ArrowDown } from 'lucide-react';
import { getFeaturedProducts, getMenuByCategory, Product } from '@/data/products';

type CategoryType = 'Açaís' | 'Linha Nutella' | 'Batidinhas Gourmet';

export default function Home() {

    const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Skull Shakes',
    image: 'https://skullshakes.com.br/logo.jpg',
    '@id': 'https://skullshakes.com.br',
    url: 'https://skullshakes.com.br',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Anápolis',
      addressRegion: 'GO',
      addressCountry: 'BR'
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday'
        ],
        opens: '14:00',
        closes: '23:00'
      }
    ],
    servesCuisine: ['Açaí', 'Milkshake', 'Dessert'],
    priceRange: '$$',
    acceptsReservations: 'false'
  };

  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  const [activeCategory, setActiveCategory] = useState<CategoryType>('Açaís');
  
  // Hero Carousel State
  const featuredProducts = getFeaturedProducts();
  const menu = getMenuByCategory();

  const [heroIndex, setHeroIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const activeHero = featuredProducts[heroIndex];

  const handleAddToCart = (e: React.MouseEvent, item: Product) => {
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
        <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center pointer-events-none px-5 py-6 md:px-12 md:py-10">
          <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight uppercase drop-shadow-lg pointer-events-auto">
            <span className="transition-colors duration-500" style={{ color: activeHero.theme.text }}>SKULL</span> <span className="bg-gradient-to-r from-[#d946ef] to-[#a855f7] bg-clip-text text-transparent">SHAKES</span>
          </h1>
          <Link href="/acompanhar" className="pointer-events-auto flex items-center gap-2 text-white/80 hover:text-white transition-colors text-xs md:text-sm font-bold tracking-widest uppercase border border-white/20 hover:border-white/60 px-4 py-2.5 md:px-5 md:py-2.5 bg-black/20 backdrop-blur-sm">
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Acompanhar Pedido</span>
          </Link>
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
            <div className="relative w-full max-w-[34rem] h-full md:max-w-[42rem] flex items-end justify-center">
              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.img
                  key={activeHero.image}
                  src={activeHero.image}
                  alt={activeHero.shortName}
                  width={1024}
                  height={768}
                  custom={direction}
                  variants={bottleVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute object-contain w-auto max-h-[75vh] md:max-h-[85vh] z-10 bottom-0"
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
