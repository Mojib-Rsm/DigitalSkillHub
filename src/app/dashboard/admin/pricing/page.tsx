
import { getPricingPlans } from "@/services/pricing-service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import PricingDataTable from "@/components/pricing-data-table";

export default async function PricingAdminPage() {
    const plans = await getPricingPlans();
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Admin: Pricing Plan Management</h1>
                <p className="text-muted-foreground">
                    Add, edit, and manage all pricing plans for your application.
                </p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>All Pricing Plans</CardTitle>
                    <CardDescription>
                        A list of all pricing plans. You can edit them or add new ones here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <PricingDataTable initialPlans={plans} />
                </CardContent>
            </Card>
        </div>
    )
}
