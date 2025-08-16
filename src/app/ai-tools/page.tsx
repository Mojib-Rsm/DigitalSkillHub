
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Bot, PenSquare, ShoppingCart, Translate, Hash, Briefcase, Mail, Lightbulb, Mic, Eye, Camera, BarChart, FileText } from "lucide-react";
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
  {
    title: "Bengali Content Translator",
    description: "Translate text between English and Bengali.",
    href: "#",
    icon: <Translate className="w-8 h-8 text-primary" />,
  },
  {
    title: "Social Media Post Generator",
    description: "Create engaging posts for Facebook, Instagram, and more.",
    href: "#",
    icon: <Hash className="w-8 h-8 text-primary" />,
  },
  {
    title: "Resume/CV Helper",
    description: "Get help writing a professional and effective resume.",
    href: "#",
    icon: <FileText className="w-8 h-8 text-primary" />,
  },
  {
    title: "Professional Email Writer",
    description: "Draft professional emails for clients and colleagues.",
    href: "#",
    icon: <Mail className="w-8 h-8 text-primary" />,
  },
  {
    title: "Business Name Generator",
    description: "Find the perfect name for your new business or brand.",
    href: "#",
    icon: <Lightbulb className="w-8 h-8 text-primary" />,
  },
  {
    title: "SEO Keyword Suggester",
    description: "Discover keywords to improve your online visibility.",
    href: "#",
    icon: <BarChart className="w-8 h-8 text-primary" />,
  },
  {
    title: "Image Caption Generator",
    description: "Generate creative and descriptive captions for your images.",
    href: "#",
    icon: <Camera className="w-8 h-8 text-primary" />,
  },
  {
    title: "Proofreader & Grammar Checker",
    description: "Check your Bengali or English text for errors.",
    href: "#",
    icon: <Eye className="w-8 h-8 text-primary" />,
  },
  {
    title: "Video Script Outliner",
    description: "Create structured outlines for your video content.",
    href: "#",
    icon: <Mic className="w-8 h-8 text-primary" />,
  },
  {
    title: "Interview Question Practice",
    description: "Generate practice questions for your next job interview.",
    href: "#",
    icon: <Briefcase className="w-8 h-8 text-primary" />,
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {aiTools.map((tool) => (
            <Link href={tool.href} key={tool.title} className="group">
                <Card  className="h-full flex flex-col justify-between shadow-md hover:shadow-xl hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-start gap-4">
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
