"use client";

import PassportPhotoMakerForm from "@/components/passport-photo-maker-form";
import { UserCircle } from "lucide-react";

export default function PassportPhotoMakerPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <UserCircle className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">পাসপোর্ট সাইজ ছবি মেকার</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          আপনার ছবি আপলোড করুন এবং একটি পেশাদার পাসপোর্ট সাইজ ছবি তৈরি করুন।
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <PassportPhotoMakerForm />
      </div>
    </div>
  );
}
