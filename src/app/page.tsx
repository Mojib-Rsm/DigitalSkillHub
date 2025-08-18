
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Bot, PenSquare, ShoppingCart, Languages, Hash, Briefcase, Mail, Lightbulb, BarChart, FileText, GraduationCap, HelpCircle, BookCheck, Image as ImageIcon, DollarSign, Wand, FileSignature, Globe, Film, Mic, Code, Presentation, Palette, FileAnalytics, Gamepad, MessageSquare, UserCircle, CornerDownRight, Clock, TrendingUp, Award, CheckCircle, Youtube, Star, Layers, RefreshCcw, TowerControl, Sparkles as SparklesIcon, Zap, Check, PlayCircle, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function Home() {
  return (
    <div className="flex flex-col bg-background">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-4">
                <Badge variant="secondary" className="text-sm py-1 px-3 border-2 border-primary/50 text-primary animate-pulse">
                    <SparklesIcon className="w-4 h-4 mr-2"/>
                    Launch Special: 25% OFF with LAUNCH25
                </Badge>
            </div>
            <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto">
              Join 3,000+ Content Creators Who've Transformed Their Workflow
            </h1>
            <p className="text-lg text-muted-foreground mt-6 max-w-3xl mx-auto">
              Stop spending hours on content creation. With TotaPakhi AI 2.0, generate professional content in 150+ languages in minutes, not days. Start FREE with 4 complete articles!
            </p>

            {/* Key Metrics */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
                <div className="text-center">
                    <p className="text-4xl font-bold text-primary">600,000+</p>
                    <p className="text-muted-foreground">Articles Generated</p>
                </div>
                <div className="text-center">
                    <p className="text-4xl font-bold text-primary">90%</p>
                    <p className="text-muted-foreground">Time Saved</p>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center text-4xl font-bold text-primary">
                        4.8/5 <Star className="w-8 h-8 ml-2 text-yellow-400 fill-yellow-400" />
                    </div>
                    <p className="text-muted-foreground">User Rating</p>
                </div>
            </div>

             <div className="mt-10 max-w-2xl mx-auto grid grid-cols-2 gap-4 text-left text-muted-foreground">
                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary"/> Generate 10+ articles per day</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary"/> SEO-optimized content automatically</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary"/> AI images included with every article</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary"/> Bulk generation for scaling</div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="transition-transform transform hover:scale-105 w-full sm:w-auto text-base">
                    <Zap className="mr-2 h-5 w-5"/>
                    Write 4 Articles FREE - No Credit Card
                </Button>
                <Button size="lg" variant="outline" className="transition-transform transform hover:scale-105 w-full sm:w-auto text-base">
                    View Pricing (25% OFF)
                </Button>
            </div>
             <Button asChild size="lg" variant="link" className="mt-4 text-base">
                <Link href="#">
                    <PlayCircle className="mr-2 h-5 w-5"/>
                    Watch 2-Minute Demo
                </Link>
             </Button>
             
             <div className="mt-8 text-center text-sm text-muted-foreground space-y-2">
                <p>✅ Free trial: 4 complete articles with AI images • No setup fees • Cancel anytime</p>
                <p className="text-primary font-bold">🔥 Limited time: Get 25% OFF with code LAUNCH25 when you upgrade</p>
             </div>
             <div className="mt-4 flex justify-center items-center">
                <div className="flex -space-x-2">
                    <Avatar className="border-2 border-background">
                        <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person face" />
                        <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                     <Avatar className="border-2 border-background">
                        <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person face" />
                        <AvatarFallback>B</AvatarFallback>
                    </Avatar>
                     <Avatar className="border-2 border-background">
                        <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person face" />
                        <AvatarFallback>C</AvatarFallback>
                    </Avatar>
                </div>
                <p className="ml-4 text-muted-foreground">Join 200+ users who signed up this week</p>
             </div>
        </div>
      </section>

      {/* Other sections can be added back here if needed */}
    </div>
  );
}
