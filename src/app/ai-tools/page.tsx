
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Bot, PenSquare, ShoppingCart, Languages, Hash, Briefcase, Mail, Lightbulb, BarChart, FileText, GraduationCap, HelpCircle, BookCheck, Image as ImageIcon, DollarSign, Wand, FileSignature, Globe, Film, Mic, Code, Presentation, Palette, Gamepad, MessageSquare, UserCircle, CornerDownRight, Edit, MessageCircle as MessageCircleIcon, LayoutTemplate, Receipt, Clapperboard, Sparkles } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { getTools, Tool } from "@/services/tool-service";

const iconComponents: { [key: string]: React.ElementType } = {
    PenSquare, ShoppingCart, Languages, Hash, Briefcase, Mail, Lightbulb, BarChart, FileText, GraduationCap, HelpCircle, BookCheck, ImageIcon, DollarSign, Wand, FileSignature, Globe, Film, Mic, Code, Presentation, Palette, Gamepad, MessageSquare, UserCircle, CornerDownRight, Edit, MessageCircleIcon, LayoutTemplate, Receipt, Clapperboard, Sparkles
};


export default async function AiToolsPage() {
  const allTools = await getTools();
  const enabledTools = allTools.filter(tool => tool.enabled);
  const categories = ["All", ...new Set(enabledTools.map(tool => tool.category))];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <Bot className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">এআই টুলস</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          আপনার উৎপাদনশীলতা এবং সৃজনশীলতা বাড়াতে এআই-এর শক্তি ব্যবহার করুন।
        </p>
      </div>

      <Tabs defaultValue="All" className="w-full mb-8">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 max-w-5xl mx-auto h-auto">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="text-base py-2">
              {category === 'All' ? 'সকল টুল' : category.replace(/ & /g, ' ও ')}
            </TabsTrigger>
          ))}
        </TabsList>
         {categories.map((category) => (
            <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mt-8">
                    {(category === 'All' ? enabledTools : enabledTools.filter(tool => tool.category === category)).map((tool) => {
                        const Icon = iconComponents[tool.icon] || Bot;
                        return (
                            <Link href={tool.href} key={tool.id} className="group">
                                <Card  className="h-full flex flex-col justify-between shadow-md hover:shadow-xl hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                                    <CardHeader className="flex flex-row items-start gap-4">
                                        <div className="bg-primary/10 p-3 rounded-md">
                                            <Icon className="w-8 h-8 text-primary" />
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
                        )
                    })}
                </div>
            </TabsContent>
         ))}
      </Tabs>
    </div>
  );
}

    