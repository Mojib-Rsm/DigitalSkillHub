

import {
  Coins
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { getCurrentUser } from "@/services/user-service";
import DashboardSidebar from "@/components/dashboard-sidebar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <DashboardSidebar user={user}>
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-muted/50">
            {children}
        </main>
    </DashboardSidebar>
  );
}
