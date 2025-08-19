
import { getLegalContent } from "@/lib/legal-content";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";

export function generateStaticParams() {
    return [
        { slug: 'privacy-policy' },
        { slug: 'terms-of-service' },
        { slug: 'refund-policy' },
        { slug: 'cookie-policy' },
    ];
}

export default function LegalPage({ params }: { params: { slug: string } }) {
    const content = getLegalContent(params.slug);

    if (!content) {
        notFound();
    }

    return (
        <div className="bg-background text-foreground">
            <section className="py-16 md:py-24 bg-muted/50">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                        <FileText className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto">
                        {content.title}
                    </h1>
                    <p className="text-lg text-muted-foreground mt-6 max-w-3xl mx-auto">
                        Last Updated: {content.lastUpdated}
                    </p>
                </div>
            </section>

            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div 
                        className="prose dark:prose-invert max-w-4xl mx-auto"
                        dangerouslySetInnerHTML={{ __html: content.htmlContent }}
                    />
                </div>
            </section>
        </div>
    );
}

