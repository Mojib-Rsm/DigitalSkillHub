
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/services/user-service";
import { MoreHorizontal, Edit, PlusCircle, Star, Trash, Bell, Heart, Loader } from "lucide-react";
import Link from "next/link";
import React from "react";
import { getToolById, Tool } from "@/services/tool-service";

const myReviews = [
    { tool: "Blog Topic Generator", rating: 5, review: "Absolutely fantastic! Generated so many great ideas.", status: "Approved" },
    { tool: "AI Image Generator", rating: 4, review: "Great tool, but sometimes the results are a bit off.", status: "Pending" },
]


export default function UserDashboard({ user }: { user: UserProfile }) {

    const [bookmarkedTools, setBookmarkedTools] = React.useState<Tool[]>([]);
    const [loadingBookmarks, setLoadingBookmarks] = React.useState(true);

    React.useEffect(() => {
        async function fetchBookmarkedTools() {
            setLoadingBookmarks(true);
            if(user.bookmarks && user.bookmarks.length > 0) {
                const toolPromises = user.bookmarks.map(id => getToolById(id));
                const tools = (await Promise.all(toolPromises)).filter(Boolean) as Tool[];
                setBookmarkedTools(tools);
            } else {
                setBookmarkedTools([]);
            }
            setLoadingBookmarks(false);
        }
        fetchBookmarkedTools();
    }, [user.bookmarks])


     return (
        <div className="space-y-8">
            {/* Header */}
            <Card className="shadow-md">
                <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
                    <Avatar className="w-24 h-24 border-4 border-primary/50">
                        <AvatarImage src={user.profile_image} alt={user.name} />
                        <AvatarFallback className="text-3xl">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
                        <p className="text-muted-foreground">{user.email}</p>
                        <Badge className="mt-2" variant={user.plan_id === 'beta' || user.plan_id === 'sigma' ? "default" : "secondary"}>{user.plan_id === 'beta' || user.plan_id === 'sigma' ? "Pro" : "Free"}</Badge>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild><Link href="/dashboard/settings">Edit Profile</Link></Button>
                        <Button asChild><Link href="/dashboard/pricing">Upgrade to Pro</Link></Button>
                    </div>
                </CardContent>
            </Card>

             {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2">
                     <Tabs defaultValue="bookmarks">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="bookmarks">Bookmarked Tools</TabsTrigger>
                            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
                            <TabsTrigger value="qa">Q&A Contributions</TabsTrigger>
                        </TabsList>
                        <TabsContent value="bookmarks">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Bookmarked Tools</CardTitle>
                                    <CardDescription>Your favorite tools, all in one place.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {loadingBookmarks ? (
                                        <div className="flex justify-center items-center h-40">
                                            <Loader className="animate-spin text-primary"/>
                                        </div>
                                    ) : bookmarkedTools.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tool</TableHead>
                                                <TableHead>Category</TableHead>
                                                <TableHead>Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {bookmarkedTools.map(tool => (
                                                <TableRow key={tool.id}>
                                                    <TableCell className="font-medium">{tool.title}</TableCell>
                                                    <TableCell><Badge variant="outline">{tool.category}</Badge></TableCell>
                                                    <TableCell><Button variant="ghost" size="icon"><Trash className="w-4 h-4"/></Button></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    ) : (
                                        <div className="text-center text-muted-foreground py-10">
                                            <p>You haven't bookmarked any tools yet.</p>
                                            <Button variant="link" asChild><Link href="/ai-tools">Explore Tools</Link></Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                         <TabsContent value="reviews">
                            <Card>
                                <CardHeader>
                                    <CardTitle>My Reviews</CardTitle>
                                    <CardDescription>Reviews you have submitted for our tools.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     {myReviews.map(review => (
                                        <Card key={review.tool} className="bg-muted/50">
                                            <CardContent className="p-4 flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold">{review.tool}</p>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`}/>
                                                        ))}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-2 italic">"{review.review}"</p>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant={review.status === 'Approved' ? 'default' : 'secondary'}>{review.status}</Badge>
                                                    <div className="flex gap-1 mt-2">
                                                        <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="w-4 h-4"/></Button>
                                                         <Button variant="ghost" size="icon" className="h-7 w-7"><Trash className="w-4 h-4"/></Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                     ))}
                                </CardContent>
                            </Card>
                         </TabsContent>
                          <TabsContent value="qa">
                            <Card>
                                <CardHeader>
                                     <CardTitle>Q&A Contributions</CardTitle>
                                    <CardDescription>Your questions and answers from the community.</CardDescription>
                                </CardHeader>
                                <CardContent className="text-center text-muted-foreground py-12">
                                    <p>Coming Soon!</p>
                                </CardContent>
                            </Card>
                          </TabsContent>
                    </Tabs>
                </div>
                {/* Right Column */}
                <div className="space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>My Collections</CardTitle>
                            <CardDescription>Organize your favorite tools into collections.</CardDescription>
                        </CardHeader>
                         <CardContent className="space-y-3">
                            <Card className="bg-primary/10 border-primary/20">
                                <CardContent className="p-3 flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">Writing Tools</p>
                                        <p className="text-sm text-muted-foreground">5 tools</p>
                                    </div>
                                    <MoreHorizontal className="text-muted-foreground"/>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardContent className="p-3 flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">Image Tools</p>
                                        <p className="text-sm text-muted-foreground">3 tools</p>
                                    </div>
                                    <MoreHorizontal className="text-muted-foreground"/>
                                </CardContent>
                            </Card>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full"><PlusCircle className="w-4 h-4 mr-2"/> Create New Collection</Button>
                        </CardFooter>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex items-start gap-3">
                                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full"><Bell className="w-4 h-4 text-blue-500"/></div>
                                <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">New Feature!</span> You can now generate videos from images. <Link href="#" className="text-primary">Try it now!</Link></p>
                            </div>
                             <div className="flex items-start gap-3">
                                <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full"><Star className="w-4 h-4 text-green-500"/></div>
                                <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">DEAL:</span> Get 50% off the Pro plan this week only!</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
