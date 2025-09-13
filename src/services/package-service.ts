
'use server';

import {
  ShoppingCart,
  PenSquare,
  Megaphone,
  GraduationCap,
  Newspaper,
  Briefcase,
  LucideIcon,
} from 'lucide-react';
import { getToolByTitle, Tool } from './tool-service';

export type Package = {
  slug: string;
  title: string;
  icon: LucideIcon;
  description: string;
  tools: string[];
  useCase: string;
};

export type PackageWithTools = Omit<Package, 'tools'> & {
  tools: Tool[];
};

const packages: Package[] = [
  {
    slug: 'business-dukandar-package',
    title: 'Business / Dukandar Package',
    icon: ShoppingCart,
    description: 'আপনার দোকানের日常প্রয়োজনীয় কনটেন্ট ও মার্কেটিং ম্যাটেরিয়াল তৈরি করুন দ্রুত এবং সহজে।',
    tools: [
      'Product Description Generator',
      // "Poster & Banner Generator", // This tool does not exist yet
      'Social Media Post Generator',
      'Messenger Reply Generator', // Represents "WhatsApp/FB Auto Reply Template"
      // "Invoice & Bill Content Generator", // This tool does not exist yet
    ],
    useCase: 'দোকানদাররা দ্রুত প্রফেশনাল কনটেন্ট বানাতে পারবে, অফার/ডিসকাউন্ট দিতে পারবে, পোস্টার/ক্যাপশন বানাতে পারবে।',
  },
  {
    slug: 'content-creator-blogger-package',
    title: 'Content Creator / Blogger Package',
    icon: PenSquare,
    description: 'আপনার ব্লগ, ইউটিউব চ্যানেল বা সোশ্যাল মিডিয়ার জন্য SEO-অপ্টিমাইজড কনটেন্ট তৈরি করুন ১০ গুণ দ্রুত।',
    tools: [
      'AI Article Writer', // Represents "SEO Blog Writer"
      'Script Writer', // Represents "YouTube Script Generator"
      // "Thumbnail Text & Idea Generator", // This tool does not exist yet
      'SEO Keyword Suggester', // Represents "Keyword Research Helper"
      'Bengali Translator',
    ],
    useCase: 'ব্লগার, ইউটিউবার, ইনফ্লুয়েন্সাররা ১০গুন দ্রুত কনটেন্ট তৈরি করতে পারবে।',
  },
  {
    slug: 'digital-marketer-package',
    title: 'Digital Marketer Package',
    icon: Megaphone,
    description: 'আপনার বিজ্ঞাপন, ইমেল এবং ল্যান্ডিং পেজের জন্য হাই-কনভার্টিং কপি তৈরি করে সেলস বাড়ান।',
    tools: [
      'Ad Copy Generator', // Represents "FB/Instagram Ads Copy Generator"
      'Professional Email Writer', // Represents "Email Marketing Copy"
      'Headline Generator', // Represents "Landing Page Headline Maker"
      // "A/B Testing Content Generator", // This tool does not exist yet
      'SEO Keyword Suggester', // Represents "Hashtag Generator"
    ],
    useCase: 'যারা ব্যবসা বা ব্র্যান্ড প্রোমোট করে তাদের জন্য।',
  },
  {
    slug: 'student-academic-package',
    title: 'Student & Academic Package',
    icon: GraduationCap,
    description: 'আপনার অ্যাসাইনমেন্ট, প্রেজেন্টেশন এবং গ্রামার সংক্রান্ত সমস্যা সমাধান করুন এক নিমিষে।',
    tools: [
      // "Essay & Assignment Writer", // This tool does not exist yet
      'Note Summarizer', // Represents "বাংলা → ইংরেজি Summary Maker"
      // "Grammar & Spelling Fixer", // This tool does not exist yet
      'Quiz Generator', // Represents "Question → Answer Explainer"
      // "Presentation Slide Content Generator", // This tool does not exist yet
    ],
    useCase: 'যারা পড়াশোনায় সাহায্য চাইবে তাদের জন্য।',
  },
  {
    slug: 'news-media-package',
    title: 'News & Media Package',
    icon: Newspaper,
    description: 'সংবাদ শিরোনাম, প্রেস রিলিজ এবং ব্রেকিং নিউজ দ্রুত তৈরি করুন।',
    tools: [
      'Headline Generator',
      // "Press Release Drafting Tool", // This tool does not exist yet
      'AI Article Writer', // Represents "Fact-to-Article Expander"
      'Social Media Post Generator', // Represents "Social Media News Caption Writer"
      // "Breaking News Quick Template", // This tool does not exist yet
    ],
    useCase: 'সংবাদ মাধ্যম এবং সাংবাদিকদের জন্য দ্রুত ও নির্ভুল কনটেন্ট তৈরি করা।',
  },
  {
    slug: 'computer-shop-package',
    title: 'Computer Shop / Printing Shop Package',
    icon: Briefcase,
    description: 'আপনার দোকানের গ্রাহকদের জন্য আবেদনপত্র, সিভি, স্ট্যাম্প এবং অন্যান্য ডকুমেন্ট দ্রুত তৈরি করুন।',
    tools: [
      'Cover Letter Generator', // Represents Application & Letter Generator
      'Resume Helper',
      'Digital Stamp Maker',
      // "Contract/Agreement Writer", // This tool does not exist yet
      'Handwriting Extractor',
      'Passport Photo Maker',
      // "ID Card / Visiting Card Text Layout Generator", // This tool does not exist yet
      // "Notice & Office Memo Generator", // This tool does not exist yet
    ],
    useCase: 'যারা কম্পিউটার দোকান চালায়, typing + print service দেয়, stamp/affidavit বানায় — তারা দ্রুত কাস্টমারদের জন্য কনটেন্ট বানাতে পারবে।',
  },
];

export async function getPackages(): Promise<Package[]> {
  return packages;
}

export async function getPackageBySlug(
  slug: string
): Promise<PackageWithTools | null> {
  const pkg = packages.find((p) => p.slug === slug);
  if (!pkg) {
    return null;
  }

  // Fetch full tool details for the tools in the package
  const toolPromises = pkg.tools.map((toolTitle) => getToolByTitle(toolTitle));
  const resolvedTools = (await Promise.all(toolPromises)).filter(
    (t): t is Tool => t !== null
  );

  return {
    ...pkg,
    tools: resolvedTools,
  };
}

// Helper function in tool-service to get a tool by its title
export async function getToolByTitle(title: string): Promise<Tool | null> {
    const allTools = (await import('./tool-service')).getTools();
    return (await allTools).find(tool => tool.title === title) || null;
}
