import { MetadataRoute } from 'next';
import { menuProducts } from '@/data/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const products: MetadataRoute.Sitemap = menuProducts.map((p) => ({
    url: "https://skullshakes.com.br/cardapio/" + p.slug,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: 'https://skullshakes.com.br',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...products,
  ];
}
