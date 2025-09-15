
'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import { getPricingPlans, PricingPlan } from '@/services/pricing-service';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

export default function PricingPage() {
    const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRedirecting, setIsRedirecting] = useState<string | null>(null);
    const { toast } = useToast();
    
    const handleChoosePlan = async (plan: PricingPlan) => {
        if (plan.price === 0) {
            // Handle free plan logic if any
            toast({ title: "You are on the Free Plan!"});
            return;
        }

        setIsRedirecting(plan.id);

        try {
            const response = await axios.post('/api/bkash/payment/create', {
                amount: plan.price,
                planName: plan.name,
            });

            if (response.data.bkashURL) {
                window.location.href = response.data.bkashURL;
            } else {
                throw new Error(response.data.error || 'Failed to get bKash URL');
            }

        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Payment Error',
                description: (error as Error).message || 'Could not initiate payment. Please try again.',
            });
            setIsRedirecting(null);
        }
    }

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const plans = await getPricingPlans();
            setPricingPlans(plans);
            setLoading(false);
        }
        fetchData();
    }, []);


    return (
        <section id="pricing" className="py-8">
          <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto">
                   <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                      Choose Your Plan
                  </h2>
                  <p className="text-lg text-muted-foreground mt-4">
                      Scale with plans designed for creators, marketers, and agencies.
                  </p>
              </div>

               {loading ? (
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-[500px] w-full" />)}
                    </div>
                ) : (
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                    {pricingPlans.map(plan => (
                    <Card key={plan.id} className={`shadow-lg flex flex-col h-full transform hover:-translate-y-2 transition-transform duration-300 ${plan.isPopular ? 'border-2 border-primary' : ''}`}>
                        {plan.isPopular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">MOST POPULAR</Badge>}
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                             <p className="text-muted-foreground pt-2 h-12">{plan.description}</p>
                            <div className="flex items-baseline gap-2 pt-4">
                                <p className="text-4xl font-bold text-primary">৳{plan.price}</p>
                                {plan.originalPrice > plan.price && (
                                    <>
                                        <p className="text-xl font-medium text-muted-foreground line-through">৳{plan.originalPrice}</p>
                                        <Badge variant="destructive">{plan.discount}</Badge>
                                    </>
                                )}
                            </div>
                           
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                            <div className={`p-3 rounded-lg text-center ${plan.isPopular ? 'bg-primary/10' : 'bg-muted'}`}>
                                <p className={`text-lg font-bold ${plan.isPopular ? 'text-primary' : ''}`}>{plan.credits} Credits</p>
                                <p className="text-sm text-muted-foreground">Valid for {plan.validity}</p>
                            </div>
                            <div className="space-y-3 text-sm">
                                {Object.entries(plan.features).map(([category, features]) => (
                                    <div key={category}>
                                        <h4 className="font-semibold text-base pt-2">{category}</h4>
                                        <ul className="space-y-2">
                                            {(features as string[]).map(feature => (
                                                <li key={feature} className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> {feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button size="lg" className="w-full" onClick={() => handleChoosePlan(plan)} disabled={isRedirecting !== null}>
                                {isRedirecting === plan.id ? (
                                    <>
                                        <Sparkles className="mr-2 animate-spin"/> Redirecting...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="mr-2"/> Choose Plan
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                    ))}
                </div>
                )}
          </div>
      </section>
    );
}
