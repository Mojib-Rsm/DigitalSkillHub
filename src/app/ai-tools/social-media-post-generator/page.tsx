
import SocialMediaPostGeneratorForm from "@/components/social-media-post-generator-form";
import { Hash } from "lucide-react";

export default function SocialMediaPostGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <Hash className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">Social Media Post Generator</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Create engaging posts for your social media channels in seconds.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <SocialMediaPostGeneratorForm />
      </div>
    </div>
  );
}
