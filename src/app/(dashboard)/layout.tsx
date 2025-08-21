

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
        <header className="flex h-16 items-center justify-between border-b px-6 bg-background sticky top-0 z-40">
            <div className="flex items-center gap-2">
                {/* Mobile sidebar trigger can go here if needed */}
            </div>
            <div className="flex items-center gap-4 ml-auto">
                <Button variant="outline" size="sm">
                    <Coins className="mr-2 size-4"/>
                    Credits: {user?.credits ?? 0}
                </Button>
                <ThemeToggleButton />
                <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.profile_image || "https://placehold.co/40x40.png"} alt={user?.name || "User"} data-ai-hint="man portrait"/>
                    <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
            </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-muted/50">
            {children}
        </main>
    </DashboardSidebar>
  );
}
