
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCurrentUser } from "@/services/user-service";
import { CreditCard, Download, PlusCircle, Repeat } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Label } from "@/components/ui/label";

const billingHistory = [
    { date: "2024-07-15", plan: "Beta Plan", amount: "৳1499.00", status: "Paid" },
    { date: "2024-06-15", plan: "Alpha Plan", amount: "৳499.00", status: "Paid" },
    { date: "2024-05-15", plan: "Alpha Plan", amount: "৳499.00", status: "Paid" },
];

export default async function SubscriptionsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    const creditUsagePercentage = (user.credits / 1000) * 100; // Assuming max credits for calculation, this should be dynamic

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Subscription & Billing</h1>
                <p className="text-muted-foreground">
                    Manage your subscription plan, credits, and view your billing history.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Current Plan</CardTitle>
                            <CardDescription>You are currently on the <span className="font-bold text-primary">{user.plan_id}</span> plan.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="credits" className="text-sm font-medium">Credit Usage</Label>
                                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-1">
                                        <span>{user.credits} credits remaining</span>
                                        <span>Renews in 15 days</span>
                                    </div>
                                    <Progress value={creditUsagePercentage} id="credits" />
                                </div>
                                <div className="flex gap-2">
                                    <Button>
                                        <PlusCircle className="mr-2"/>
                                        Buy More Credits
                                    </Button>
                                     <Button variant="outline" asChild>
                                        <Link href="/dashboard/pricing">
                                            <Repeat className="mr-2"/>
                                            Change Plan
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Billing History</CardTitle>
                             <CardDescription>Your past transactions and invoices.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Plan</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Invoice</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {billingHistory.map(item => (
                                        <TableRow key={item.date}>
                                            <TableCell>{item.date}</TableCell>
                                            <TableCell>{item.plan}</TableCell>
                                            <TableCell>{item.amount}</TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="sm">
                                                    <Download className="mr-2"/>
                                                    Download
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                 <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3 p-4 border rounded-md">
                                <CreditCard className="w-8 h-8 text-muted-foreground"/>
                                <div>
                                    <p className="font-semibold">Visa ending in 1234</p>
                                    <p className="text-sm text-muted-foreground">Expires 12/2026</p>
                                </div>
                            </div>
                        </CardContent>
                         <CardFooter>
                            <Button variant="outline">Update Payment Method</Button>
                        </CardFooter>
                    </Card>
                     <Card className="bg-destructive/10 border-destructive/20 text-destructive-foreground">
                        <CardHeader>
                            <CardTitle>Cancel Subscription</CardTitle>
                             <CardDescription className="text-destructive-foreground/80">Canceling will downgrade you to the free plan at the end of your current billing cycle.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="destructive" className="w-full">Cancel My Subscription</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
