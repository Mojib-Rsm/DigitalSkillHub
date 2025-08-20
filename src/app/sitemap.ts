
import { MetadataRoute } from 'next';
import { allTools } from '@/app/ai-tools/all-tools-list'; // Assuming you have a list of tools

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://totthoai.com'; // Replace with your actual domain

  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/ai-tools',
    '/blog',
    '/careers',
    '/community',
    '/contact',
    '/courses',
    '/dashboard',
    '/dashboard/pricing',
    '/free-tools',
    '/free-trial',
    '/login',
    '/press-kit',
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

// Helper file to avoid circular dependency
// You need to create a file like `src/app/ai-tools/all-tools-list.ts`
/*
// src/app/ai-tools/all-tools-list.ts
export const allTools = [
    { href: "/ai-tools/blog-topic-generator" },
    { href: "/ai-tools/product-description-generator" },
    { href: "/ai-tools/social-media-post-generator" },
    { href: "/ai-tools/image-generator" },
    { href: "/ai-tools/passport-photo-maker" },
    { href: "/ai-tools/handwriting-extractor" },
    { href: "/ai-tools/video-generator" },
    { href: "/ai-tools/professional-email-writer" },
    { href: "/ai-tools/note-summarizer" },
    { href: "/ai-tools/bengali-translator" },
    { href: "/ai-tools/cover-letter-generator" },
    { href: "/ai-tools/refund-policy-generator" },
    { href: "/ai-tools/resume-helper" },
    { href: "/ai-tools/business-name-generator" },
    { href: "/ai-tools/website-blueprint-generator" },
    { href: "/ai-tools/seo-keyword-suggester" },
    { href: "/ai-tools/interview-question-practice" },
    { href: "/ai-tools/freelance-idea-generator" },
    { href: "/ai-tools/price-rate-calculator" },
    { href: "/ai-tools/domain-name-suggester" },
    { href: "/ai-tools/course-recommender" },
    { href: "/ai-tools/quiz-generator" },
];
*/
