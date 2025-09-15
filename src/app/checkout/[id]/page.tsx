
import { getPricingPlanById } from "@/services/pricing-service";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CheckoutForm from "@/components/checkout-form";
import { Badge } from "@/components/ui/badge";

export default async function CheckoutPage({ params }: { params: { id: string } }) {
    const plan = await getPricingPlanById(params.id);

    if (!plan) {
        notFound();
    }

    const paymentMethods = [
        { method: "bKash", type: "Personal", number: "01800000000" },
        { method: "Nagad", type: "Personal", number: "01900000000" },
    ]

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <h1 className="text-3xl font-bold font-headline mb-4">Complete Your Purchase</h1>
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Plan:</span>
                                <span className="font-semibold">{plan.name}</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Credits:</span>
                                <span className="font-semibold">{plan.credits}</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Validity:</span>
                                <span className="font-semibold">{plan.validity}</span>
                            </div>
                            <Separator/>
                            <div className="flex justify-between items-center text-xl">
                                <span className="font-bold">Total Amount:</span>
                                <span className="font-bold text-primary">৳{plan.price}</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Payment Instructions</CardTitle>
                             <CardDescription>Follow these steps to complete your payment.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>1. Choose a payment method below and use the "Send Money" option.</p>
                            <div className="space-y-3">
                                {paymentMethods.map(method => (
                                    <div key={method.method} className="flex justify-between items-center p-3 rounded-md bg-muted">
                                        <div>
                                            <p className="font-bold">{method.method} <Badge variant="secondary">{method.type}</Badge></p>
                                            <p className="text-lg font-mono text-primary">{method.number}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p>2. Enter <strong className="text-primary">৳{plan.price}</strong> as the amount.</p>
                            <p>3. After sending the money, save the <strong className="text-primary">Transaction ID</strong>.</p>
                            <p>4. Fill out the form on the right with your payment details and submit it for verification.</p>
                        </CardContent>
                    </Card>
                </div>
                 <div>
                    <CheckoutForm planId={plan.id} amount={plan.price} />
                </div>
            </div>
        </div>
    );
}

