
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getHistory } from "@/services/history-service";
import { ListCollapse, Video, Image as ImageIcon, Download, Copy, Bot, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/services/user-service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function getToolDisplayName(toolId: string) {
    // Simple conversion from slug to title case
    return toolId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}


const HistoryOutput = ({ item }: { item: any }) => {
    // Media-based outputs
    if (item.output.imageUrl) {
        return (
            <div className="space-y-4">
                <Image src={item.output.imageUrl} alt="Generated image" width={512} height={512} className="rounded-lg border object-contain"/>
                <Button asChild variant="outline">
                    <a href={item.output.imageUrl} download={`generated_image.png`}><Download className="mr-2"/> Download</a>
                </Button>
            </div>
        );
    }
    if (item.output.videoUrl) {
        return (
             <div className="space-y-4">
                <video controls src={item.output.videoUrl} className="w-full max-w-md rounded-lg border bg-black" />
                <Button asChild variant="outline">
                    <a href={item.output.videoUrl} download={`generated_video.mp4`}><Download className="mr-2"/> Download</a>
                </Button>
            </div>
        );
    }

    // Text-based outputs
    if (typeof item.output.article === 'string') {
        return <p className="text-muted-foreground whitespace-pre-wrap">{item.output.article}</p>;
    }
    if (typeof item.output.coverLetter === 'string') {
        return <p className="text-muted-foreground whitespace-pre-wrap">{item.output.coverLetter}</p>;
    }
     if (typeof item.output.description === 'string') {
        return <p className="text-muted-foreground whitespace-pre-wrap">{item.output.description}</p>;
    }
     if (typeof item.output.disclaimer === 'string') {
        return <p className="text-muted-foreground whitespace-pre-wrap">{item.output.disclaimer}</p>;
    }
    if (typeof item.output.emailDraft === 'string') {
        return <p className="text-muted-foreground whitespace-pre-wrap">{item.output.emailDraft}</p>;
    }
    if (typeof item.output.policy === 'string') {
        return <p className="text-muted-foreground whitespace-pre-wrap">{item.output.policy}</p>;
    }
     if (typeof item.output.post === 'string') {
        return <p className="text-muted-foreground whitespace-pre-wrap">{item.output.post}</p>;
    }
     if (typeof item.output.summary === 'string') {
        return <p className="text-muted-foreground whitespace-pre-wrap">{item.output.summary}</p>;
    }
     if (typeof item.output.suggestions === 'string') {
        return <p className="text-muted-foreground whitespace-pre-wrap">{item.output.suggestions}</p>;
    }
      if (typeof item.output.terms === 'string') {
        return <p className="text-muted-foreground whitespace-pre-wrap">{item.output.terms}</p>;
    }
    if (typeof item.output.translatedText === 'string') {
        return <p className="text-muted-foreground whitespace-pre-wrap">{item.output.translatedText}</p>;
    }

    // List/Array based outputs
    if (Array.isArray(item.output.bengaliSuggestions)) {
         return <ul className="list-disc pl-5 text-muted-foreground">
            {item.output.bengaliSuggestions.map((s: string, i: number) => <li key={i}>{s}</li>)}
        </ul>
    }
     if (Array.isArray(item.output.domains)) {
         return <ul className="list-disc pl-5 text-muted-foreground">
            {item.output.domains.map((d: string, i: number) => <li key={i}>{d}</li>)}
        </ul>
    }
    if (Array.isArray(item.output.keywords)) {
         return <ul className="list-disc pl-5 text-muted-foreground">
            {item.output.keywords.map((k: string, i: number) => <li key={i}>{k}</li>)}
        </ul>
    }
     if (Array.isArray(item.output.names)) {
         return <ul className="list-disc pl-5 text-muted-foreground">
            {item.output.names.map((n: string, i: number) => <li key={i}>{n}</li>)}
        </ul>
    }
    if (Array.isArray(item.output.topics)) {
         return <ul className="list-disc pl-5 text-muted-foreground">
            {item.output.topics.map((t: string, i: number) => <li key={i}>{t}</li>)}
        </ul>
    }
     if (Array.isArray(item.output.questions)) {
         return <ul className="list-disc pl-5 text-muted-foreground">
            {item.output.questions.map((q: any, i: number) => <li key={i}>{q.question}</li>)}
        </ul>
    }

    // Object based outputs
    if (item.output.blueprint) {
         return <p className="text-muted-foreground whitespace-pre-wrap">{JSON.stringify(item.output.blueprint, null, 2)}</p>
    }
     if (item.output.data) { // for one-click-writer
         return <p className="text-muted-foreground whitespace-pre-wrap">{item.output.data.article}</p>
    }

    // Fallback for any other data structures
    return <p className="text-muted-foreground whitespace-pre-wrap">{JSON.stringify(item.output, null, 2)}</p>;
};

const HistoryInput = ({ item }: { item: any }) => {
    // Stringify if it's an object, otherwise display directly
    const inputContent = typeof item.input === 'object' ? JSON.stringify(item.input, null, 2) : item.input;
    return <p className="text-muted-foreground bg-muted p-3 rounded-md text-sm italic whitespace-pre-wrap">"{inputContent}"</p>;
};


export default async function HistoryPage() {
    const [historyItems, user] = await Promise.all([getHistory(), getCurrentUser()]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">{user?.role === 'admin' ? "All User History" : "My Generation History"}</h1>
                <p className="text-muted-foreground">
                   {user?.role === 'admin' ? "Review all content generated by users on the platform." : "Review your previously generated content, images, and videos."}
                </p>
            </div>

            {historyItems.length === 0 ? (
                <Card className="text-center py-12">
                    <CardHeader>
                        <ListCollapse className="mx-auto h-12 w-12 text-muted-foreground" />
                        <CardTitle className="mt-4">No History Found</CardTitle>
                        <CardDescription>
                            {user?.role === 'admin' ? "No content has been generated by any user yet." : "You haven't generated any content yet. Start by using one of our AI tools."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {user?.role !== 'admin' && (
                             <Button asChild>
                                <Link href="/ai-tools">Explore AI Tools</Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {historyItems.map((item) => (
                        <Card key={item.id} className="shadow-md">
                            <CardHeader className="flex flex-row justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl">{getToolDisplayName(item.tool)}</CardTitle>
                                    <CardDescription>{new Date(item.createdAt).toLocaleString()}</CardDescription>
                                     {user?.role === 'admin' && item.userName && (
                                        <div className="flex items-center gap-2 pt-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={item.userImage} alt={item.userName}/>
                                                <AvatarFallback><User className="w-4 h-4"/></AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs text-muted-foreground">{item.userName}</span>
                                        </div>
                                    )}
                                </div>
                                <Badge variant="secondary">
                                    <Bot className="mr-2"/>
                                    {item.tool.includes('video') ? 'Video' : item.tool.includes('image') ? 'Image' : 'Text'}
                                </Badge>
                            </CardHeader>
                             <CardContent>
                                <div className="space-y-4">
                                   <div>
                                       <h4 className="font-semibold text-sm mb-1">Input:</h4>
                                       <HistoryInput item={item} />
                                   </div>
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2">Generated Output:</h4>
                                        <div className="p-3 border rounded-md">
                                             <HistoryOutput item={item} />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
