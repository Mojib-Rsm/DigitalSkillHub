

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'TotthoAi - আপনার এআই টুলবক্স | AI Content & Image Generator',
  description:
    'TotthoAi is an innovative AI platform offering a suite of powerful tools for content generation, image creation, business solutions, and more. Save time and money by leveraging the best artificial intelligence website for your needs.',
  keywords: ['TotthoAi', 'AI tools', 'Bengali AI', 'Tottho', 'TotthoAI', 'AI website', 'AI platform', 'what is TotthoAI', 'TotthoAI features', 'TotthoAI benefits', 'AI solutions', 'artificial intelligence website', 'best AI websites', 'how to use TotthoAI', 'AI tools online', 'TotthoAI pricing', 'examples of AI websites', 'AI website for [specific task]', 'innovative AI website', 'তথ্য', 'এআই টুলস', 'কনটেন্ট জেনারেটর', 'বাংলা এআই'],
  manifest: '/manifest.json',
  verification: {
    google: 'UOjLl8nKnBXzX4B4Iexn70-dASolNycUEKKZ2o4fg0E',
  },
  authors: [{ name: "Mojib Rsm" }, { name: "Oftern" }, { name: "TotthoAI" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;700&family=Tiro+Bangla:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
