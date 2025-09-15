
'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getPricingPlanById, PricingPlan } from '@/services/pricing-service';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Sparkles, Loader, ArrowLeft } from "lucide-react";
import Link from 'next/link';

export default function PlanDetailsPage() {
    const params = useParams();
    const { id } = params;
    const [plan, setPlan] = useState<PricingPlan | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof id === 'string') {
            const fetchPlan = async () => {
                setLoading(true);
                const fetchedPlan = await getPricingPlanById(id);
                setPlan(fetchedPlan);
                setLoading(false);
            };
            fetchPlan();
        }
    }, [id]);


    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
                <Loader className="w-16 h-16 text-primary animate-spin" />
            </div>
        )
    }

    if (!plan) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12">
             <div className="mb-8">
                <Button variant="outline" asChild>
                    <Link href="/dashboard/pricing"><ArrowLeft className="mr-2"/> Back to All Plans</Link>
                </Button>
            </div>
             <Card className="max-w-2xl mx-auto shadow-lg">
                {plan.isPopular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">MOST POPULAR</Badge>}
                <CardHeader className="text-center">
                    <CardTitle className="text-4xl font-bold font-headline">{plan.name}</CardTitle>
                    <CardDescription className="text-lg">{plan.description}</CardDescription>
                    <div className="flex items-baseline justify-center gap-2 pt-4">
                        <p className="text-5xl font-bold text-primary">৳{plan.price}</p>
                        {plan.originalPrice > plan.price && (
                            <>
                                <p className="text-2xl font-medium text-muted-foreground line-through">৳{plan.originalPrice}</p>
                                <Badge variant="destructive">{plan.discount}</Badge>
                            </>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className={`p-4 rounded-lg text-center ${plan.isPopular ? 'bg-primary/10' : 'bg-muted'}`}>
                        <p className={`text-2xl font-bold ${plan.isPopular ? 'text-primary' : ''}`}>{plan.credits} Credits</p>
                        <p className="text-md text-muted-foreground">Valid for {plan.validity}</p>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(plan.features).map(([category, features]) => (
                            <div key={category}>
                                <h4 className="font-semibold text-xl pt-2">{category}</h4>
                                <ul className="space-y-2 mt-2">
                                    {(features as string[]).map(feature => (
                                        <li key={feature} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-green-500 mt-1 shrink-0" /> 
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button size="lg" className="w-full text-lg" asChild>
                         <Link href={`/checkout/${plan.id}`}>
                            <Zap className="mr-2"/> Proceed to Payment
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
