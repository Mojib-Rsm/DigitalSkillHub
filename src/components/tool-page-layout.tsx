

"use client";

import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight, Bot, Sparkles, Quote, Star, Heart, PenSquare, ShoppingCart, Languages, Hash, Briefcase, Mail, Lightbulb, BarChart, FileText, GraduationCap, HelpCircle, BookCheck, Image as ImageIcon, DollarSign, Wand, FileSignature, Globe, Film, MessageSquare, UserCircle as UserCircleIcon, Edit, Clapperboard, Receipt, LayoutTemplate, Megaphone, Youtube, GitBranchPlus, Mic, List, PanelTopOpen, CalendarDays, BarChart2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import type { Tool } from "@/lib/demo-data";
import React, { useEffect, useState } from "react";
import { getCurrentUser, updateUserProfile } from "@/services/user-service";

const iconComponents: { [key: string]: React.ElementType } = {
    PenSquare,
    ShoppingCart,
    Languages,
    Hash,
    Briefcase,
    Mail,
    Lightbulb,
    BarChart,
    FileText,
    GraduationCap,
    HelpCircle,
    BookCheck,
    ImageIcon,
    DollarSign,
    Wand,
    FileSignature,
    Globe,
    Film,
    MessageSquare,
    UserCircleIcon,
    Edit,
    Clapperboard,
    Receipt,
    LayoutTemplate,
    Sparkles,
    Megaphone,
    Youtube,
    GitBranchPlus,
    Mic,
    List,
    PanelTopOpen,
    CalendarDays,
    BarChart2,
    Quote,
};

type HelperTool = {
    buttonText: string;
    href: string;
}

export default function ToolPageLayout({
    children,
    title,
    description,
    icon,
    relatedTools,
    helperTool,
}: {
    children: React.ReactNode;
    title: string;
    description: string;
    icon: React.ReactNode;
    relatedTools: Tool[];
    helperTool?: HelperTool;
}) {
  const pathname = usePathname();
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // This is a simplified client-side check. 
  // In a real app, this state should be synced with the database.
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setIsBookmarked(bookmarks.includes(pathname));
  }, [pathname]);

  const handleBookmark = () => {
      const newBookmarkState = !isBookmarked;
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      if (newBookmarkState) {
          bookmarks.push(pathname);
      } else {
          const index = bookmarks.indexOf(pathname);
          if (index > -1) {
              bookmarks.splice(index, 1);
          }
      }
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      setIsBookmarked(newBookmarkState);
  }

  return (
    <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
            <Button variant="outline" asChild>
                <Link href="/ai-tools">
                    <ArrowLeft className="mr-2" />
                    সকল টুল দেখুন
                </Link>
            </Button>
             <Button variant="ghost" size="icon" onClick={handleBookmark}>
                <Heart className={isBookmarked ? "text-red-500 fill-current" : ""}/>
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
            {helperTool && (
                <div className="mt-6">
                    <Button asChild>
                        <Link href={helperTool.href}>
                           <Sparkles className="mr-2 h-4 w-4" />
                           {helperTool.buttonText}
                        </Link>
                    </Button>
                </div>
            )}
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
