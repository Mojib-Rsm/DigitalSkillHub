
import ImageGeneratorForm from "@/components/image-generator-form";
import { Image } from "lucide-react";

export default function ImageGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <Image className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">AI Image Generator</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Create logos, banners, or any image you can imagine with a simple text prompt.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <ImageGeneratorForm />
      </div>
    </div>
  );
}
