
"use client";

import {
  Sidebar,
  SidebarProvider,
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
  Settings,
  HelpCircle,
  LayoutGrid,
  ChevronDown,
  History,
  DatabaseZap,
  Users,
  Wrench,
  DollarSign,
  LineChart,
  Bell,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/services/user-service";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function DashboardSidebar({
    children,
    user,
}: {
    children: React.ReactNode;
    user: UserProfile | null;
}) {
  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon">
        <SidebarHeader>
           <SidebarMenuButton href="/" className="h-20 justify-start gap-2 px-4">
              <Bot className="text-primary size-8" />
              <span className="font-bold font-headline text-2xl">TotthoAi</span>
            </SidebarMenuButton>
        </SidebarHeader>
        <SidebarContent className="p-2">
            <SidebarMenu>
                 <SidebarMenuItem>
                  <SidebarMenuButton href="/dashboard" >
                    <LayoutGrid />
                    <span>My Dashboard</span>
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
                            <SidebarMenuSubButton href="/ai-tools/one-click-writer">
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
                 {user?.role === 'admin' && (
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                          <DatabaseZap />
                          <span>Admin Panel</span>
                           <ChevronDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                         <SidebarMenuSub>
                             <SidebarMenuSubItem>
                                <SidebarMenuSubButton href="/dashboard/admin/users">
                                    <Users />
                                    <span>Users</span>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                                <SidebarMenuSubButton href="/dashboard/admin/tools">
                                    <Wrench />
                                    <span>Tool Management</span>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                             <SidebarMenuSubItem>
                                <SidebarMenuSubButton href="/dashboard/pricing">
                                    <DollarSign />
                                    <span>Pricing Plans</span>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                             <SidebarMenuSubItem>
                                <SidebarMenuSubButton href="/dashboard/admin/analytics">
                                    <LineChart />
                                    <span>Analytics</span>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                             <SidebarMenuSubItem>
                                <SidebarMenuSubButton href="/dashboard/admin/notifications">
                                    <Bell />
                                    <span>Notifications</span>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                                <SidebarMenuSubButton href="/dashboard/admin/seed-data">
                                    <DatabaseZap />
                                    <span>Seed Data</span>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        </SidebarMenuSub>
                    </SidebarMenuItem>
                 )}
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            {user && (
                 <div className="p-2">
                    <Card className="bg-muted/50">
                        <CardContent className="p-3 flex items-center gap-3">
                            <Avatar className="size-10">
                                <AvatarImage src={user.profile_image} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="overflow-hidden">
                                <p className="font-semibold truncate">{user.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                        </CardContent>
                    </Card>
                 </div>
            )}
           <SidebarMenu className="p-2">
                 <SidebarMenuItem>
                  <SidebarMenuButton href="/dashboard/pricing">
                    <DollarSign />
                    <span>Account & Billing</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                  <SidebarMenuButton href="/dashboard/settings">
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <HelpCircle />
                    <span>Help</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
