
import ProductDescriptionGeneratorForm from "@/components/product-description-generator-form";
import { ShoppingCart } from "lucide-react";

export default function ProductDescriptionGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <ShoppingCart className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">Product Description Generator</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Create persuasive and effective product descriptions for your online store in seconds.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <ProductDescriptionGeneratorForm />
      </div>
    </div>
  );
}
