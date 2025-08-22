
import OneClickWriterForm from "@/components/one-click-writer-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { Sparkles } from "lucide-react";

export default function OneClickWriterPage() {
  return (
    <ToolPageLayout
        title="One-Click Writer"
        description="Enter a title and get a full, SEO-optimized blog post with a featured image in seconds."
        icon={<Sparkles className="w-12 h-12 text-primary" />}
    >
        <div className="max-w-4xl mx-auto">
            <OneClickWriterForm />
        </div>
    </ToolPageLayout>
  );
}
