import type { MetadataRoute } from 'next';
import { site } from '@/lib/config/site';
import { getAllCelebrities } from '@/lib/celebrities/source';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/+$/, '');
  const routes = [
    '',
    '/search',
    '/graveyard',
    '/living',
    '/resurrected',
    '/leaderboard',
    '/celebrities',
    '/how-it-works',
    '/token',
    '/disclaimer',
    '/privacy',
    '/terms',
  ];

  const staticRoutes: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.7,
  }));

  // Every parody profile is a real, indexable page.
  const celebrityRoutes: MetadataRoute.Sitemap = getAllCelebrities().map(
    (celebrity) => ({
      url: `${base}/celebrities/${celebrity.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }),
  );

  return [...staticRoutes, ...celebrityRoutes];
}
