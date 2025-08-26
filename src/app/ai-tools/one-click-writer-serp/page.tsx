
import OneClickWriterSerpForm from "@/components/one-click-writer-serp-form";

export default async function SerpArticlePage() {
    return (
        <div className="bg-muted/40 p-4 md:p-6 min-h-[calc(100vh-80px)]">
             <OneClickWriterSerpForm />
        </div>
    );
}
