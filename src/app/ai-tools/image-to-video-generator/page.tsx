
"use client";

import dynamic from 'next/dynamic';
import { Clapperboard } from "lucide-react";

// Dynamically import the form component and disable server-side rendering
const ImageToVideoGeneratorForm = dynamic(() => import('@/components/image-to-video-generator-form'), { ssr: false });

export default function ImageToVideoGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <Clapperboard className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">ইমেজ টু ভিডিও জেনারেটর</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          একটি ছবি আপলোড করুন এবং প্রম্পট দিন, এআই আপনার জন্য ভিডিও তৈরি করবে।
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <ImageToVideoGeneratorForm />
      </div>
    </div>
  );
}
