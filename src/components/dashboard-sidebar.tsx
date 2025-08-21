
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
  Bell
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/services/user-service";

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
                 {user?.role === 'admin' && (
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                          <DatabaseZap />
                          <span>Admin</span>
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
                                <SidebarMenuSubButton href="/dashboard/admin/settings">
                                    <Settings />
                                    <span>Settings</span>
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
        <div className="md:hidden">
            <SidebarTrigger />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
