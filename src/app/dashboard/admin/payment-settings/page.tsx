
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, WalletCards, Save } from 'lucide-react';
import { updatePaymentSettingsAction } from './actions';
import { getPaymentMethods } from '@/services/settings-service';
import type { PaymentMethod } from '@/services/settings-service';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Sparkles className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
        </>
      )}
    </Button>
  );
}

export default function PaymentSettingsPage() {
  const { toast } = useToast();
  const [initialState, setInitialState] = useState<{ success: boolean; message: string; methods?: PaymentMethod[] }>({ success: false, message: '' });
  const [state, formAction] = useActionState(updatePaymentSettingsAction, initialState);
  
  useEffect(() => {
    async function fetchInitialState() {
        const methods = await getPaymentMethods();
        setInitialState({ success: false, message: '', methods });
    }
    fetchInitialState();
  }, []);

  useEffect(() => {
    if (state.message) {
      toast({
        variant: state.success ? 'default' : 'destructive',
        title: state.success ? 'Success' : 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Payment Settings</h1>
        <p className="text-muted-foreground">Manage your manual payment methods.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manual Payment Numbers</CardTitle>
          <CardDescription>
            Update the bKash and Nagad personal numbers that will be displayed to users on the checkout page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6 max-w-lg">
            <div className="space-y-2">
              <Label htmlFor="bkash_number">bKash Number</Label>
              <Input
                id="bkash_number"
                name="bkash_number"
                defaultValue={initialState.methods?.find(m => m.method === 'bKash')?.number}
                placeholder="Enter bKash personal number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nagad_number">Nagad Number</Label>
              <Input
                id="nagad_number"
                name="nagad_number"
                defaultValue={initialState.methods?.find(m => m.method === 'Nagad')?.number}
                placeholder="Enter Nagad personal number"
              />
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
