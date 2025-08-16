
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Bot, PenSquare, ShoppingCart } from "lucide-react";
import Link from "next/link";

const aiTools = [
  {
    title: "Blog Topic Generator",
    description: "Generate creative blog post ideas based on your interests.",
    href: "/ai-tools/blog-topic-generator",
    icon: <PenSquare className="w-8 h-8 text-primary" />,
  },
  {
    title: "Product Description Generator",
    description: "Create compelling descriptions for your e-commerce products.",
    href: "/ai-tools/product-description-generator",
    icon: <ShoppingCart className="w-8 h-8 text-primary" />,
  },
];

export default function AiToolsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <Bot className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">AI Tools</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Leverage the power of AI to boost your productivity and creativity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {aiTools.map((tool) => (
            <Link href={tool.href} key={tool.title}>
                <Card  className="h-full flex flex-col justify-between shadow-md hover:shadow-xl hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-md">
                            {tool.icon}
                        </div>
                        <div>
                            <CardTitle>{tool.title}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{tool.description}</p>
                    </CardContent>
                    <div className="p-6 pt-0 flex justify-end">
                        <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                </Card>
            </Link>
        ))}
      </div>
    </div>
  );
}
