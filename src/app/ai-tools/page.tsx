
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Bot, PenSquare, ShoppingCart, Languages, Hash, Briefcase, Mail, Lightbulb, BarChart, FileText, GraduationCap, HelpCircle, BookCheck, Image as ImageIcon, DollarSign, Wand, FileSignature, Globe, Film, Mic, Code, Presentation, Palette, FileAnalytics, Gamepad, MessageSquare, UserCircle, CornerDownRight, Edit, MessageCircle as MessageCircleIcon, LayoutTemplate, Receipt } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

const allTools = [
    {
        title: "ব্লগ টপিক জেনারেটর",
        description: "আপনার আগ্রহের উপর ভিত্তি করে সৃজনশীল ব্লগ পোস্টের ধারণা তৈরি করুন।",
        href: "/ai-tools/blog-topic-generator",
        icon: <PenSquare className="w-8 h-8 text-primary" />,
        category: "Content & Writing",
    },
    {
        title: "পণ্যের বিবরণ জেনারেটর",
        description: "আপনার ই-কমার্স পণ্যের জন্য আকর্ষণীয় বিবরণ তৈরি করুন।",
        href: "/ai-tools/product-description-generator",
        icon: <ShoppingCart className="w-8 h-8 text-primary" />,
        category: "Content & Writing",
    },
    {
        title: "সোশ্যাল মিডিয়া পোস্ট জেনারেটর",
        description: "ফেসবুক, ইনস্টাগ্রাম এবং আরও অনেক কিছুর জন্য আকর্ষণীয় পোস্ট তৈরি করুন।",
        href: "/ai-tools/social-media-post-generator",
        icon: <Hash className="w-8 h-8 text-primary" />,
        category: "Content & Writing",
    },
    {
        title: "ফেসবুক কমেন্ট জেনারেটর",
        description: "যেকোনো ফেসবুক পোস্টের জন্য প্রাসঙ্গিক কমেন্ট এবং রিপ্লাই তৈরি করুন।",
        href: "/ai-tools/facebook-comment-generator",
        icon: <MessageSquare className="w-8 h-8 text-primary" />,
        category: "Content & Writing",
    },
    {
        title: "ফেসবুক রিপ্লাই জেনারেটর",
        description: "একটি নির্দিষ্ট ফেসবুক কমেন্টের জন্য বুদ্ধিদীপ্ত উত্তর তৈরি করুন।",
        href: "/ai-tools/facebook-reply-generator",
        icon: <CornerDownRight className="w-8 h-8 text-primary" />,
        category: "Content & Writing",
    },
    {
        title: "মেসেঞ্জার রিপ্লাই জেনারেটর",
        description: "যেকোনো মেসেঞ্জার কথোপকথনের জন্য প্রাসঙ্গিক উত্তর তৈরি করুন।",
        href: "/ai-tools/messenger-reply-generator",
        icon: <MessageCircleIcon className="w-8 h-8 text-primary" />,
        category: "Content & Writing",
    },
    {
        title: "এআই ইমেজ জেনারেটর",
        description: "পাঠ্য থেকে লোগো, ব্যানার এবং অন্যান্য ছবি তৈরি করুন।",
        href: "/ai-tools/image-generator",
        icon: <ImageIcon className="w-8 h-8 text-primary" />,
        category: "Image Generation",
    },
    {
        title: "পাসপোর্ট সাইজ ছবি মেকার",
        description: "যেকোনো ছবিকে একটি পেশাদার পাসপোর্ট ছবিতে রূপান্তর করুন।",
        href: "/ai-tools/passport-photo-maker",
        icon: <UserCircle className="w-8 h-8 text-primary" />,
        category: "Image Generation",
    },
     {
        title: "হাতের লেখা এক্সট্র্যাক্টর",
        description: "হাতে লেখা নোট থেকে টেক্সট এক্সট্র্যাক্ট করে Word, Excel বা PDF এ রূপান্তর করুন।",
        href: "/ai-tools/handwriting-extractor",
        icon: <Edit className="w-8 h-8 text-primary" />,
        category: "Productivity & Business",
    },
    {
        title: "এআই ভিডিও জেনারেটর",
        description: "পাঠ্য প্রম্পট থেকে ছোট ভিডিও তৈরি করুন।",
        href: "/ai-tools/video-generator",
        icon: <Film className="w-8 h-8 text-primary" />,
        category: "Video & Animation",
    },
    {
        title: "পেশাদার ইমেল লেখক",
        description: "ক্লায়েন্ট এবং সহকর্মীদের জন্য পেশাদার ইমেল ড্রাফ্ট করুন।",
        href: "/ai-tools/professional-email-writer",
        icon: <Mail className="w-8 h-8 text-primary" />,
        category: "Productivity & Business",
    },
    {
        title: "নোট সারাংশকারী",
        description: "দীর্ঘ পাঠ্যকে সংক্ষিপ্ত নোটে পরিণত করুন।",
        href: "/ai-tools/note-summarizer",
        icon: <BookCheck className="w-8 h-8 text-primary" />,
        category: "Productivity & Business",
    },
     {
        title: "বাংলা কনটেন্ট অনুবাদক",
        description: "ইংরেজি এবং বাংলার মধ্যে পাঠ্য অনুবাদ করুন।",
        href: "/ai-tools/bengali-translator",
        icon: <Languages className="w-8 h-8 text-primary" />,
        category: "Productivity & Business",
    },
    {
        title: "কভার লেটার জেনারেটর",
        description: "কয়েক সেকেন্ডের মধ্যে একটি পেশাদার কভার লেটার তৈরি করুন।",
        href: "/ai-tools/cover-letter-generator",
        icon: <FileSignature className="w-8 h-8 text-primary" />,
        category: "Content & Writing",
    },
    {
        title: "রিফান্ড পলিসি জেনারেটর",
        description: "আপনার ব্যবসার জন্য একটি কাস্টম রিফান্ড পলিসি তৈরি করুন।",
        href: "/ai-tools/refund-policy-generator",
        icon: <Receipt className="w-8 h-8 text-primary" />,
        category: "Productivity & Business",
    },
    {
        title: "জীবনবৃত্তান্ত/সিভি সহায়ক",
        description: "একটি পেশাদার এবং কার্যকর জীবনবৃত্তান্ত লিখতে সহায়তা পান।",
        href: "/ai-tools/resume-helper",
        icon: <FileText className="w-8 h-8 text-primary" />,
        category: "Productivity & Business",
    },
    {
        title: "ব্যবসার নাম জেনারেটর",
        description: "আপনার নতুন ব্যবসা বা ব্র্যান্ডের জন্য সেরা নামটি খুঁজুন।",
        href: "/ai-tools/business-name-generator",
        icon: <Lightbulb className="w-8 h-8 text-primary" />,
        category: "Productivity & Business",
    },
    {
        title: "ওয়েবসাইট ব্লুপ্রিন্ট জেনারেটর",
        description: "আপনার ধারণার জন্য একটি পৃষ্ঠা এবং বৈশিষ্ট্যসহ একটি কাঠামো তৈরি করুন।",
        href: "/ai-tools/website-blueprint-generator",
        icon: <LayoutTemplate className="w-8 h-8 text-primary" />,
        category: "Productivity & Business",
    },
    {
        title: "এসইও কীওয়ার্ড সাজেশনকারী",
        description: "আপনার অনলাইন দৃশ্যমানতা উন্নত করতে কীওয়ার্ড আবিষ্কার করুন।",
        href: "/ai-tools/seo-keyword-suggester",
        icon: <BarChart className="w-8 h-8 text-primary" />,
        category: "SEO & Marketing",
    },
    {
        title: "ইন্টারভিউ প্রশ্ন অনুশীলন",
        description: "আপনার পরবর্তী চাকরির ইন্টারভিউর জন্য অনুশীলন প্রশ্ন তৈরি করুন।",
        href: "/ai-tools/interview-question-practice",
        icon: <Briefcase className="w-8 h-8 text-primary" />,
        category: "Productivity & Business",
    },
    {
        title: "ফ্রিল্যান্স আইডিয়া জেনারেটর",
        description: "আপনার দক্ষতার উপর ভিত্তি করে প্রকল্পের ধারণা পান।",
        href: "/ai-tools/freelance-idea-generator",
        icon: <Wand className="w-8 h-8 text-primary" />,
        category: "Productivity & Business",
    },
    {
        title: "মূল্য/রেট ক্যালকুলেটর",
        description: "আপনার ফ্রিল্যান্স পরিষেবার জন্য একটি ন্যায্য মূল্য গণনা করুন।",
        href: "/ai-tools/price-rate-calculator",
        icon: <DollarSign className="w-8 h-8 text-primary" />,
        category: "Productivity & Business",
    },
    {
        title: "ডোমেইন নেম সাজেশনকারী",
        description: "আপনার ব্যবসা বা ওয়েবসাইটের জন্য সেরা ডোমেইন নামটি খুঁজুন।",
        href: "/ai-tools/domain-name-suggester",
        icon: <Globe className="w-8 h-8 text-primary" />,
        category: "SEO & Marketing",
    },
    {
        title: "কোর্স রিকমেন্ডার",
        description: "আপনার আগ্রহের উপর ভিত্তি করে ব্যক্তিগতকৃত কোর্স সাজেশন পান।",
        href: "/ai-tools/course-recommender",
        icon: <GraduationCap className="w-8 h-8 text-primary" />,
        category: "Productivity & Business",
    },
    {
        title: "কুইজ জেনারেটর",
        description: "আপনার জ্ঞান পরীক্ষা করার জন্য যেকোনো পাঠ্য থেকে একটি কুইজ তৈরি করুন।",
        href: "/ai-tools/quiz-generator",
        icon: <HelpCircle className="w-8 h-8 text-primary" />,
        category: "Productivity & Business",
    },
];

const categories = [
    { id: "all", name: "সকল টুল" },
    { id: "Content & Writing", name: "কনটেন্ট ও লেখা" },
    { id: "Image Generation", name: "ছবি তৈরি" },
    { id: "Video & Animation", name: "ভিডিও ও অ্যানিমেশন" },
    { id: "SEO & Marketing", name: "এসইও ও মার্কেটিং" },
    { id: "Productivity & Business", name: "ব্যবসা ও প্রোডাক্টিভিটি" },
];

export default function AiToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredTools = selectedCategory === "all"
    ? allTools
    : allTools.filter(tool => tool.category === selectedCategory);

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

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full mb-8">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 max-w-5xl mx-auto h-auto">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-base py-2">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {filteredTools.map((tool) => (
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
