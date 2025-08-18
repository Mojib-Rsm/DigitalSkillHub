
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getFirestore, collection, getDocs, orderBy, query } from 'firebase/firestore/lite';
import { app } from "@/lib/firebase";

type BlogPost = {
  id: string;
  title: string;
  category: string;
  image: string;
  dataAiHint: string;
  author: string;
  date: string;
  excerpt: string;
};

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const db = getFirestore(app);
    const blogCol = collection(db, 'blog');
    const q = query(blogCol, orderBy('date', 'desc'));
    const blogSnapshot = await getDocs(q);
    const blogList = blogSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
    return blogList;
  } catch (error) {
    console.error("Error fetching blog posts from Firestore:", error);
    return [];
  }
}


export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

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
          <Card key={post.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
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
  );
}
