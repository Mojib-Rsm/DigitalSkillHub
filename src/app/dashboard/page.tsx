
import { getCurrentUser, UserProfile } from "@/services/user-service";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import AdminDashboard from "@/components/admin-dashboard";
import UserDashboard from "@/components/user-dashboard";
import { Button } from "@/components/ui/button";


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
