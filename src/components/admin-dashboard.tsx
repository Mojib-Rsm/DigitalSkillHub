
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users as UsersIcon, CircleUser, Activity } from "lucide-react";
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

export default function AdminDashboard() {
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
