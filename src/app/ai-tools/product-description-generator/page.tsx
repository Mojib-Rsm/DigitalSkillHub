
import ProductDescriptionGeneratorForm from "@/components/product-description-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { ShoppingCart } from "lucide-react";

export default function ProductDescriptionGeneratorPage() {
  return (
    <ToolPageLayout
        title="পণ্যের বিবরণ জেনারেটর"
        description="আপনার অনলাইন স্টোরের জন্য সেকেন্ডের মধ্যে प्रेरक এবং কার্যকর পণ্যের বিবরণ তৈরি করুন।"
        icon={<ShoppingCart className="w-12 h-12 text-primary" />}
    >
      <ProductDescriptionGeneratorForm />
    </ToolPageLayout>
  );
}
