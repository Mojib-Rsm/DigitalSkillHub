
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Bot, PenSquare, ShoppingCart, Languages, Hash, Briefcase, Mail, Lightbulb, BarChart, FileText, GraduationCap, HelpCircle, BookCheck, Image as ImageIcon, DollarSign, Wand, FileSignature, Globe, Film, Mic, Code, Presentation, Palette, FileAnalytics, Gamepad, MessageSquare, UserCircle, CornerDownRight, Clock, TrendingUp, Award, CheckCircle, Youtube, Star, Layers, RefreshCcw, TowerControl, Sparkles as SparklesIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


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

const generatedImages = [
    { src: "https://placehold.co/600x400.png", alt: "AI-Generated Islamic Image Sample 1", hint: "islamic art" },
    { src: "https://placehold.co/600x400.png", alt: "AI-Generated Islamic Image Sample 2", hint: "mosque" },
    { src: "https://placehold.co/600x400.png", alt: "AI-Generated Islamic Image Sample 3", hint: "quran" },
    { src: "https://placehold.co/600x400.png", alt: "AI-Generated Islamic Image Sample 4", hint: "prayer mat" },
    { src: "https://placehold.co/600x400.png", alt: "AI-Generated Islamic Image Sample 5", hint: "crescent moon" },
    { src: "https://placehold.co/600x400.png", alt: "AI-Generated Islamic Image Sample 6", hint: "lantern" },
];

const successStories = [
    {
        feature: "Bulk Generation 2.0",
        icon: <Layers className="w-6 h-6 text-primary"/>,
        quote: "TotaPakhi AI 2.0's bulk generation feature is incredible! I created 50 blog posts in one afternoon using the new CSV upload. The AI images are so contextual that my engagement increased by 300%. This is the future of content creation.",
        metric: "300% engagement boost",
        name: "Tanvir Ahmed",
        title: "Content Creator & Blogger",
        avatarHint: "male blogger portrait"
    },
    {
        feature: "Content Refresh Tool",
        icon: <RefreshCcw className="w-6 h-6 text-primary"/>,
        quote: "The Content Refresh tool saved my business! I had 200+ old articles that needed updating. TotaPakhi AI 2.0 refreshed them all with current information and better SEO in just 2 hours. My organic traffic doubled in 3 weeks.",
        metric: "2x organic traffic",
        name: "Sharmin Akter",
        title: "Education Platform Owner",
        avatarHint: "female education professional"
    },
    {
        feature: "Authority Builder",
        icon: <TowerControl className="w-6 h-6 text-primary"/>,
        quote: "The Topical Authority Builder is a game-changer! It created a complete content cluster around 'digital marketing in Bangladesh' with 25 interconnected articles. We now rank #1 for multiple keywords and our domain authority increased by 15 points.",
        metric: "15 point DA increase",
        name: "Fahim Rahman",
        title: "News Website Owner",
        avatarHint: "male news editor"
    },
    {
        feature: "One-Click Writer 2.0",
        icon: <SparklesIcon className="w-6 h-6 text-primary"/>,
        quote: "One-Click Writer 2.0 is pure magic! My team generates client content 10x faster now. The custom prompts feature ensures every piece matches our clients' brand voice perfectly. We've scaled from 5 to 50 clients without hiring more writers.",
        metric: "10x faster content",
        name: "Nusrat Jahan",
        title: "Digital Marketing Agency",
        avatarHint: "female marketing professional"
    }
]


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

      {/* Revolutionary Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-4xl font-bold mb-4">Revolutionary Features That Transform Content Creation</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-12">
            Experience the next generation of AI-powered content creation with features designed to save time, boost quality, and scale your content strategy like never before.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center p-8 shadow-md">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Clock className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">90% Time Savings</h3>
              <p className="text-muted-foreground">Automate repetitive tasks and generate content in seconds, not hours.</p>
            </Card>
            <Card className="text-center p-8 shadow-md">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <TrendingUp className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Better SEO Results</h3>
              <p className="text-muted-foreground">Create optimized content that ranks higher in search engines.</p>
            </Card>
            <Card className="text-center p-8 shadow-md">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Award className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Professional Quality</h3>
              <p className="text-muted-foreground">Produce high-quality, polished content that engages your audience.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Tools in Action */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="font-headline text-4xl font-bold mb-4">Featured Tools in Action</h2>
            <p className="text-muted-foreground mb-16">
              Powerful Tools That Transform Your Workflow. See how our flagship features can revolutionize your content creation process with real examples and live demonstrations.
            </p>
          </div>

          <div className="space-y-24">
            {/* One Click Writer */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="secondary" className="py-1 px-3 text-sm">Most Popular</Badge>
                <h3 className="font-headline text-3xl font-bold">One Click Writer 2.0 ✨</h3>
                <p className="text-muted-foreground">
                  Generate high-quality, SEO-optimized articles with a single click. Our AI handles everything from research to formatting, while you maintain complete control over customization options.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-accent"/> Complete articles in under 60 seconds</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-accent"/> Advanced customization with custom prompts</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-accent"/> Multi-language support (Bengali + English)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-accent"/> Built-in SEO optimization and AI images</li>
                </ul>
                <div className="flex gap-8 pt-4">
                  <div className="text-center">
                    <p className="font-headline text-4xl font-bold">60s</p>
                    <p className="text-muted-foreground text-sm">Average generation time</p>
                  </div>
                   <div className="text-center">
                    <p className="font-headline text-4xl font-bold">95%</p>
                    <p className="text-muted-foreground text-sm">User satisfaction rate</p>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button size="lg">Try One Click Writer</Button>
                  <Button size="lg" variant="outline">See Live Demo</Button>
                </div>
              </div>
              <div>
                <Card className="shadow-2xl">
                   <Image src="https://placehold.co/600x400.png" width={600} height={400} alt="One Click Writer Interface" className="rounded-lg" data-ai-hint="writing interface application" />
                </Card>
              </div>
            </div>

            {/* Video to Blog Post */}
             <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-last md:order-first">
                 <Card className="shadow-2xl">
                   <Image src="https://placehold.co/600x400.png" width={600} height={400} alt="Video to Blog Post Interface" className="rounded-lg" data-ai-hint="video editing interface" />
                </Card>
              </div>
              <div className="space-y-6">
                <Badge variant="secondary" className="py-1 px-3 text-sm">Trending Feature</Badge>
                <h3 className="font-headline text-3xl font-bold">Video to Blog Post 📹</h3>
                <p className="text-muted-foreground">
                  Transform YouTube videos into comprehensive blog posts with AI. Extract key insights, create engaging content, and maintain the original video's value while making it accessible in written form.
                </p>
                 <ul className="space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-accent"/> Convert any YouTube video to blog post</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-accent"/> Automatic key insights extraction</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-accent"/> Enhanced with AI-generated images</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-accent"/> Perfect for content repurposing</li>
                </ul>
                <div className="flex gap-8 pt-4">
                  <div className="text-center">
                    <p className="font-headline text-4xl font-bold">60 Sec</p>
                    <p className="text-muted-foreground text-sm">Video to article time</p>
                  </div>
                   <div className="text-center">
                    <p className="font-headline text-4xl font-bold">3x</p>
                    <p className="text-muted-foreground text-sm">Content reach increase</p>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button size="lg">Try Video to Blog</Button>
                  <Button size="lg" variant="outline">See Live Demo</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-4xl font-bold mb-4">Ready to Experience These Powerful Tools?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Join thousands of content creators who are already using these features to transform their workflow and scale their content production.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="transition-transform transform hover:scale-105 w-full sm:w-auto">
                    Start Free Trial - Access All Tools
                </Button>
                <Button size="lg" variant="outline" className="transition-transform transform hover:scale-105 w-full sm:w-auto">
                    View Pricing Plans
                </Button>
            </div>
        </div>
      </section>

       {/* AI-Generated Visuals Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-4xl font-bold mb-4">AI-Generated Visuals</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-12">
            Enhance Your Content with AI-Generated Images. Our AI can create stunning visuals to complement your blog posts, making your content more engaging and professional.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {generatedImages.map((image, index) => (
                <div key={index} className="relative aspect-square group overflow-hidden rounded-lg">
                    <Image
                        src={image.src}
                        alt={image.alt}
                        width={600}
                        height={600}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        data-ai-hint={image.hint}
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-center font-bold p-4">AI-Generated<br/>{image.alt}</p>
                    </div>
                </div>
            ))}
          </div>
           <p className="text-muted-foreground max-w-3xl mx-auto mt-12">
            These images are entirely generated by AI and can be seamlessly integrated into your blog posts, social media content, and marketing materials to enhance visual appeal and engagement.
          </p>
        </div>
      </section>
      
      {/* Success Stories Section */}
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="font-headline text-4xl font-bold mb-4">Success Stories with TotaPakhi AI 2.0</h2>
                    <p className="text-muted-foreground">Real Results from Real Users. See how content creators, marketers, and businesses are achieving extraordinary results with our new 2.0 features.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-12 items-center">
                    <div className="space-y-4 text-center lg:text-left">
                        <Badge variant="outline">Average 90% time savings</Badge>
                        <Badge variant="outline" className="ml-2">300% faster content creation</Badge>
                        <Badge variant="outline" className="ml-2">2x better SEO results</Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {successStories.map((story, index) => (
                        <Card key={index} className="flex flex-col justify-between shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-primary/10 p-2 rounded-md">
                                        {story.icon}
                                    </div>
                                    <CardTitle className="text-lg font-semibold">{story.feature}</CardTitle>
                                </div>
                                <p className="text-muted-foreground italic">"{story.quote}"</p>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-center py-2 px-4 rounded-full bg-accent/20 text-accent-foreground mx-auto">
                                    <Star className="w-5 h-5 mr-2 text-accent" />
                                    <span className="font-bold">{story.metric}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex items-center gap-4 bg-muted/50 p-4">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={`https://placehold.co/100x100.png`} data-ai-hint={story.avatarHint} />
                                    <AvatarFallback>{story.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-foreground">{story.name}</p>
                                    <p className="text-sm text-muted-foreground">{story.title}</p>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <Button size="lg" className="transition-transform transform hover:scale-105">
                        Start Your Success Story <ArrowRight className="ml-2 h-5 w-5"/>
                    </Button>
                </div>
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
