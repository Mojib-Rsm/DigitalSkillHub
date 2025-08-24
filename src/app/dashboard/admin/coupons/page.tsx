
import { getCoupons } from "@/services/coupon-service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import CouponDataTable from "@/components/coupon-data-table";

export default async function CouponsAdminPage() {
    const coupons = await getCoupons();
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Admin: Coupon Management</h1>
                <p className="text-muted-foreground">
                    Add, edit, and manage all coupon codes for your application.
                </p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>All Coupons</CardTitle>
                    <CardDescription>
                        A list of all coupons. You can edit, delete, or add new ones here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <CouponDataTable initialCoupons={coupons} />
                </CardContent>
            </Card>
        </div>
    )
}
