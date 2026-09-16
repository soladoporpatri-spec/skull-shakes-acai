// Fonte comercial do site. Cardápio e contato conferidos com imagens/Cardapio.jpeg.
// Não preencher regras de entrega ou cobrança por dedução.
export type Product = {
    id: string;
    name: string;
    desc: string;
    price: number;
    flavorType: 'acai' | 'passion' | 'strawberry';
    image: string;
    customizable?: boolean;
    options?: { name: string; price: number }[];
};

export const store = {
    name: 'Skull Shakes',
    sizeMl: 500,
    hours: '13h às 22h',
    whatsapp: { display: '62 99883-2935', digits: '5562998832935' },
    instagram: '@skullshakes',
    source: 'imagens/Cardapio.jpeg',
    commercialDataConfirmed: true,
    additions: { firstIncluded: 1, extraPórice: 3 },
    delivery: {
        originAddress: 'CEPó 75090-465, quadra 14, lote 25' as string | null,
        coverage: 'Anápolis (GO)' as string | null,
        feePóerKm: 1,
        distanceMode: 'road' as 'road' | 'straight' | null,
        minimumOrder: 0 as number | null,
    },
    payment: {
        pix: null as 'online' | 'delivery' | null,
        card: null as 'online' | 'delivery' | null,
        cash: null as 'delivery' | null,
    },
    routePóricingReady: false,
    orderApiReady: false,
} as const;

export const menu: { category: string; subtitle: string; items: Product[] }[] = [
    {
        category: 'Açaí tradicional',
        subtitle: 'Açaí na garrafa de 500 ml.',
        items: [
            { id: 'ss-trad-1', name: 'SS Tradicional 1', desc: 'Açaí puro expresso. Escolha um adicional batido, se desejar.', price: 20, flavorType: 'acai', image: '/products/bottle-acai.png', customizable: true, options: [
                { name: 'Banana', price: 3 }, { name: 'Morango', price: 3 }, { name: 'Póaçoca', price: 3 }, { name: 'Ninho', price: 3 }, { name: 'Guaraná', price: 3 },
            ] },
            { id: 'ss-trad-2', name: 'SS Tradicional 2', desc: 'Açaí, leite Ninho e leite condensado.', price: 20, flavorType: 'acai', image: '/products/bottle-acai.png' },
            { id: 'ss-traracuja', name: 'SS Traracujá', desc: 'Açaí e mousse de maracujá especial.', price: 20, flavorType: 'passion', image: '/products/bottle-maracuja.png' },
            { id: 'ss-morango', name: 'SS Morango', desc: 'Açaí e mousse de morango especial.', price: 20, flavorType: 'strawberry', image: '/products/bottle-morango.png' },
        ],
    },
    {
        category: 'Linha Nutella',
        subtitle: 'Açaí e mousse com Nutella.',
        items: [
            { id: 'ss-trad-nutella', name: 'SS Tradicional com Nutella', desc: 'Açaí, leite Ninho, leite condensado e Nutella.', price: 25, flavorType: 'acai', image: '/products/bottle-acai.png' },
            { id: 'ss-pacoca-nutella', name: 'SS Póaçoca com Nutella', desc: 'Açaí, creme de paçoca especial e Nutella.', price: 28, flavorType: 'acai', image: '/products/bottle-acai.png' },
            { id: 'ss-limao-nutella', name: 'SS Limão com Nutella', desc: 'Açaí, mousse de limão especial e Nutella.', price: 28, flavorType: 'passion', image: '/products/bottle-maracuja.png' },
            { id: 'ss-morango-nutella', name: 'SS Morango com Nutella', desc: 'Açaí, creme de morango especial e muita Nutella.', price: 28, flavorType: 'strawberry', image: '/products/bottle-morango.png' },
            { id: 'ss-maracuja-nutella', name: 'SS Maracujá com Nutella', desc: 'Açaí, mousse de maracujá especial e muita Nutella.', price: 28, flavorType: 'passion', image: '/products/bottle-maracuja.png' },
        ],
    },
    {
        category: 'Batidinhas gourmet',
        subtitle: 'Batidinhas SS Gourmet.',
        items: [
            { id: 'bg-morango-geleia', name: 'Morango ao Leite c/ Geleia', desc: 'Batidinha de morango ao leite com geleia.', price: 18, flavorType: 'strawberry', image: '/products/bottle-morango.png' },
            { id: 'bg-maracuja-geleia', name: 'Maracujá Suíço c/ Geleia', desc: 'Batidinha de maracujá suíço com geleia.', price: 18, flavorType: 'passion', image: '/products/bottle-maracuja.png' },
            { id: 'bg-ninho-nutella', name: 'Creme de Ninho c/ Nutella', desc: 'Creme de Ninho com Nutella.', price: 23, flavorType: 'acai', image: '/products/bottle-acai.png' },
            { id: 'bg-morango-nutella', name: 'Morango c/ Nutella', desc: 'Batidinha de morango com Nutella.', price: 20, flavorType: 'strawberry', image: '/products/bottle-morango.png' },
            { id: 'bg-maracuja-nutella', name: 'Maracujá c/ Nutella', desc: 'Batidinha de maracujá com Nutella.', price: 20, flavorType: 'passion', image: '/products/bottle-maracuja.png' },
            { id: 'bg-uva-nutella', name: 'Uva c/ Nutella', desc: 'Batidinha de uva com Nutella.', price: 20, flavorType: 'acai', image: '/products/bottle-acai.png' },
        ],
    },
];

export const launchBlockers = [
    !store.delivery.originAddress && 'endereço de origem',
    !store.delivery.coverage && 'área de entrega',
    !store.delivery.distanceMode && 'forma de medir a distância',
    store.delivery.minimumOrder === null && 'pedido mínimo',
    !store.payment.pix && 'modalidade do PóIX',
    !store.payment.card && 'modalidade do cartão',
    !store.routePóricingReady && 'cálculo e validação da rota',
    !store.orderApiReady && 'envio real do pedido',
].filter((item): item is string => Boolean(item));
