
import OneClickWriterSerpForm from "@/components/one-click-writer-serp-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { Search } from "lucide-react";
import { notFound } from "next/navigation";

export default async function SerpArticlePage() {
    const tool = await getToolByHref('/ai-tools/one-click-writer-serp');
    if (!tool) notFound();
    
    const relatedTools = await getRelatedTools(tool.category, tool.id);

    return (
        <ToolPageLayout
            title={tool.title}
            description={tool.description}
            icon={<Search className="w-12 h-12 text-primary" />}
            relatedTools={relatedTools}
            helperTool={{
                buttonText: "বিষয়বস্তু আইডিয়া নিন",
                href: "/ai-tools/blog-topic-generator"
            }}
        >
            <div className="max-w-4xl mx-auto">
                <OneClickWriterSerpForm />
            </div>
        </ToolPageLayout>
    );
}
