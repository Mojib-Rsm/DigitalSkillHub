"use client";

import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight, Bot } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import type { Tool } from "@/services/tool-service";
import React from "react";

const iconComponents: { [key: string]: React.ElementType } = {
    PenSquare: require("lucide-react").PenSquare,
    ShoppingCart: require("lucide-react").ShoppingCart,
    Languages: require("lucide-react").Languages,
    Hash: require("lucide-react").Hash,
    Briefcase: require("lucide-react").Briefcase,
    Mail: require("lucide-react").Mail,
    Lightbulb: require("lucide-react").Lightbulb,
    BarChart: require("lucide-react").BarChart,
    FileText: require("lucide-react").FileText,
    GraduationCap: require("lucide-react").GraduationCap,
    HelpCircle: require("lucide-react").HelpCircle,
    BookCheck: require("lucide-react").BookCheck,
    ImageIcon: require("lucide-react").Image,
    DollarSign: require("lucide-react").DollarSign,
    Wand: require("lucide-react").Wand,
    FileSignature: require("lucide-react").FileSignature,
    Globe: require("lucide-react").Globe,
    Film: require("lucide-react").Film,
    MessageSquare: require("lucide-react").MessageSquare,
    UserCircleIcon: require("lucide-react").UserCircle,
    Edit: require("lucide-react").Edit,
    Clapperboard: require("lucide-react").Clapperboard,
    Receipt: require("lucide-react").Receipt,
    LayoutTemplate: require("lucide-react").LayoutTemplate,
    Sparkles: require("lucide-react").Sparkles,
};


export default function ToolPageLayout({
    children,
    title,
    description,
    icon,
    relatedTools,
}: {
    children: React.ReactNode;
    title: string;
    description: string;
    icon: React.ReactNode;
    relatedTools: Tool[];
}) {
  return (
    <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
            <Button variant="outline" asChild>
                <Link href="/ai-tools">
                    <ArrowLeft className="mr-2" />
                    সকল টুল দেখুন
                </Link>
            </Button>
        </div>
        <div className="text-center mb-12">
            <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                {icon}
            </div>
            <h1 className="font-headline text-5xl font-bold">{title}</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            {description}
            </p>
        </div>

        <div className="max-w-2xl mx-auto">
            {children}
        </div>

        {relatedTools.length > 0 && (
            <div className="mt-24">
                <Separator />
                <div className="text-center my-12">
                    <h2 className="font-headline text-4xl font-bold">সম্পর্কিত টুলস</h2>
                    <p className="text-muted-foreground mt-2">এই টুলগুলো আপনার কাজে লাগতে পারে</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                     {relatedTools.map((tool) => {
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
            </div>
        )}

    </div>
  );
}