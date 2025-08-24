
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCurrentUser } from "@/services/user-service";
import { CreditCard, Download, PlusCircle, Repeat } from "lucide-react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import type { UserProfile } from "@/services/user-service";
import Image from "next/image";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Extend jsPDF with autoTable
interface jsPDFWithAutoTable extends jsPDF {
    autoTable: (options: any) => jsPDF;
}


const billingHistory = [
    { date: "2024-07-15", plan: "Beta Plan", amount: "৳1499.00", status: "Paid", invoiceId: "INV-20240715" },
    { date: "2024-06-15", plan: "Alpha Plan", amount: "৳499.00", status: "Paid", invoiceId: "INV-20240615" },
    { date: "2024-05-15", plan: "Alpha Plan", amount: "৳499.00", status: "Paid", invoiceId: "INV-20240515" },
];

export default function SubscriptionsPage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await getCurrentUser();
            if (!currentUser) {
                router.push('/login');
            } else {
                setUser(currentUser);
            }
            setLoading(false);
        };
        fetchUser();
    }, [router]);
    
    const handleDownloadInvoice = (invoice: typeof billingHistory[0]) => {
        const doc = new jsPDF() as jsPDFWithAutoTable;

        doc.setFontSize(20);
        doc.text("Invoice", 10, 20);
        
        doc.setFontSize(12);
        doc.text(`Invoice ID: ${invoice.invoiceId}`, 10, 30);
        doc.text(`Date: ${invoice.date}`, 10, 37);
        doc.text(`User: ${user?.name} (${user?.email})`, 10, 44);

        doc.autoTable({
            startY: 60,
            head: [['Description', 'Amount', 'Status']],
            body: [[`Subscription: ${invoice.plan}`, invoice.amount, invoice.status]],
            theme: 'striped',
        });
        
        const finalY = (doc as any).lastAutoTable.finalY;
        doc.setFontSize(10);
        doc.text("Thank you for your business!", 10, finalY + 10);

        doc.save(`Invoice-${invoice.invoiceId}.pdf`);
    };

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return null;
    }

    const creditUsagePercentage = (user.credits / 1000) * 100; // Assuming max credits for calculation, this should be dynamic

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Subscription & Billing</h1>
                <p className="text-muted-foreground">
                    Manage your subscription, credits, and view your billing history.
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
                                                <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(item)}>
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
                             <CardDescription>We support the following payment methods.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center gap-4">
                           <Image src="/Bkash-Logo.png" alt="bKash" width={100} height={40}/>
                           <Image src="/Nagad_Logo.png" alt="Nagad" width={100} height={40}/>
                        </CardContent>
                    </Card>
                     <Card className="bg-destructive text-destructive-foreground">
                        <CardHeader>
                            <CardTitle>Cancel Subscription</CardTitle>
                             <CardDescription className="text-destructive-foreground/80">Canceling will downgrade you to the free plan at the end of your current billing cycle.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="secondary" className="w-full">Cancel My Subscription</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
