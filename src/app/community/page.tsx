import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Eye, PlusCircle } from "lucide-react";

const forumTopics = [
  {
    title: "Best VS Code extensions for web developers in 2024?",
    author: "Alex Johnson",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "person portrait",
    replies: 12,
    views: 148,
    tags: ["web-development", "tools"],
  },
  {
    title: "Showcase: My first portfolio project built with React",
    author: "Samantha Lee",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "woman portrait",
    replies: 8,
    views: 97,
    tags: ["showcase", "react"],
  },
  {
    title: "How do you handle difficult clients as a freelancer?",
    author: "Michael Chen",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "man smiling",
    replies: 25,
    views: 302,
    tags: ["freelancing", "discussion"],
  },
  {
    title: "Brainstorming AI-powered app ideas",
    author: "Sarah Green",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "woman thinking",
    replies: 18,
    views: 215,
    tags: ["ai-tools", "ideas"],
  },
];

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
        <div className="text-center md:text-left mb-6 md:mb-0">
            <h1 className="font-headline text-5xl font-bold">Community Forum</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
            Ask questions, share your work, and connect with other learners.
            </p>
        </div>
        <Button size="lg">
          <PlusCircle className="mr-2 h-5 w-5" />
          Start a Discussion
        </Button>
      </div>

      <div className="space-y-4">
        {forumTopics.map((topic) => (
          <Card key={topic.title} className="hover:border-primary transition-all duration-200 shadow-sm hover:shadow-md">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <Avatar>
                  <AvatarImage src={topic.avatar} alt={topic.author} data-ai-hint={topic.dataAiHint} />
                  <AvatarFallback>{topic.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg hover:text-primary">
                    <Link href="#">{topic.title}</Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    by <span className="font-medium text-foreground">{topic.author}</span>
                  </p>
                  <div className="mt-2 flex gap-2">
                    {topic.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground shrink-0 ml-14 sm:ml-0">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>{topic.replies}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>{topic.views}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
