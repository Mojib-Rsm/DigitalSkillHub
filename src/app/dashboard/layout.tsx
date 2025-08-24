import DashboardSidebar from "@/components/dashboard-sidebar";
import { getCurrentUser } from "@/services/user-service";
import { redirect } from "next/navigation";


export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    // This should theoretically be caught by middleware, but it's a good safeguard.
    redirect('/login');
  }

  return (
    <DashboardSidebar user={user}>
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-muted/50">
            {children}
        </main>
    </DashboardSidebar>
  );
}
