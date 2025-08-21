
"use client";

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
  LayoutGrid,
  ChevronDown,
  Moon,
  Coins,
  History,
  Shield,
  DatabaseZap
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggleButton } from "@/components/theme-toggle-button";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
                  <SidebarMenuButton href="/dashboard" >
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
                  <SidebarMenuButton href="/dashboard/history">
                    <History />
                    <span>History</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton href="/ai-tools">
                    <Bot />
                    <span>All Tools</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                  <SidebarMenuButton href="/dashboard/admin/seed-data">
                    <DatabaseZap />
                    <span>Admin</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu className="p-2">
                 <SidebarMenuItem>
                  <SidebarMenuButton href="/dashboard/pricing">
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
                    <Button size="sm" className="w-full" asChild>
                        <Link href="/dashboard/pricing">Upgrade</Link>
                    </Button>
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
                <ThemeToggleButton />
                <Avatar className="h-9 w-9">
                    <AvatarImage src="https://placehold.co/40x40.png" alt="@mojib" data-ai-hint="man portrait"/>
                    <AvatarFallback>M</AvatarFallback>
                </Avatar>
            </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-muted/50">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
