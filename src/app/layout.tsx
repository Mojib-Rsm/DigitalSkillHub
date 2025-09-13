
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Script from 'next/script';
import { Hind_Siliguri, Tiro_Bangla } from 'next/font/google';
import { cn } from '@/lib/utils';

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali'],
  weight: ['400', '700'],
  variable: '--font-body',
});

const tiroBangla = Tiro_Bangla({
  subsets: ['bengali'],
  weight: ['400'],
  variable: '--font-headline',
});


export const metadata: Metadata = {
  metadataBase: new URL('https://totthoai.mojib.me'),
  title: {
    default: 'TotthoAi - Your AI Toolbox | AI Content & Image Generator',
    template: '%s | TotthoAi',
  },
  description:
    'TotthoAi is an innovative AI platform offering a suite of powerful tools for content generation, image creation, business solutions, and more. Save time and money by leveraging the best artificial intelligence website for your needs.',
  keywords: [
    'Tottho',
    'TotthoAi',
    'Tottho AI',
    'তথ্য',
    'তথ্য এআই',
    'AI tool',
    'AI tools',
    'AI content generator',
    'AI writer',
    'AI image generator',
    'AI video generator',
    'Bangla AI',
    'Bengali AI tool',
    'Mojib Rsm',
    'Oftern',
    'Made in Cox\'s Bazar',
    'Digital Skill Hub',
    'AI article writer',
    'AI blog writer',
    'Facebook post generator',
    'Content creation tool',
    'SEO tool',
    'Business name generator',
  ],
  manifest: '/manifest.json',
  verification: {
    google: 'UOjLl8nKnBXzX4B4Iexn70-dASolNycUEKKZ2o4fg0E',
  },
  authors: [{ name: "Mojib Rsm" }, { name: "Oftern" }, { name: "TotthoAI" }],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
      </head>
      <body className={cn("font-body antialiased", hindSiliguri.variable, tiroBangla.variable)}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
            </div>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
