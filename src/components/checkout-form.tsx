
'use client';

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { submitPaymentProofAction } from "@/app/checkout/actions";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { CheckCircle, Sparkles, Upload } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          Submitting...
        </>
      ) : (
        <>
          Submit for Verification
        </>
      )}
    </Button>
  );
}

type CheckoutFormProps = {
    planId: string;
    amount: number;
}

export default function CheckoutForm({ planId, amount }: CheckoutFormProps) {
    const initialState = { success: false, message: "" };
    const [state, formAction] = useActionState(submitPaymentProofAction, initialState);
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (state.message) {
            toast({
                variant: state.success ? "default" : "destructive",
                title: state.success ? "Success" : "Error",
                description: state.message,
            });
            if (state.success) {
                formRef.current?.reset();
            }
        }
    }, [state, toast]);


    return (
         <Card>
            <CardHeader>
                <CardTitle>Submit Payment Proof</CardTitle>
                <CardDescription>
                    Fill in the details below after you have sent the money.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {state.success ? (
                    <Alert>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <AlertTitle>Submission Successful!</AlertTitle>
                        <AlertDescription>
                            {state.message} Your account will be updated after verification.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <form ref={formRef} action={formAction} className="space-y-6">
                        <input type="hidden" name="planId" value={planId} />
                        <input type="hidden" name="amount" value={amount} />
                        
                        <div className="space-y-2">
                            <Label>Payment Method</Label>
                            <RadioGroup name="paymentMethod" defaultValue="bKash" className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="bKash" id="bkash" />
                                    <Label htmlFor="bkash">bKash</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Nagad" id="nagad" />
                                    <Label htmlFor="nagad">Nagad</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="senderNumber">Your Phone Number</Label>
                            <Input id="senderNumber" name="senderNumber" placeholder="The number you sent money from" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="transactionId">Transaction ID (TrxID)</Label>
                            <Input id="transactionId" name="transactionId" placeholder="e.g., 9A4B8C1D3E" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="screenshot">Payment Screenshot (Optional)</Label>
                            <Input id="screenshot" name="screenshot" type="file" accept="image/*" className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                        </div>

                         {!state.success && state.message && (
                            <Alert variant="destructive">
                                <AlertDescription>{state.message}</AlertDescription>
                            </Alert>
                        )}
                        
                        <SubmitButton />
                    </form>
                )}
            </CardContent>
        </Card>
    )
}
