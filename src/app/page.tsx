
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Bot, PenSquare, ShoppingCart, Languages, Hash, Briefcase, Mail, Lightbulb, BarChart, FileText, GraduationCap, HelpCircle, BookCheck, Image as ImageIcon, DollarSign, Wand, FileSignature, Globe, Film, Mic, Code, Presentation, Palette, FileAnalytics, Gamepad, MessageSquare, UserCircle, CornerDownRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const featuredTools = [
    {
        title: "এআই ইমেজ জেনারেটর",
        description: "পাঠ্য থেকে লোগো, ব্যানার এবং অন্যান্য ছবি তৈরি করুন।",
        href: "/ai-tools/image-generator",
        icon: <ImageIcon className="w-10 h-10 text-primary" />,
        category: "Image Generation",
    },
    {
        title: "কভার লেটার জেনারেটর",
        description: "কয়েক সেকেন্ডের মধ্যে একটি পেশাদার কভার লেটার তৈরি করুন।",
        href: "/ai-tools/cover-letter-generator",
        icon: <FileSignature className="w-10 h-10 text-primary" />,
        category: "Content & Writing",
    },
    {
        title: "ফেসবুক কমেন্ট জেনারেটর",
        description: "যেকোনো ফেসবুক পোস্টের জন্য প্রাসঙ্গিক কমেন্ট এবং রিপ্লাই তৈরি করুন।",
        href: "/ai-tools/facebook-comment-generator",
        icon: <MessageSquare className="w-10 h-10 text-primary" />,
        category: "Content & Writing",
    },
     {
        title: "এআই ভিডিও জেনারেটর",
        description: "পাঠ্য প্রম্পট থেকে ছোট ভিডিও তৈরি করুন।",
        href: "/ai-tools/video-generator",
        icon: <Film className="w-10 h-10 text-primary" />,
        category: "Video & Animation",
    },
    {
        title: "ব্যবসার নাম জেনারেটর",
        description: "আপনার নতুন ব্যবসা বা ব্র্যান্ডের জন্য সেরা নামটি খুঁজুন।",
        href: "/ai-tools/business-name-generator",
        icon: <Lightbulb className="w-10 h-10 text-primary" />,
        category: "Productivity & Business",
    },
    {
        title: "পাসপোর্ট সাইজ ছবি মেকার",
        description: "যেকোনো ছবিকে একটি পেশাদার পাসপোর্ট ছবিতে রূপান্তর করুন।",
        href: "/ai-tools/passport-photo-maker",
        icon: <UserCircle className="w-10 h-10 text-primary" />,
        category: "Image Generation",
    },
];

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.828 14.04C34.524 10.372 29.626 8 24 8C12.955 8 4 16.955 4 28s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691L14.613 21.1c1.761-4.36 6.096-7.5 11.387-7.5c2.563 0 4.935.89 6.852 2.451L32.486 9.8C29.232 7.234 25.272 6 21 6C14.34 6 8.361 9.772 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-8.197-6.556C27.027 34.091 25.561 35 24 35c-4.781 0-8.84-2.733-10.74-6.556l-8.313 6.701C9.06 39.068 15.86 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l8.197 6.556C41.427 36.657 44 32.617 44 28c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);

const FacebookIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.323-1.325z"/>
    </svg>
);


export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
             <div className="inline-block bg-primary/10 p-4 rounded-full mb-6">
                <Bot className="w-16 h-16 text-primary" />
            </div>
            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight">
              আপনার সৃজনশীলতা এবং উৎপাদনশীলতা বাড়াতে <span className="text-primary">এআই টুলস</span>
            </h1>
            <p className="text-lg text-muted-foreground mt-6">
              লেখা, ছবি তৈরি, কোডিং এবং আরও অনেক কিছুর জন্য শক্তিশালী এআই টুলস ব্যবহার করে আপনার কাজকে সহজ করুন।
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="transition-transform transform hover:scale-105 text-lg">
                <Link href="/ai-tools">
                  সকল টুলস দেখুন <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Tools Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-4xl font-bold mb-4">জনপ্রিয় এআই টুলস</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
            আমাদের সবচেয়ে জনপ্রিয় টুলস দিয়ে আপনার কাজ শুরু করুন।
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTools.map((tool) => (
               <Link href={tool.href} key={tool.title} className="group">
                <Card className="text-center h-full p-8 shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
                    <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 p-4 rounded-full">
                        {tool.icon}
                    </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
                    <p className="text-muted-foreground">{tool.description}</p>
                    <div className="p-6 pt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowRight className="w-6 h-6 text-primary" />
                    </div>
                </Card>
              </Link>
            ))}
          </div>
          <Button asChild variant="link" size="lg" className="mt-12 text-lg">
            <Link href="/ai-tools">
              আরও টুলস দেখুন <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-4xl font-bold mb-4">আপনার যাত্রা শুরু করতে প্রস্তুত?</h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto mb-8">
                আমাদের কমিউনিটিতে যোগ দিন এবং আপনার সৃজনশীলতাকে পরবর্তী স্তরে নিয়ে যান।
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" variant="secondary" className="transition-transform transform hover:scale-105 w-full sm:w-auto">
                    <GoogleIcon />
                    গুগল দিয়ে সাইন আপ করুন
                </Button>
                <Button size="lg" variant="secondary" className="transition-transform transform hover:scale-105 w-full sm:w-auto bg-[#1877F2] hover:bg-[#166fe5]">
                    <FacebookIcon />
                    ফেসবুক দিয়ে সাইন আপ করুন
                </Button>
                 <Button size="lg" variant="secondary" className="transition-transform transform hover:scale-105 w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90">
                    ফোন দিয়ে সাইন আপ করুন
                </Button>
            </div>
        </div>
      </section>
    </div>
  );
}
