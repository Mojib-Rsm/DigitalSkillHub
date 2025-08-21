
import {
  Bot,
  History,
  LayoutGrid,
  Settings,
  HelpCircle,
  Coins,
  DatabaseZap,
  Users
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { getCurrentUser, UserProfile } from "@/services/user-service";
import DashboardSidebar from "@/components/dashboard-sidebar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <DashboardSidebar user={user}>
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-muted/50">
            {children}
        </div>
    </DashboardSidebar>
  );
}
