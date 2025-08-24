
import { MetadataRoute } from 'next';
import { allTools } from '@/app/ai-tools/all-tools-list'; 

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://totthoai.mojib.me';

  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/ai-tools',
    '/contact',
    '/courses',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic AI tool routes
  const aiToolRoutes = allTools.map((tool) => ({
    url: `${baseUrl}${tool.href}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as 'weekly',
    priority: 0.7,
  }));
  
  // Dynamic Legal routes
  const legalRoutes = [
      'privacy-policy',
      'terms-of-service',
      'refund-policy',
      'cookie-policy',
  ].map(slug => ({
      url: `${baseUrl}/legal/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as 'monthly',
      priority: 0.5,
  }))

  return [
      ...staticRoutes, 
      ...aiToolRoutes,
      ...legalRoutes
    ];
}

