import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { menuProducts } from '@/data/products';
import Image from 'next/image';
import Link from 'next/link';

interface ProductPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return menuProducts.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = menuProducts.find((p) => p.slug === params.slug);
  
  if (!product) {
    return { title: 'Produto não encontrado' };
  }

  return {
    title: product.name,
    description: product.desc,
    alternates: {
      canonical: `https://skullshakes.com.br/cardapio/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | Skull Shakes`,
      description: product.desc,
      url: `https://skullshakes.com.br/cardapio/${product.slug}`,
      images: [
        {
          url: product.image,
          width: 800,
          height: 800,
          alt: product.name,
        }
      ],
    }
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = menuProducts.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: `https://skullshakes.com.br${product.image}`,
    description: product.desc,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      url: `https://skullshakes.com.br/cardapio/${product.slug}`,
    },
    brand: {
      '@type': 'Restaurant',
      name: 'Skull Shakes',
      image: 'https://skullshakes.com.br/logo.jpg',
      
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Anápolis',
        addressRegion: 'GO',
        addressCountry: 'BR'
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-[#111] rounded-3xl p-8 flex items-center justify-center border border-white/5">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            className="object-contain hover:scale-105 transition-transform duration-500"
            priority
          />
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <Link href="/" className="text-white/50 hover:text-white transition-colors text-sm font-medium w-fit">
            &larr; Voltar pro Cardápio
          </Link>
          
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold tracking-wider">
                {product.category.toUpperCase()}
              </span>
            </div>
            <h1 className="font-anton text-5xl md:text-6xl uppercase tracking-wide leading-none">
              {product.name}
            </h1>
          </div>

          <p className="text-xl text-white/70 leading-relaxed font-light">
            {product.desc}
          </p>

          <div className="text-4xl font-anton text-purple-400">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </div>

          <Link 
            href="/"
            className="w-full bg-white text-black text-center font-bold py-4 rounded-xl hover:bg-white/90 transition-colors uppercase tracking-widest text-sm"
          >
            Fazer meu Pedido
          </Link>
        </div>
      </div>
    </div>
  );
}
