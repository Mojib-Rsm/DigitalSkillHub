
import AiArticleWriterForm from "@/components/ai-article-writer-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { Search } from "lucide-react";
import { notFound } from "next/navigation";

export default async function AiArticleWriterPage() {
    const tool = await getToolByHref('/ai-tools/ai-article-writer');
    if (!tool) notFound();
    
    const relatedTools = await getRelatedTools(tool.category, tool.id);

    return (
        <ToolPageLayout
            title={tool.title}
            description={tool.description}
            icon={<Search className="w-12 h-12 text-primary" />}
            relatedTools={relatedTools}
        >
            <div className="max-w-4xl mx-auto">
                <AiArticleWriterForm />
            </div>
        </ToolPageLayout>
    );
}
