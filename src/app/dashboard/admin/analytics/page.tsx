
"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Area, AreaChart } from "recharts"
import { Button } from "@/components/ui/button"
import { Download, Palette, DollarSign, Users as UsersIcon, Activity, CreditCard } from "lucide-react"

// Sample Data
const toolUsageData = [
  { tool: "Image Gen", usage: 186, fill: "var(--color-image-gen)" },
  { tool: "Blog Writer", usage: 305, fill: "var(--color-blog-writer)" },
  { tool: "Social Post", usage: 237, fill: "var(--color-social-post)" },
  { tool: "Translator", usage: 73, fill: "var(--color-translator)" },
  { tool: "Video Gen", usage: 209, fill: "var(--color-video-gen)" },
  { tool: "Other", usage: 214, fill: "var(--color-other)" },
]
const toolUsageConfig = {
  usage: { label: "Usage Count" },
  "image-gen": { label: "Image Generator", color: "hsl(var(--chart-1))" },
  "blog-writer": { label: "Blog Writer", color: "hsl(var(--chart-2))" },
  "social-post": { label: "Social Media Post", color: "hsl(var(--chart-3))" },
  translator: { label: "Translator", color: "hsl(var(--chart-4))" },
  "video-gen": { label: "Video Generator", color: "hsl(var(--chart-5))" },
  other: { label: "Other", color: "hsl(var(--muted))" },
} satisfies ChartConfig

const userActivityData = [
  { date: "2024-07-01", monthly: 2400, daily: 1400 },
  { date: "2024-07-02", monthly: 2510, daily: 1500 },
  { date: "2024-07-03", monthly: 2650, daily: 1390 },
  { date: "2024-07-04", monthly: 2780, daily: 1800 },
  { date: "2024-07-05", monthly: 2890, daily: 1500 },
  { date: "2024-07-06", monthly: 2990, daily: 1700 },
  { date: "2024-07-07", monthly: 3000, daily: 2000 },
]
const userActivityConfig = {
  monthly: { label: "Monthly Active Users", color: "hsl(var(--chart-1))" },
  daily: { label: "Daily Active Users", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

const revenueData = [
    { month: "January", revenue: 4000 },
    { month: "February", revenue: 3000 },
    { month: "March", revenue: 5000 },
    { month: "April", revenue: 4500 },
    { month: "May", revenue: 6000 },
    { month: "June", revenue: 7000 },
]
const revenueConfig = {
  revenue: { label: "Revenue (BDT)", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Analytics & Reports</h1>
            <p className="text-muted-foreground">
                Track key metrics for your application's performance and growth.
            </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">৳45,231.89</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                    <UsersIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+2350</div>
                    <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">12,234</div>
                    <p className="text-xs text-muted-foreground">+19% from last month</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground">+201 since last hour</p>
                </CardContent>
            </Card>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
             <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Most Used Tools</CardTitle>
                    <CardDescription>A breakdown of which AI tools are most popular among users.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={toolUsageConfig} className="h-64">
                    <BarChart data={toolUsageData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="tool"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                        />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="usage" radius={4} />
                    </BarChart>
                    </ChartContainer>
                </CardContent>
                 <CardFooter>
                    <Button><Download className="mr-2"/> Export as CSV</Button>
                </CardFooter>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Revenue Report</CardTitle>
                    <CardDescription>Monthly revenue trends over the last 6 months.</CardDescription>
                </CardHeader>
                <CardContent>
                   <ChartContainer config={revenueConfig} className="h-64">
                    <AreaChart
                        data={revenueData}
                        margin={{ left: 12, right: 12 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Area
                        dataKey="revenue"
                        type="natural"
                        fill="var(--color-revenue)"
                        fillOpacity={0.4}
                        stroke="var(--color-revenue)"
                        />
                    </AreaChart>
                    </ChartContainer>
                </CardContent>
                 <CardFooter>
                    <Button><Download className="mr-2"/> Export as PDF</Button>
                </CardFooter>
            </Card>

            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>User Activity</CardTitle>
                    <CardDescription>Daily and monthly active users over the last week.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={userActivityConfig} className="h-72">
                    <LineChart data={userActivityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Line type="monotone" dataKey="monthly" stroke="var(--color-monthly)" />
                        <Line type="monotone" dataKey="daily" stroke="var(--color-daily)" />
                    </LineChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter>
                    <Button><Download className="mr-2"/> Export as CSV</Button>
                </CardFooter>
            </Card>

        </div>
    </div>
  )
}
