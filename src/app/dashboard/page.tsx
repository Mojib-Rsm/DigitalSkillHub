
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  RefreshCcw,
  Sparkles,
  Video,
  Layers,
  PlayCircle,
} from "lucide-react";
import Image from "next/image";

const gettingStartedGuides = [
  {
    title: "Getting Started Guide",
    description: "Learn the basics of TotthoAi",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "tutorial screen recording"
  },
  {
    title: "Advanced Features",
    description: "Explore advanced content generation features",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "dashboard interface"
  },
  {
    title: "Best Practices",
    description: "Tips and tricks for optimal results",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "checklist seo"
  },
];

export default function DashboardPage() {
  return (
    <>
        <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg p-8 mb-8 shadow-lg">
            <h1 className="text-3xl font-bold">Welcome back, Mojib Rsm!</h1>
            <p className="mt-2 text-primary-foreground/80">Create amazing content with AI-powered tools</p>
            <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="secondary"><Video className="mr-2"/>Video to Blog</Button>
                <Button variant="secondary"><Layers className="mr-2"/>Bulk Create</Button>
                <Button variant="secondary"><RefreshCcw className="mr-2"/>Refresh Content</Button>
                <Button variant="secondary"><Sparkles className="mr-2"/>One Click Writer</Button>
            </div>
        </div>

        <div>
            <div className="flex items-center gap-2 mb-4">
                <PlayCircle className="text-accent"/>
                <h2 className="text-2xl font-bold">Getting Started</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gettingStartedGuides.map(guide => (
                    <Card key={guide.title} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                        <CardHeader className="p-0">
                            <Image src={guide.image} alt={guide.title} width={600} height={400} className="object-cover" data-ai-hint={guide.dataAiHint}/>
                        </CardHeader>
                        <CardContent className="p-4">
                            <h3 className="font-semibold">{guide.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{guide.description}</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                            <Button variant="outline" size="sm">
                                <PlayCircle className="mr-2"/>
                                Watch Tutorial
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    </>
  );
}
