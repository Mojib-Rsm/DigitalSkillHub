

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { blogPosts as staticBlogPosts } from "@/lib/demo-data"; // Import static data

type BlogPost = {
  id?: string; // ID might not be present for static data
  title: string;
  category: string;
  image: string;
  dataAiHint: string;
  author: string;
  date: string;
  excerpt: string;
};

async function getBlogPosts(): Promise<BlogPost[]> {
  // Return the static data directly
  return staticBlogPosts;
}


export default async function BlogPage() {
  const blogPosts = await getBlogPosts();
  const pageId = "blog";

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "TotthoAi Blog",
    "description": "Insights, tutorials, and news from the world of digital skills and freelancing.",
    "blogPost": blogPosts.map(post => ({
        "@type": "BlogPosting",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://totthoai.mojib.me/blog/${pageId}` // Use a generic or post-specific ID/slug
        },
        "headline": post.title,
        "image": post.image,
        "author": {
            "@type": "Person",
            "name": post.author
        },
        "publisher": {
            "@type": "Organization",
            "name": "TotthoAi",
            "logo": {
                "@type": "ImageObject",
                "url": "https://totthoai.mojib.me/logo.png"
            }
        },
        "datePublished": post.date,
        "description": post.excerpt
    }))
  };

  return (
    <>
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
    />
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold">TotthoAi ব্লগ</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          ডিজিটাল দক্ষতা এবং ফ্রিল্যান্সিং জগত থেকে অন্তর্দৃষ্টি, টিউটোরিয়াল এবং খবর।
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post, index) => (
          <Card key={post.title + index} className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
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
                  <p>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
    </>
  );
}
