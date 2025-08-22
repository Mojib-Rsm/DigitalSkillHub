
import SeoScoreCheckerForm from "@/components/seo-score-checker-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { BarChart2 } from "lucide-react";
import { notFound } from "next/navigation";

export default async function SeoScoreCheckerPage() {
    const tool = await getToolByHref('/ai-tools/seo-score-checker');
    if (!tool) notFound();
    
    const relatedTools = await getRelatedTools(tool.category, tool.id);

    return (
        <ToolPageLayout
            title={tool.title}
            description={tool.description}
            icon={<BarChart2 className="w-12 h-12 text-primary" />}
            relatedTools={relatedTools}
            helperTool={{
                buttonText: "কীওয়ার্ড সাজেশন নিন",
                href: "/ai-tools/seo-keyword-suggester"
            }}
        >
            <div className="max-w-4xl mx-auto">
                <SeoScoreCheckerForm />
            </div>
        </ToolPageLayout>
    );
}
