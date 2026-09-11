import type { MetadataRoute } from 'next';
import { site } from '@/lib/config/site';

export default function robots(): MetadataRoute.Robots {
  const base = site.url.replace(/\/+$/, '');
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Personal and internal pages stay out of search results.
        disallow: ['/admin', '/my-grave', '/api/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
