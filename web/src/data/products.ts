export interface ProductOption {
  id: number;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortName?: string;
  label?: string;
  desc: string;
  price: number;
  flavorType: 'acai' | 'passion' | 'strawberry' | 'guarana' | string;
  image: string;
  customizable?: boolean;
  options?: ProductOption[];
  theme?: { bg: string; text: string; accent: string };
  category: string;
}

export const menuProducts: Product[] = [
  { id: '1', slug: 'ss-tradicional', name: 'SS Tradicional', shortName: 'TRADICIONAL', label: 'AÇAÍ', desc: 'Açaí puro expresso incrivelmente cremoso na garrafa de 500 ml.', price: 20, flavorType: 'acai', image: '/products/bottle-acai.png', category: 'Açaís', theme: { bg: '#1c0330', text: '#ffffff', accent: '#a855f7' } },
  { id: '2', slug: 'ss-com-leite-em-po', name: 'SS com Leite em Pó', desc: 'Açaí, leite em pó e leite condensado.', price: 20, flavorType: 'acai', image: '/products/bottle-acai.png', category: 'Açaís' },
  { 
    id: '3', 
    slug: 'monte-o-seu-ss',
    name: 'Monte o seu SS', 
    desc: 'Açaí puro. Escolha seus adicionais.', 
    price: 20, 
    flavorType: 'acai', 
    image: '/products/bottle-acai.png',
    category: 'Açaís',
    customizable: true,
    options: [
        { id: 1, name: 'Banana', price: 3 },
        { id: 2, name: 'Morango', price: 3 },
        { id: 3, name: 'Paçoca', price: 3 },
        { id: 4, name: 'Ninho', price: 3 },
        { id: 5, name: 'Guaraná', price: 3 },
        { id: 6, name: 'Nutella', price: 5 }
      ]
  },
  { id: '4', slug: 'ss-tradicional-com-nutella', name: 'SS Tradicional com Nutella', desc: 'Açaí, leite Ninho, leite condensado e Nutella.', price: 25, flavorType: 'acai', image: '/products/bottle-acai.png', category: 'Linha Nutella' },
  { id: '5', slug: 'ss-pacoca-com-nutella', name: 'SS Paçoca com Nutella', desc: 'Açaí, creme de paçoca especial e Nutella.', price: 28, flavorType: 'acai', image: '/products/bottle-acai.png', category: 'Linha Nutella' },
  { id: '6', slug: 'ss-limao-com-nutella', name: 'SS Limão com Nutella', desc: 'Batidinha gourmet de limão especial e Nutella.', price: 28, flavorType: 'passion', image: '/products/bottle-maracuja.png', category: 'Linha Nutella' },
  { id: '7', slug: 'ss-morango-com-nutella', name: 'SS Morango com Nutella', desc: 'Batidinha gourmet de morango especial e muita Nutella.', price: 28, flavorType: 'strawberry', image: '/products/bottle-morango.png', category: 'Linha Nutella' },
  { id: '8', slug: 'ss-maracuja-com-nutella', name: 'SS Maracujá com Nutella', desc: 'Batidinha gourmet de maracujá especial e muita Nutella.', price: 28, flavorType: 'passion', image: '/products/bottle-maracuja.png', category: 'Linha Nutella' },
  { id: 'bg-maracuja', slug: 'batidinha-maracuja', name: 'Maracujá Suíço', shortName: 'MARACUJÁ', label: 'BATIDINHA GOURMET', desc: 'Batidinha gourmet de maracujá suíço com geleia, incrivelmente refrescante.', price: 20, flavorType: 'passion', image: '/products/bottle-maracuja.png', category: 'Batidinhas Gourmet', theme: { bg: '#fbbf24', text: '#1c1917', accent: '#d97706' } },
  { id: 'bg-morango', slug: 'batidinha-morango', name: 'Morango ao Leite', shortName: 'MORANGO', label: 'BATIDINHA GOURMET', desc: 'Batidinha gourmet de morango ao leite com geleia, cremosa e marcante.', price: 20, flavorType: 'strawberry', image: '/products/bottle-morango.png', category: 'Batidinhas Gourmet', theme: { bg: '#881337', text: '#ffffff', accent: '#fda4af' } },
  { id: 'bg-limao', slug: 'batidinha-limao-suico', name: 'Limão Suíço', desc: 'Batidinha gourmet de limão com leite condensado.', price: 20, flavorType: 'passion', image: '/products/bottle-maracuja.png', category: 'Batidinhas Gourmet' },
  { id: 'bg-maracuja-nutella', slug: 'batidinha-maracuja-nutella', name: 'Maracujá c/ Nutella', desc: 'Batidinha gourmet de maracujá suíço com uma dose generosa de Nutella.', price: 25, flavorType: 'passion', image: '/products/bottle-maracuja.png', category: 'Batidinhas Gourmet' },
  { id: 'bg-uva-nutella', slug: 'batidinha-uva-nutella', name: 'Uva c/ Nutella', desc: 'Incrível batidinha gourmet sabor uva perfeitamente harmonizada com Nutella.', price: 25, flavorType: 'acai', image: '/products/bottle-acai.png', category: 'Batidinhas Gourmet' },
];

export const getFeaturedProducts = () => menuProducts.filter(p => p.theme);

export const getMenuByCategory = () => {
  const categories = [
    { name: "Açaís", subtitle: "Açaí cremoso na garrafa de 500 ml." },
    { name: "Linha Nutella", subtitle: "Pra quem não abre mão de muita Nutella." },
    { name: "Batidinhas Gourmet", subtitle: "Frutas frescas batidas com muito sabor." }
  ];

  return categories.map(cat => ({
    category: cat.name,
    subtitle: cat.subtitle,
    items: menuProducts.filter(p => p.category === cat.name)
  }));
};
