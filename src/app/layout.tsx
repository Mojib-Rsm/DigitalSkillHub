
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://totthoai.mojib.me'),
  title: {
    default: 'TotthoAi - Your AI Toolbox | AI Content & Image Generator',
    template: '%s | TotthoAi',
  },
  description:
    'TotthoAi is an innovative AI platform offering a suite of powerful tools for content generation, image creation, business solutions, and more. Save time and money by leveraging the best artificial intelligence website for your needs.',
  keywords: [
    'TotthoAI',
    'Tottho AI',
    'Mojib Rsm',
    'Artificial intelligence',
    'AI',
    'TotthoAI platform',
    'Mojib Rsm AI',
    'What is TotthoAI?',
    'Artificial intelligence solutions',
    'AI applications',
    'TotthoAI use cases',
    'Mojib Rsm contributions to AI',
    'AI technology',
    'Tottho AI services',
    'Learn about TotthoAI',
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
