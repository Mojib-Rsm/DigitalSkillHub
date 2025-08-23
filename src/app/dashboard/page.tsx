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
import { getCurrentUser, UserProfile } from "@/services/user-service";
import { MoreHorizontal, Edit, PlusCircle, Star, Trash, Bell, Heart, Activity, DollarSign, Users as UsersIcon, CircleUser, AlertTriangle } from "lucide-react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts"

// Admin Dashboard Data
const userSignups = [
    { month: "Jan", signups: 186 },
    { month: "Feb", signups: 305 },
    { month: "Mar", signups: 237 },
    { month: "Apr", signups: 273 },
    { month: "May", signups: 209 },
    { month: "Jun", signups: 250 },
];

const recentActivities = [
    { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+৳499.00", type: "Subscription" },
    { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+৳1,499.00", type: "Subscription" },
    { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+৳499.00", type: "Subscription" },
    { name: "William Kim", email: "will@email.com", amount: "New User", type: "Registration" },
    { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+৳1,499.00", type: "Subscription" },
];


// User Dashboard Mock Data
const bookmarkedTools = [
    { name: "Blog Topic Generator", logo: "PenSquare", tags: ["Content", "Writing"], added: "2024-07-20"},
    { name: "AI Image Generator", logo: "ImageIcon", tags: ["Image", "Creative"], added: "2024-07-18"},
    { name: "Passport Photo Maker", logo: "UserCircle", tags: ["Image", "Utility"], added: "2024-07-15"},
];

const myReviews = [
    { tool: "Blog Topic Generator", rating: 5, review: "Absolutely fantastic! Generated so many great ideas.", status: "Approved" },
    { tool: "AI Image Generator", rating: 4, review: "Great tool, but sometimes the results are a bit off.", status: "Pending" },
]


function AdminDashboard() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">৳45,231.89</div>
                <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Subscriptions
                </CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <CircleUser className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">12,234</div>
                <p className="text-xs text-muted-foreground">
                    +19% from last month
                </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                    +201 since last hour
                </p>
                </CardContent>
            </Card>
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <Card className="xl:col-span-2">
                <CardHeader>
                <CardTitle>User Sign-ups</CardTitle>
                <CardDescription>Last 6 Months</CardDescription>
                </CardHeader>
                <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={userSignups}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="month"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                        cursor={{fill: 'hsl(var(--muted))'}}
                        contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}}
                    />
                    <Legend />
                    <Bar dataKey="signups" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                    New users and subscriptions.
                </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-8">
                    {recentActivities.map(activity => (
                        <div key={activity.email} className="flex items-center gap-4">
                            <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarFallback>{activity.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">{activity.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {activity.email}
                            </p>
                            </div>
                            <div className="ml-auto font-medium">
                                <Badge variant={activity.type === 'Subscription' ? 'default' : 'secondary'}>
                                    {activity.amount}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
            </div>
        </main>
    )
}

function UserDashboard({ user }: { user: UserProfile }) {
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
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tool</TableHead>
                                                <TableHead>Tags</TableHead>
                                                <TableHead>Date Added</TableHead>
                                                <TableHead>Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {bookmarkedTools.map(tool => (
                                                <TableRow key={tool.name}>
                                                    <TableCell className="font-medium">{tool.name}</TableCell>
                                                    <TableCell className="flex gap-1">{tool.tags.map(tag=><Badge variant="outline" key={tag}>{tag}</Badge>)}</TableCell>
                                                    <TableCell>{tool.added}</TableCell>
                                                    <TableCell><Button variant="ghost" size="icon"><Trash className="w-4 h-4"/></Button></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
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


export default async function DashboardPage() {
    const user = await getCurrentUser();

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <AlertTriangle className="w-16 h-16 text-destructive mb-4"/>
                <h2 className="text-2xl font-bold">Error Loading User Data</h2>
                <p className="text-muted-foreground">We couldn't load your profile. Please try refreshing the page or logging in again.</p>
                <Button className="mt-4" asChild><Link href="/login">Go to Login</Link></Button>
            </div>
        );
    }

    if (user.role === 'admin') {
        return <AdminDashboard />;
    }
    
    return <UserDashboard user={user} />;
}
