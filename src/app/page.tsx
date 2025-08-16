
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Brush, LineChart, Code, Search, Star, Award, Users, Briefcase, ShoppingBag, PlayCircle, Phone, MessageSquare } from "lucide-react";
import CourseCard from "@/components/course-card";
import { Input } from "@/components/ui/input";

const featuredCourses = [
  {
    title: "স্মার্টফোন ও ইন্টারনেট বেসিকস",
    category: "ডিজিটাল লিটারেসি",
    instructor: "ডিজিটাল স্কিল হাব",
    price: 0,
    level: "শিক্ষানবিশ",
    duration: "4 ঘন্টা",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "smartphone learning",
  },
  {
    title: "বাংলায় ফ্রিল্যান্সিং শুরু",
    category: "ফ্রিল্যান্সিং",
    instructor: "আবুল কালাম",
    price: 49.99,
    level: "শিক্ষানবিশ",
    duration: "12 ঘন্টা",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "freelancing laptop home",
  },
  {
    title: "ফেসবুক ও হোয়াটসঅ্যাপে ব্যবসা",
    category: "ই-কমার্স",
    instructor: "ফাতেমা আক্তার",
    price: 29.99,
    level: "শিক্ষানবিশ",
    duration: "8 ঘন্টা",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "social media business",
  },
];

const whyChooseUsPoints = [
    {
      icon: <Award className="w-10 h-10 text-primary" />,
      title: "বিশেষজ্ঞ প্রশিক্ষক",
      description: "বাস্তব অভিজ্ঞতা সম্পন্ন এবং শেখানোর প্রতি অনুরাগী শিল্প পেশাদারদের কাছ থেকে শিখুন।",
    },
    {
      icon: <BookOpen className="w-10 h-10 text-primary" />,
      title: "বিস্তৃত পাঠ্যক্রম",
      description: "আমাদের কোর্সগুলি আজকের চাকরির বাজারের জন্য পুঙ্খানুপুঙ্খ, আপ-টু-ডেট এবং ব্যবহারিক হতে ডিজাইন করা হয়েছে।",
    },
    {
      icon: <Users className="w-10 h-10 text-primary" />,
      title: "সহায়ক কমিউনিটি",
      description: "আমাদের সক্রিয় কমিউনিটি ফোরামে সহপাঠী এবং পরামর্শকদের সাথে সংযোগ স্থাপন করুন।",
    },
    {
      icon: <Briefcase className="w-10 h-10 text-primary" />,
      title: "ক্যারিয়ার কেন্দ্রিক",
      description: "একটি নতুন চাকরি পেতে, পদোন্নতি পেতে বা আপনার নিজের ব্যবসা শুরু করার জন্য প্রয়োজনীয় দক্ষতা অর্জন করুন।",
    },
  ];

const testimonials = [
  {
    name: "আলেক্স জনসন",
    role: "ওয়েব ডেভেলপার",
    testimonial: "ডিজিটাল স্কিল হাব আমার ক্যারিয়ার বদলে দিয়েছে। কোর্সগুলো শীর্ষস্থানীয় এবং কমিউনিটি অবিশ্বাস্যভাবে সহায়ক। আমি ৩ মাসের মধ্যে আমার স্বপ্নের চাকরি পেয়েছি!",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "person portrait",
  },
  {
    name: "সামান্থা লি",
    role: "ফ্রিল্যান্স ডিজাইনার",
    testimonial: "গ্রাফিক ডিজাইন কোর্সগুলো অসাধারণ। আমি অনেক কিছু শিখেছি এবং একটি শক্তিশালী পোর্টফোলিও তৈরি করতে পেরেছি যা উচ্চ বেতনের ক্লায়েন্টদের আকর্ষণ করে।",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "woman portrait",
  },
  {
    name: "মাইকেল চেন",
    role: "মার্কেটিং স্ট্র্যাটেজিস্ট",
    testimonial: "আমি ডিজিটাল মার্কেটিং ট্র্যাকটি অত্যন্ত সুপারিশ করছি। বিষয়বস্তু সর্বশেষ শিল্পের প্রবণতার সাথে আপ-টু-ডেট, যা আমাকে একটি আসল সুবিধা দিয়েছে।",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "man smiling",
  },
];

const marketplaceProducts = [
  {
    title: "হাতে সেলাই করা নকশি কাঁথা",
    seller: "রহিমা বেগম",
    price: "24.99",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "stitched fabric quilt",
  },
  {
    title: "পাট ও বাঁশের কারুশিল্পের ঝুড়ি",
    seller: "আনোয়ারার সৃষ্টি",
    price: "15.00",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "jute basket handmade",
  },
  {
    title: "অর্গানিক হলুদ গুঁড়ো",
    seller: "কক্সবাজার অর্গানিক্স",
    price: "9.99",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "spices turmeric powder",
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
            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight">
              নারী, তরুণ ও প্রতিবন্ধীদের জন্য <span className="text-primary">ডিজিটাল দক্ষতা সহজ ভাষায়</span>
            </h1>
            <p className="text-lg text-muted-foreground mt-6">
              মোবাইল দিয়েই শিখুন, আয় করুন
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="transition-transform transform hover:scale-105 text-lg">
                <Link href="/courses">
                  👉 এখনই কোর্স শুরু করুন (ফ্রি বেসিক ট্রেনিং)
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                <Input placeholder="কোর্স বা দক্ষতা খুঁজুন..." className="pl-14 h-16 text-lg w-full" />
                <Button className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-6" size="lg">অনুসন্ধান</Button>
             </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-4xl font-bold mb-4">বিশেষ কোর্সসমূহ</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
            আপনার শেখার যাত্রা শুরু করতে সাহায্য করার জন্য হাতে বাছাই করা কোর্স।
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course.title} course={course} />
            ))}
          </div>
          <Button asChild variant="link" size="lg" className="mt-12 text-lg">
            <Link href="/courses">
              সব কোর্স দেখুন <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Tutorial Videos Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-4xl font-bold mb-4">কিভাবে শুরু করবেন?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
            আমাদের টিউটোরিয়াল ভিডিওগুলো দেখুন এবং আপনার শেখার যাত্রা শুরু করুন।
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <CardHeader className="p-0 relative">
                    <Link href="#">
                        <Image src="https://placehold.co/800x450.png" alt="Registration Tutorial" width={800} height={450} className="w-full object-cover" data-ai-hint="tutorial video play"/>
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <PlayCircle className="w-20 h-20 text-white/80 hover:text-white transition-colors"/>
                        </div>
                    </Link>
                </CardHeader>
                <CardContent className="p-6">
                    <CardTitle className="text-xl">কিভাবে রেজিস্ট্রেশন করবেন</CardTitle>
                </CardContent>
            </Card>
             <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <CardHeader className="p-0 relative">
                    <Link href="#">
                        <Image src="https://placehold.co/800x450.png" alt="Class Tutorial" width={800} height={450} className="w-full object-cover" data-ai-hint="online class people"/>
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <PlayCircle className="w-20 h-20 text-white/80 hover:text-white transition-colors"/>
                        </div>
                    </Link>
                </CardHeader>
                <CardContent className="p-6">
                    <CardTitle className="text-xl">কিভাবে ক্লাসে অংশগ্রহণ করবেন</CardTitle>
                </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Made in Cox's Bazar Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-4xl font-bold mb-4">মেড ইন কক্সবাজার</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
            স্থানীয় কারিগর এবং উদ্যোক্তাদের সমর্থন করুন। প্রতিভাবান নারী ও প্রতিবন্ধী ব্যক্তিদের দ্বারা তৈরি পণ্য।
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {marketplaceProducts.map((product) => (
              <Card key={product.title} className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <CardHeader className="p-0 relative">
                    <Image
                    src={product.image}
                    alt={product.title}
                    width={600}
                    height={400}
                    className="object-cover w-full h-48"
                    data-ai-hint={product.dataAiHint}
                    />
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                    <CardTitle className="text-lg font-bold leading-tight h-12">
                        {product.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-3 text-muted-foreground text-sm">
                        <span className="font-medium text-foreground">বিক্রেতা: {product.seller}</span>
                    </div>
                </CardContent>
                <CardFooter className="p-4 flex justify-between items-center bg-background/50">
                    <p className="text-2xl font-bold text-primary">${product.price}</p>
                    <Button asChild>
                    <Link href="#">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        পণ্য দেখুন
                    </Link>
                    </Button>
                </CardFooter>
            </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-headline text-4xl font-bold mb-4">কেন ডিজিটাল স্কিল হাব বেছে নেবেন?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
              আপনার লক্ষ্য অর্জনে সহায়তা করার জন্য আমরা সেরা শেখার অভিজ্ঞতা প্রদানে নিবেদিত।
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUsPoints.map((point) => (
              <Card key={point.title} className="text-center p-8 shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    {point.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{point.title}</h3>
                <p className="text-muted-foreground">{point.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-4xl font-bold text-center mb-12">
            আমাদের শিক্ষার্থীদের সাফল্যের গল্প
          </h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Card className="h-full flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex mb-4">
                          {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                        <p className="text-muted-foreground italic mb-6">"{testimonial.testimonial}"</p>
                      </CardContent>
                      <div className="bg-muted p-6 flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.dataAiHint} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-4xl font-bold mb-4">আপনার যাত্রা শুরু করতে প্রস্তুত?</h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto mb-8">
                হাজার হাজার শিক্ষার্থীর সাথে যোগ দিন এবং আপনার ডিজিটাল ক্যারিয়ারে পরবর্তী পদক্ষেপ নিন।
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
                    <Phone />
                    ফোন দিয়ে সাইন আপ করুন
                </Button>
            </div>
        </div>
      </section>
    </div>
  );
}
