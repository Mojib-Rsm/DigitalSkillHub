

"use client";

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Bot, PenSquare, ShoppingCart, Languages, Hash, Briefcase, Mail, Lightbulb, BarChart, FileText, GraduationCap, HelpCircle, BookCheck, Image as ImageIcon, DollarSign, Wand, FileSignature, Globe, Film, Mic, Code, Presentation, Palette, Gamepad, MessageSquare, User as UserCircle, CornerDownRight, Edit, MessageCircleIcon, LayoutTemplate, Receipt, Clapperboard, Sparkles, Youtube, Megaphone, GitBranchPlus, List, PanelTopOpen, CalendarDays, BarChart2, Search, Loader, Star, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { getTools, Tool } from "@/services/tool-service";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import T from '@/components/t';

const iconComponents: { [key: string]: React.ElementType } = {
    PenSquare, ShoppingCart, Languages, Hash, Briefcase, Mail, Lightbulb, BarChart, FileText, GraduationCap, HelpCircle, BookCheck, ImageIcon, DollarSign, Wand, FileSignature, Globe, Film, Mic, Code, Presentation, Palette, Gamepad, MessageSquare, UserCircle, CornerDownRight, Edit, MessageCircleIcon, LayoutTemplate, Receipt, Clapperboard, Sparkles, Youtube, Megaphone, GitBranchPlus, List, PanelTopOpen, CalendarDays, BarChart2, Bot, Search
};

const featuredTools = [
  {
    title: "One-Click Article Writer",
    description: "Generate a full blog post from a single title. SEO-optimized and ready to publish.",
    href: "/ai-tools/one-click-writer",
    icon: Sparkles,
  },
  {
    title: "Facebook Comment Generator",
    description: "Instantly create relevant comments and replies for any Facebook post or image.",
    href: "/ai-tools/facebook-comment-generator",
    icon: MessageSquare,
  },
  {
    title: "AI Image Generator",
    description: "Turn your text descriptions into stunning, high-quality images for any purpose.",
    href: "/ai-tools/image-generator",
    icon: ImageIcon,
  },
   {
    title: "Handwriting Extractor",
    description: "Convert handwritten notes from images into editable text, tables, or documents.",
    href: "/ai-tools/handwriting-extractor",
    icon: Edit,
  },
];

async function aiSearch(query: string, allTools: Tool[]): Promise<Tool[]> {
    if (!query) return allTools.filter(t => t.enabled);

    const lowerCaseQuery = query.toLowerCase();
    
    const filtered = allTools.filter(tool =>
        tool.enabled && (
            tool.title.toLowerCase().includes(lowerCaseQuery) ||
            tool.description.toLowerCase().includes(lowerCaseQuery) ||
            tool.category.toLowerCase().includes(lowerCaseQuery)
        )
    );
    return filtered;
}


export default function AiToolsPage() {
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, startSearchTransition] = useTransition();

  useEffect(() => {
    async function loadTools() {
      setLoading(true);
      const tools = await getTools();
      setAllTools(tools);
      setFilteredTools(tools.filter(t => t.enabled));
      setLoading(false);
    }
    loadTools();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    startSearchTransition(async () => {
        const results = await aiSearch(query, allTools);
        setFilteredTools(results);
    });
  }

  const categories = ["All", ...new Set(allTools.filter(t => t.enabled).map(tool => tool.category))];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <Bot className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold"><T>AI Tools</T></h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          <T>Boost your productivity and creativity with the power of AI.</T>
        </p>
      </div>

       <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                placeholder="Search for a tool (e.g., 'Facebook post creator')" 
                className="pl-12 h-14 text-lg w-full rounded-full shadow-lg"
                value={searchQuery}
                onChange={handleSearch}
            />
             {isSearching && <Loader className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin"/>}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2"><T>Find the tool you need in an instant with our smart search.</T></p>
      </div>
      
       <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 font-headline flex items-center justify-center gap-3"><Star className="text-primary"/><T>Featured Tools</T></h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTools.map((tool) => {
                 const Icon = tool.icon;
                 return (
                     <Link href={tool.href} key={tool.title} className="group">
                        <Card className="h-full flex flex-col justify-between shadow-lg hover:shadow-2xl hover:border-primary transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded-md">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-lg"><T>{tool.title}</T></CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground"><T>{tool.description}</T></p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <div className="text-sm text-primary font-semibold flex items-center gap-1">
                                    <T>Use Now</T> <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                                </div>
                            </CardFooter>
                        </Card>
                    </Link>
                )
            })}
        </div>
      </div>

        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 mb-16">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                <div>
                    <CardTitle className="text-2xl font-bold"><T>Can't find your favorite tool?</T></CardTitle>
                    <p className="text-muted-foreground mt-1"><T>Let us know what you need, and we'll try to build it.</T></p>
                </div>
                <Button size="lg" asChild>
                    <Link href="/request-a-tool"><PlusCircle className="mr-2 h-5 w-5" /> <T>Request a Tool</T></Link>
                </Button>
            </CardContent>
        </Card>

      {searchQuery ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mt-8">
            {filteredTools.map((tool) => {
                const Icon = iconComponents[tool.icon] || Bot;
                return (
                    <Link href={tool.href} key={tool.id} className="group">
                        <Card  className="h-full flex flex-col justify-between shadow-md hover:shadow-xl hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                            <CardHeader className="flex flex-row items-start gap-4">
                                <div className="bg-primary/10 p-3 rounded-md">
                                    <Icon className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <CardTitle><T>{tool.title}</T></CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground"><T>{tool.description}</T></p>
                            </CardContent>
                            <CardFooter className="p-6 pt-0 flex justify-end">
                                <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                            </CardFooter>
                        </Card>
                    </Link>
                )
            })}
        </div>
      ) : (
        <Tabs defaultValue="All" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 max-w-5xl mx-auto h-auto">
            {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="text-base py-2">
                <T>{category}</T>
                </TabsTrigger>
            ))}
            </TabsList>
            {loading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mt-8">
                    {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64"/>)}
                 </div>
            ) : categories.map((category) => (
                <TabsContent key={category} value={category}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mt-8">
                        {(category === 'All' ? allTools.filter(t => t.enabled) : allTools.filter(tool => tool.category === category && tool.enabled)).map((tool) => {
                            const Icon = iconComponents[tool.icon] || Bot;
                            return (
                                <Link href={tool.href} key={tool.id} className="group">
                                    <Card  className="h-full flex flex-col justify-between shadow-md hover:shadow-xl hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                                        <CardHeader className="flex flex-row items-start gap-4">
                                            <div className="bg-primary/10 p-3 rounded-md">
                                                <Icon className="w-8 h-8 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle><T>{tool.title}</T></CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground"><T>{tool.description}</T></p>
                                        </CardContent>
                                        <CardFooter className="p-6 pt-0 flex justify-end">
                                            <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </CardFooter>
                                    </Card>
                                </Link>
                            )
                        })}
                    </div>
                </TabsContent>
            ))}
        </Tabs>
      )}
    </div>
  );
}

  


