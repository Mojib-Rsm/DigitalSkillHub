
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const blogPosts = [
  {
    title: "10 Essential Skills for Modern Web Developers",
    category: "Web Development",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "developer computer code",
    author: "Jane Doe",
    date: "July 16, 2024",
    excerpt: "The web development landscape is always evolving. Here are the 10 skills you need to stay ahead of the curve in today's market.",
  },
  {
    title: "The Rise of AI: How to Leverage AI Tools for Productivity",
    category: "AI Tools",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "artificial intelligence brain",
    author: "Sarah Green",
    date: "July 12, 2024",
    excerpt: "Artificial intelligence is no longer science fiction. Discover practical AI tools that can automate tasks and boost your productivity.",
  },
  {
    title: "Building a Strong Freelance Profile That Wins Clients",
    category: "Freelancing",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "freelancer laptop cafe",
    author: "Michael Brown",
    date: "July 10, 2024",
    excerpt: "Your freelance profile is your digital storefront. Learn the secrets to crafting a compelling profile that attracts high-value clients.",
  },
  {
    title: "Color Theory for Graphic Designers: A Beginner's Guide",
    category: "Graphics Design",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "color wheel design",
    author: "John Smith",
    date: "July 8, 2024",
    excerpt: "Understand the fundamentals of color theory to create visually stunning and emotionally resonant designs.",
  }
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold">দক্ষতার স্প্রাউট ব্লগ</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          ডিজিটাল দক্ষতা এবং ফ্রিল্যান্সিং জগত থেকে অন্তর্দৃষ্টি, টিউটোরিয়াল এবং খবর।
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Card key={post.title} className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="p-0">
              <Image
                src={post.image}
                alt={post.title}
                width={600}
                height={400}
                className="object-cover w-full h-48"
                data-ai-hint={post.dataAiHint}
              />
            </CardHeader>
            <CardContent className="p-6 flex-grow">
              <Badge variant="outline" className="mb-2">{post.category}</Badge>
              <CardTitle className="text-xl font-bold leading-tight">
                <Link href="#" className="hover:text-primary transition-colors">
                  {post.title}
                </Link>
              </CardTitle>
              <p className="text-muted-foreground mt-2">{post.excerpt}</p>
            </CardContent>
            <CardFooter className="p-6 flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="person avatar"/>
                  <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{post.author}</p>
                  <p>{post.date}</p>
                </div>
              </div>
              <Link href="#" className="text-primary font-semibold hover:underline flex items-center gap-1">
                আরও পড়ুন <ArrowRight className="w-4 h-4"/>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
