
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'TotthoAi - আপনার এআই টুলবক্স | AI Content & Image Generator',
  description:
    'আপনার উৎপাদনশীলতা এবং সৃজনশীলতা বাড়াতে বিভিন্ন ধরণের এআই টুল ব্যবহার করুন। লেখা, ছবি তৈরি, কোডিং এবং আরও অনেক কিছুর জন্য আমাদের টুলস আপনাকে সাহায্য করবে।',
  keywords: ['TotthoAi', 'AI tools', 'Bengali AI', 'content generation', 'AI website', 'image generator', 'video generator', 'free tools', 'তথ্য', 'এআই টুলস', 'কনটেন্ট জেনারেটর', 'বাংলা এআই'],
  manifest: '/manifest.json'
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
