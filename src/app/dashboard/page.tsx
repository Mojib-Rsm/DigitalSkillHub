
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
} from "@/components/ui/sidebar";

import {
  Bot,
  RefreshCcw,
  Sparkles,
  Video,
  FileText,
  Layers,
  Library,
  Settings,
  HelpCircle,
  PlayCircle,
  LayoutGrid,
  ChevronDown,
  LogOut,
  Moon,
  Coins
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon">
        <SidebarHeader>
           <SidebarMenuButton asChild>
            <Link href="/" className="h-12 justify-start gap-3 px-3">
              <Bot className="text-primary size-7" />
              <span className="font-bold text-xl">TotthoAi</span>
            </Link>
          </SidebarMenuButton>
        </SidebarHeader>
        <SidebarContent className="p-2">
            <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton href="/dashboard" isActive>
                    <LayoutGrid />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton>
                        <FileText />
                        <span>Content Generation</span>
                        <ChevronDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                        <SidebarMenuSubItem>
                            <SidebarMenuSubButton>
                                <Sparkles />
                                <span>One Click Writer</span>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                             <SidebarMenuSubButton>
                                <Video/>
                                <span>Video to Blog Post</span>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                         <SidebarMenuSubItem>
                            <SidebarMenuSubButton>
                                <FileText />
                                <span>News Writer</span>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                         <SidebarMenuSubItem>
                            <SidebarMenuSubButton>
                                <Layers/>
                                <span>Bulk Generation</span>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                         <SidebarMenuSubItem>
                            <SidebarMenuSubButton>
                                <RefreshCcw/>
                                <span>Bulk Content Refresh</span>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    </SidebarMenuSub>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Library />
                    <span>Library</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton href="/ai-tools">
                    <Bot />
                    <span>All Tools</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu className="p-2">
                 <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings />
                    <span>Account & Billing</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <HelpCircle />
                    <span>Help</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
           </SidebarMenu>
           <div className="p-2">
            <Card className="bg-primary/10 border-primary/50">
                <CardHeader>
                    <CardTitle className="text-base">Upgrade to Pro</CardTitle>
                    <CardDescription className="text-xs">Unlock all features and get unlimited access.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button size="sm" className="w-full">Upgrade</Button>
                </CardContent>
            </Card>
           </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b px-6">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden"/>
                <h2 className="text-lg font-semibold">Dashboard</h2>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                    <Coins className="mr-2 size-4"/>
                    Credits: 5
                </Button>
                <Moon className="size-5" />
                <Avatar className="h-9 w-9">
                    <AvatarImage src="https://placehold.co/40x40.png" alt="@mojib" data-ai-hint="man portrait"/>
                    <AvatarFallback>M</AvatarFallback>
                </Avatar>
            </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-muted/50">
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
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
