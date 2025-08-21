
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getHistory } from "@/services/history-service";
import { ListCollapse, Video, Image as ImageIcon, Download, Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function getToolDisplayName(toolId: string) {
    const names: Record<string, string> = {
        'image-generator': 'AI Image Generator',
        'video-generator': 'AI Video Generator',
        'image-to-video-generator': 'Image to Video Generator',
    };
    return names[toolId] || toolId;
}

export default async function HistoryPage() {
    const historyItems = await getHistory();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Generation History</h1>
                <p className="text-muted-foreground">
                    Review your previously generated content, images, and videos.
                </p>
            </div>

            {historyItems.length === 0 ? (
                <Card className="text-center py-12">
                    <CardHeader>
                        <ListCollapse className="mx-auto h-12 w-12 text-muted-foreground" />
                        <CardTitle className="mt-4">No History Found</CardTitle>
                        <CardDescription>
                            You haven't generated any content yet. Start by using one of our AI tools.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/ai-tools">Explore AI Tools</Link>
                        </Button>
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
                                </div>
                                <Badge variant="secondary">{item.tool.includes('video') ? <Video className="mr-2"/> : <ImageIcon className="mr-2"/>} {item.tool.includes('video') ? 'Video' : 'Image'}</Badge>
                            </CardHeader>
                             <CardContent>
                                <div className="space-y-4">
                                   <div>
                                       <h4 className="font-semibold text-sm mb-1">Input Prompt:</h4>
                                       <p className="text-muted-foreground bg-muted p-3 rounded-md text-sm italic">"{item.input.prompt}"</p>
                                   </div>
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2">Generated Output:</h4>
                                        {item.output.imageUrl && (
                                            <Image src={item.output.imageUrl} alt="Generated image" width={512} height={512} className="rounded-lg border object-contain"/>
                                        )}
                                        {item.output.videoUrl && (
                                             <video controls src={item.output.videoUrl} className="w-full max-w-md rounded-lg border bg-black" />
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <a href={item.output.imageUrl || item.output.videoUrl} download={`generated_${item.tool.includes('video') ? 'video' : 'image'}.png`}>
                                    <Button variant="outline">
                                        <Download className="mr-2"/>
                                        Download
                                    </Button>
                                </a>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
