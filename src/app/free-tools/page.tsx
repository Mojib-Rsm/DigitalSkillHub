
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileText, GanttChartSquare, ShieldCheck, Tag, ThumbsUp, Sparkles, CheckCircle } from "lucide-react";
import Link from "next/link";
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const allTools = [
  {
    title: "Privacy Policy Generator",
    category: "Legal",
    description: "Create GDPR-compliant privacy policies for your website in minutes. Customize for your business needs and download instantly.",
    tags: ["GDPR", "Privacy", "Legal", "Compliance"],
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    status: "Popular",
    href: "/free-tools/privacy-policy-generator",
  },
  {
    title: "Terms of Service Generator",
    category: "Legal",
    description: "Generate comprehensive terms of service for your website or app. Include user responsibilities, prohibited uses, and legal protections.",
    tags: ["Terms", "Legal", "User Agreement", "TOS"],
    icon: <FileText className="w-8 h-8 text-primary" />,
    status: "New",
    href: "/free-tools/terms-of-service-generator",
  },
  {
    title: "Disclaimer Generator",
    category: "Legal",
    description: "Create professional disclaimers to protect your business. Industry-specific templates for liability limitation and legal protection.",
    tags: ["Disclaimer", "Legal", "Liability", "Protection"],
    icon: <GanttChartSquare className="w-8 h-8 text-primary" />,
    status: "New",
    href: "/free-tools/disclaimer-generator",
  },
];

const categories = ["All", "Legal", "SEO", "Content", "Analytics", "Marketing"];

const comingSoonTools = [
    { title: "Meta Tag Generator", description: "Generate SEO-optimized meta tags for better search rankings"},
    { title: "Hashtag Generator", description: "Find relevant hashtags for your social media posts"},
    { title: "Cookie Policy Generator", description: "Create GDPR-compliant cookie policies for your website"},
]

export default function FreeToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTools = selectedCategory === "All"
    ? allTools
    : allTools.filter(tool => tool.category === selectedCategory);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto">
            Powerful Free Tools
          </h1>
          <p className="text-lg text-muted-foreground mt-6 max-w-3xl mx-auto">
            Powerful, free tools to help you build and grow your online presence. No registration required, just click and start using.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-muted-foreground font-semibold"><ThumbsUp className="w-5 h-5 text-primary"/> 3 Tools Available</div>
            <div className="flex items-center justify-center gap-2 text-muted-foreground font-semibold"><Sparkles className="w-5 h-5 text-primary"/> 100% Free</div>
            <div className="flex items-center justify-center gap-2 text-muted-foreground font-semibold"><FileText className="w-5 h-5 text-primary"/> No Registration Required</div>
          </div>
        </div>
      </section>

      {/* Tools Listing Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-12">
             <div className="flex flex-wrap gap-2 rounded-lg bg-muted p-2">
                {categories.map(category => (
                    <Button 
                        key={category} 
                        variant={selectedCategory === category ? 'default' : 'ghost'}
                        onClick={() => setSelectedCategory(category)}
                        className="rounded-md"
                    >
                        {category}
                    </Button>
                ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTools.map((tool) => (
              <Card key={tool.title} className="flex flex-col shadow-md hover:shadow-xl hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-md mt-1">
                      {tool.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle>{tool.title}</CardTitle>
                      {tool.status && <Badge variant={tool.status === "Popular" ? "default" : "secondary"}>{tool.status}</Badge>}
                    </div>
                    <CardDescription className="mt-1">{tool.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={tool.href}>Use Tool <ArrowRight className="ml-2 w-4 h-4"/></Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* More Tools Coming Soon */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">More Tools Coming Soon!</h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
                We're constantly working on new free tools to help you succeed online. Here's what's coming next:
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {comingSoonTools.map(tool => (
                    <Card key={tool.title} className="text-center bg-background/50">
                        <CardHeader>
                            <CardTitle>{tool.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{tool.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                  <div>
                      <CardTitle className="text-3xl font-bold">Need More Advanced Features?</CardTitle>
                      <p className="text-muted-foreground mt-2 max-w-2xl">Join TotthoAi for advanced content generation, SEO tools, and more powerful features to grow your online presence.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                      <Button size="lg" className="text-base" asChild><Link href="/#pricing">Get Started Free</Link></Button>
                      <Button size="lg" variant="outline" className="text-base" asChild><Link href="/#pricing">View Pricing</Link></Button>
                  </div>
              </CardContent>
          </Card>
        </div>
      </section>

    </div>
  );
}
