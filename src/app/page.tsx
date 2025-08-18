
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Bot, PenSquare, ShoppingCart, Languages, Hash, Briefcase, Mail, Lightbulb, BarChart, FileText, GraduationCap, HelpCircle, BookCheck, Image as ImageIcon, DollarSign, Wand, FileSignature, Globe, Film, Mic, Code, Presentation, Palette, FileAnalytics, Gamepad, MessageSquare, UserCircle, CornerDownRight, Clock, TrendingUp, Award, CheckCircle, Youtube, Star, Layers, RefreshCcw, TowerControl, Sparkles as SparklesIcon, Zap, Check, PlayCircle, Users, ThumbsUp, ShieldCheck, GanttChartSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";


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

      {/* Revolutionary Features Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Revolutionary Features That Transform Content Creation</h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            Experience the next generation of AI-powered content creation with features designed to save time, boost quality, and scale your content strategy like never before.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center shadow-lg">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                  <Clock className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="mt-4 text-2xl font-bold">90% Time Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Automate tedious tasks and generate high-quality content in seconds, not hours.</p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                  <TrendingUp className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="mt-4 text-2xl font-bold">Better SEO Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Create content that is optimized for search engines to rank higher and drive more traffic.</p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                  <Award className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="mt-4 text-2xl font-bold">Professional Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Generate well-structured, coherent, and engaging articles that rival human writers.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Tools in Action Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Powerful Tools That Transform Your Workflow</h2>
            <p className="text-lg text-muted-foreground mt-4">
              See how our flagship features can revolutionize your content creation process with real examples and live demonstrations.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* One Click Writer */}
            <div className="space-y-4">
              <Badge>Most Popular</Badge>
              <h3 className="text-3xl font-bold flex items-center gap-2">One Click Writer 2.0 <SparklesIcon className="w-6 h-6 text-yellow-400" /></h3>
              <p className="text-muted-foreground">Generate high-quality, SEO-optimized articles with a single click. Our AI handles everything from research to formatting, while you maintain complete control over customization options.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Complete articles in under 60 seconds</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Advanced customization with custom prompts</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Multi-language support (Bengali + English)</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Built-in SEO optimization and AI images</li>
              </ul>
              <div className="flex gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold">60s</p>
                  <p className="text-muted-foreground">Average generation time</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">95%</p>
                  <p className="text-muted-foreground">User satisfaction rate</p>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button>Try One Click Writer</Button>
                <Button variant="outline">See Live Demo</Button>
              </div>
            </div>
            <div>
              <Image src="https://placehold.co/600x400.png" alt="One Click Writer Interface" width={600} height={400} className="rounded-lg shadow-2xl" data-ai-hint="writer interface" />
            </div>
          </div>
          
          <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
             {/* Video to Blog Post */}
            <div className="lg:order-2 space-y-4">
              <Badge>Trending Feature</Badge>
              <h3 className="text-3xl font-bold flex items-center gap-2">Video to Blog Post <Youtube className="w-6 h-6 text-red-600" /></h3>
              <p className="text-muted-foreground">Transform YouTube videos into comprehensive blog posts with AI. Extract key insights, create engaging content, and maintain the original video's value while making it accessible in written form.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Convert any YouTube video to blog post</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Automatic key insights extraction</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Enhanced with AI-generated images</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Perfect for content repurposing</li>
              </ul>
               <div className="flex gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold">60 Sec</p>
                  <p className="text-muted-foreground">Video to article time</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">3x</p>
                  <p className="text-muted-foreground">Content reach increase</p>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button>Try Video to Blog</Button>
                <Button variant="outline">See Live Demo</Button>
              </div>
            </div>
            <div className="lg:order-1">
              <Image src="https://placehold.co/600x400.png" alt="Video to Blog Post Interface" width={600} height={400} className="rounded-lg shadow-2xl" data-ai-hint="video interface" />
            </div>
          </div>
        </div>
      </section>

       {/* Free Tools Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Free Tools to Boost Your Workflow</h2>
            <p className="text-lg text-muted-foreground mt-4">
              Explore our collection of free, high-quality tools designed to help you with common tasks—no registration required.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="flex flex-col text-center items-center p-6 shadow-lg">
                <div className="bg-primary/10 p-4 rounded-full w-fit mb-4">
                    <ShieldCheck className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">Privacy Policy Generator</CardTitle>
                <p className="text-muted-foreground mt-2 flex-grow">Create GDPR-compliant privacy policies for your website in minutes.</p>
                <Button variant="outline" asChild className="mt-4 w-full">
                    <Link href="/free-tools">Use Tool</Link>
                </Button>
            </Card>
            <Card className="flex flex-col text-center items-center p-6 shadow-lg">
                <div className="bg-primary/10 p-4 rounded-full w-fit mb-4">
                    <FileText className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">Terms of Service Generator</CardTitle>
                <p className="text-muted-foreground mt-2 flex-grow">Generate comprehensive terms of service for your website or app.</p>
                <Button variant="outline" asChild className="mt-4 w-full">
                    <Link href="/free-tools">Use Tool</Link>
                </Button>
            </Card>
            <Card className="flex flex-col text-center items-center p-6 shadow-lg">
                <div className="bg-primary/10 p-4 rounded-full w-fit mb-4">
                    <GanttChartSquare className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">Disclaimer Generator</CardTitle>
                <p className="text-muted-foreground mt-2 flex-grow">Create professional disclaimers to protect your business.</p>
                <Button variant="outline" asChild className="mt-4 w-full">
                    <Link href="/free-tools">Use Tool</Link>
                </Button>
            </Card>
          </div>
           <div className="text-center mt-12">
                <Button asChild size="lg">
                    <Link href="/free-tools">Explore All Free Tools <ArrowRight className="ml-2 w-5 h-5"/></Link>
                </Button>
            </div>
        </div>
      </section>

      {/* AI-Generated Visuals Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Enhance Your Content with AI-Generated Images</h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            Our AI can create stunning visuals to complement your blog posts, making your content more engaging and professional.
          </p>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden group relative">
                <Image src="https://placehold.co/300x400.png" alt="AI Generated Islamic Art" width={300} height={400} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300" data-ai-hint="islamic art" />
                <div className="absolute inset-0 bg-black/50 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm font-semibold">AI-Generated</p>
                </div>
              </Card>
            ))}
          </div>
          <p className="text-muted-foreground mt-8 max-w-3xl mx-auto">
            These images are entirely generated by AI and can be seamlessly integrated into your blog posts, social media content, and marketing materials to enhance visual appeal and engagement.
          </p>
        </div>
      </section>
      
      {/* Success Stories Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Success Stories with TotaPakhi AI 2.0</h2>
            <p className="text-lg text-muted-foreground mt-4">
              Real Results from Real Users. See how content creators, marketers, and businesses are achieving extraordinary results with our new 2.0 features.
            </p>
             <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <p className="font-semibold text-lg">Avg. 90% time savings</p>
                <p className="font-semibold text-lg">300% faster creation</p>
                <p className="font-semibold text-lg">2x better SEO results</p>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl">Bulk Generation 2.0</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm italic">"TotaPakhi AI 2.0's bulk generation feature is incredible! I created 50 blog posts in one afternoon using the new CSV upload. The AI images are so contextual that my engagement increased by 300%. This is the future of content creation."</p>
                    <p className="mt-4 font-bold text-primary">300% engagement boost</p>
                </CardContent>
                <CardFooter className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="man portrait"/>
                        <AvatarFallback>TA</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">Tanvir Ahmed</p>
                        <p className="text-xs text-muted-foreground">Content Creator & Blogger</p>
                    </div>
                </CardFooter>
            </Card>
             <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl">Content Refresh Tool</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm italic">"The Content Refresh tool saved my business! I had 200+ old articles that needed updating. TotaPakhi AI 2.0 refreshed them all with current information and better SEO in just 2 hours. My organic traffic doubled in 3 weeks."</p>
                    <p className="mt-4 font-bold text-primary">2x organic traffic</p>
                </CardContent>
                <CardFooter className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="woman portrait"/>
                        <AvatarFallback>SA</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">Sharmin Akter</p>
                        <p className="text-xs text-muted-foreground">Education Platform Owner</p>
                    </div>
                </CardFooter>
            </Card>
             <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl">Authority Builder</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm italic">"The Topical Authority Builder is a game-changer! It created a complete content cluster around 'digital marketing in Bangladesh' with 25 interconnected articles. We now rank #1 for multiple keywords and our domain authority increased by 15 points."</p>
                    <p className="mt-4 font-bold text-primary">15 point DA increase</p>
                </CardContent>
                <CardFooter className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="man glasses"/>
                        <AvatarFallback>FR</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">Fahim Rahman</p>
                        <p className="text-xs text-muted-foreground">News Website Owner</p>
                    </div>
                </CardFooter>
            </Card>
             <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl">One-Click Writer 2.0</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm italic">"One-Click Writer 2.0 is pure magic! My team generates client content 10x faster now. The custom prompts feature ensures every piece matches our clients' brand voice perfectly. We've scaled from 5 to 50 clients without hiring more writers."</p>
                    <p className="mt-4 font-bold text-primary">10x faster content</p>
                </CardContent>
                <CardFooter className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="woman smiling"/>
                        <AvatarFallback>NJ</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">Nusrat Jahan</p>
                        <p className="text-xs text-muted-foreground">Digital Marketing Agency</p>
                    </div>
                </CardFooter>
            </Card>
          </div>
        </div>
      </section>

       {/* Pricing Section */}
      <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto">
                  <Badge variant="secondary" className="text-sm py-1 px-3 border-2 border-primary/50 text-primary mb-4">
                      🔥 Limited Time Launch Offer - 25% OFF with LAUNCH25
                  </Badge>
                  <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                      Choose Your AI Content Creation Plan
                  </h2>
                  <p className="text-lg text-muted-foreground mt-4">
                      Start with our free trial, then scale with plans designed for creators, marketers, and agencies
                  </p>
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground"><CheckCircle className="w-5 h-5 text-primary"/> 4 Free Articles to Try</div>
                      <div className="flex items-center justify-center gap-2 text-muted-foreground"><CheckCircle className="w-5 h-5 text-primary"/> No Credit Card Required</div>
                      <div className="flex items-center justify-center gap-2 text-muted-foreground"><CheckCircle className="w-5 h-5 text-primary"/> Cancel Anytime</div>
                  </div>
              </div>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                  {/* Alpha Plan */}
                  <Card className="shadow-lg flex flex-col h-full">
                      <CardHeader>
                          <CardTitle className="text-2xl font-bold">Alpha Plan</CardTitle>
                          <div className="flex items-baseline gap-2">
                              <p className="text-4xl font-bold text-primary">৳499</p>
                              <p className="text-xl font-medium text-muted-foreground line-through">৳665</p>
                              <Badge variant="destructive">25% OFF</Badge>
                          </div>
                          <p className="text-muted-foreground pt-2">Kickstart your content journey with powerful AI tools and essential automation.</p>
                          <p className="text-sm text-accent font-semibold">Use code: LAUNCH25 at checkout</p>
                      </CardHeader>
                      <CardContent className="flex-grow space-y-4">
                          <div className="bg-muted p-3 rounded-lg text-center">
                              <p className="text-lg font-bold">100 Credits</p>
                              <p className="text-sm text-muted-foreground">Valid for 15 Days</p>
                          </div>
                          <div className="space-y-3 text-sm">
                              <h4 className="font-semibold text-base">Core Features</h4>
                              <ul className="space-y-2">
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> AI-Powered Featured Image Generation</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Deep Content Research</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> One-Click Article Generator</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Automated Internal Linking</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> News Article Generator</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Seamless WordPress Publishing</li>
                              </ul>
                              <h4 className="font-semibold text-base pt-2">Advanced Features</h4>
                              <ul className="space-y-2">
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Topic Authority Cluster Builder</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Enhanced In-Content AI Images</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Content Refresh Tool</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Bulk Generation Tool</li>
                              </ul>
                          </div>
                      </CardContent>
                      <CardFooter>
                          <Button size="lg" className="w-full">GET STARTED</Button>
                      </CardFooter>
                  </Card>

                  {/* Beta Plan - Most Popular */}
                  <Card className="shadow-lg flex flex-col h-full border-2 border-primary relative">
                       <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">MOST POPULAR + 25% OFF</Badge>
                      <CardHeader>
                          <CardTitle className="text-2xl font-bold">Beta Plan</CardTitle>
                          <div className="flex items-baseline gap-2">
                              <p className="text-4xl font-bold text-primary">৳1499</p>
                              <p className="text-xl font-medium text-muted-foreground line-through">৳1998</p>
                              <Badge variant="destructive">25% OFF</Badge>
                          </div>
                          <p className="text-muted-foreground pt-2">Scale up your output and get first dibs on future upgrades.</p>
                           <p className="text-sm text-accent font-semibold">Use code: LAUNCH25 at checkout</p>
                      </CardHeader>
                      <CardContent className="flex-grow space-y-4">
                           <div className="bg-primary/10 p-3 rounded-lg text-center">
                              <p className="text-lg font-bold text-primary">300 Credits</p>
                              <p className="text-sm text-muted-foreground">Valid for 1 Month</p>
                          </div>
                          <div className="space-y-3 text-sm">
                              <h4 className="font-semibold text-base">Core Features</h4>
                              <ul className="space-y-2">
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> AI-Powered Featured Image Generation</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Deep Content Research</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> One-Click Article Generator</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Automated Internal Linking</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> News Article Generator</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Seamless WordPress Publishing</li>
                              </ul>
                              <h4 className="font-semibold text-base pt-2">Advanced Features</h4>
                              <ul className="space-y-2">
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Topic Authority Cluster Builder</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Enhanced In-Content AI Images</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Content Refresh Tool</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Bulk Generation Tool</li>
                              </ul>
                               <h4 className="font-semibold text-base pt-2">Premium Features</h4>
                              <ul className="space-y-2">
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Early Access to Upcoming Features</li>
                              </ul>
                          </div>
                      </CardContent>
                      <CardFooter>
                          <Button size="lg" className="w-full">GET STARTED</Button>
                      </CardFooter>
                  </Card>

                  {/* Sigma Plan */}
                  <Card className="shadow-lg flex flex-col h-full">
                      <CardHeader>
                          <CardTitle className="text-2xl font-bold">Sigma Plan</CardTitle>
                          <div className="flex items-baseline gap-2">
                              <p className="text-4xl font-bold text-primary">৳4999</p>
                              <p className="text-xl font-medium text-muted-foreground line-through">৳6665</p>
                              <Badge variant="destructive">25% OFF</Badge>
                          </div>
                          <p className="text-muted-foreground pt-2">Our most generous package for power users and agencies.</p>
                           <p className="text-sm text-accent font-semibold">Use code: LAUNCH25 at checkout</p>
                      </CardHeader>
                      <CardContent className="flex-grow space-y-4">
                           <div className="bg-muted p-3 rounded-lg text-center">
                              <p className="text-lg font-bold">1,000 Credits</p>
                              <p className="text-sm text-muted-foreground">Valid for 2 Months</p>
                          </div>
                           <div className="space-y-3 text-sm">
                              <h4 className="font-semibold text-base">Core Features</h4>
                              <ul className="space-y-2">
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> AI-Powered Featured Image Generation</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Deep Content Research</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> One-Click Article Generator</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Automated Internal Linking</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> News Article Generator</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Seamless WordPress Publishing</li>
                              </ul>
                              <h4 className="font-semibold text-base pt-2">Advanced Features</h4>
                              <ul className="space-y-2">
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Topic Authority Cluster Builder</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Enhanced In-Content AI Images</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Content Refresh Tool</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Bulk Generation Tool</li>
                              </ul>
                               <h4 className="font-semibold text-base pt-2">Premium Features</h4>
                              <ul className="space-y-2">
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Early Access to Upcoming Features</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Custom Feature Requests</li>
                              </ul>
                          </div>
                      </CardContent>
                      <CardFooter>
                          <Button size="lg" className="w-full">GET STARTED</Button>
                      </CardFooter>
                  </Card>
              </div>

              {/* Free Trial CTA */}
              <Card className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10">
                  <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div>
                          <CardTitle className="text-2xl font-bold">Start Free - Write 4 Articles! 🎉</CardTitle>
                          <p className="text-muted-foreground mt-2 max-w-2xl">No credit card required. Test all features with 4 complete articles including AI images. Then upgrade with <strong className="text-primary">LAUNCH25</strong> for 25% OFF!</p>
                           <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> Full feature access</div>
                              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> AI images included</div>
                              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> WordPress publishing</div>
                          </div>
                      </div>
                      <Button size="lg" className="text-base shrink-0">Start Writing for FREE</Button>
                  </CardContent>
              </Card>
              
              {/* bKash Payment */}
              <div className="mt-8 text-center">
                  <p className="text-sm text-muted-foreground">Pay with</p>
                   <div className="flex justify-center items-center gap-2 mt-2">
                      <svg className="h-8" viewBox="0 0 1024 372.48" xmlns="http://www.w3.org/2000/svg"><path d="M789.28 206.01c-6.22-9.45-14.28-17.51-24.16-24.16-29.4-19.8-67.65-27.42-105.1-27.42-83.82 0-155.22 55.45-180.12 131.25H259.9a185.53 185.53 0 0 1 185.16-184.81c50.78 0 96.84 19.89 130.82 51.69a183.88 183.88 0 0 1 51.51 130.64h-74.01a113.88 113.88 0 0 0-50.1-107.19z" fill="#D82A7D"/><path d="M575.83 293.36a110.87 110.87 0 0 0-21.57 2.37A111.43 111.43 0 0 0 445.89 404H244.66a185.53 185.53 0 0 1 327-133.4 114.1 114.1 0 0 0-38.33-22.95 183.85 183.85 0 0 1-57.5 145.71z" fill="#D82A7D"/><path d="M837.74 34.33h-134.3v271.85a33.15 33.15 0 0 0 33.15 33.15h101.15V34.33z" fill="#D82A7D"/><path d="M1024 34.33H889.67v305h101.18a33.15 33.15 0 0 0 33.15-33.15V34.33z" fill="#D82A7D"/><path d="M0 34.33h201.23v305H0z" fill="#D82A7D"/><path d="M371.84 34.33H237.5v305h134.34a33.15 33.15 0 0 0 33.15-33.15V67.48a33.15 33.15 0 0 0-33.15-33.15z" fill="#D82A7D"/></svg>
                      <p className="text-muted-foreground font-semibold">Easy mobile payments available for Bangladeshi users</p>
                   </div>
              </div>
          </div>
      </section>

    </div>
  );
}

