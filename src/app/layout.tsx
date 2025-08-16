
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'ডিজিটাল স্কিল হাব - আপনার ডিজিটাল দক্ষতা বৃদ্ধি করুন',
  description:
    'ফ্রিল্যান্সিং এবং ই-কমার্সের জন্য সহজলভ্য ডিজিটাল দক্ষতা প্রশিক্ষণের মাধ্যমে নারী, যুবক এবং প্রতিবন্ধী ব্যক্তিদের ক্ষমতায়ন। আমাদের সাথে শিখুন, সরাসরি আপনার মোবাইল থেকে।',
  manifest: '/manifest.json'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;700&family=Tiro+Bangla:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
