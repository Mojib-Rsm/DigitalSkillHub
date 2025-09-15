

import { getCurrentUser } from '@/services/user-service';
import UserDashboard from '@/components/user-dashboard';

export default async function UserDashboardPage() {
    const user = await getCurrentUser();

    if (!user) {
        // This case should be handled by middleware, but it's a good safeguard
        return <p>Please log in to view your dashboard.</p>;
    }

    return <UserDashboard user={user} />;
}
