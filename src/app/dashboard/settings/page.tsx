
"use client";

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfileAction, changePasswordAction } from './actions';
import { Sparkles, User, Palette, Shield, Star, Award, Phone } from 'lucide-react';
import { getCurrentUser, UserProfile } from '@/services/user-service';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import * as React from 'react';
import { Badge } from '@/components/ui/badge';

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Sparkles className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}

function ProfileForm({ user }: { user: UserProfile }) {
  const initialState = { success: false, message: '' };
  const [state, formAction] = useActionState(updateUserProfileAction, initialState);
  const { toast } = useToast();

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
    <form action={formAction}>
       <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" defaultValue={user.name} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={user.email} disabled />
            </div>
             <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                 <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="phone" name="phone" type="tel" placeholder="01xxxxxxxxx" defaultValue={(user as any).phone || ''} className="pl-10" />
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Current Plan</Label>
                    <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="font-semibold">{user.plan_id === 'beta' || user.plan_id === 'sigma' ? "Pro" : "Free"}</span>
                        <Badge variant="secondary">{user.plan_id}</Badge>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Credits Remaining</Label>
                     <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        <span className="font-semibold">{user.credits}</span>
                    </div>
                </div>
            </div>
      </CardContent>
      <CardFooter>
        <SubmitButton>Save Changes</SubmitButton>
      </CardFooter>
    </form>
  );
}

function PasswordForm() {
    const initialState = { success: false, message: '' };
    const [state, formAction] = useActionState(changePasswordAction, initialState);
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (state.message) {
            toast({
                variant: state.success ? 'default' : 'destructive',
                title: state.success ? 'Success' : 'Error',
                description: state.message,
            });
            if (state.success) {
                formRef.current?.reset();
            }
        }
    }, [state, toast]);

    return (
        <form ref={formRef} action={formAction}>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" name="currentPassword" type="password" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" name="newPassword" type="password" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" required />
                </div>
                 {(state as any).issues && (
                    <Alert variant="destructive">
                        <AlertDescription>
                            <ul className="list-disc pl-4">
                                {(state as any).issues.map((issue: string) => <li key={issue}>{issue}</li>)}
                            </ul>
                        </AlertDescription>
                    </Alert>
                 )}
                  {state.message && !state.success && !(state as any).issues &&(
                     <Alert variant="destructive">
                        <AlertDescription>{state.message}</AlertDescription>
                    </Alert>
                  )}
            </CardContent>
            <CardFooter>
                <SubmitButton>Change Password</SubmitButton>
            </CardFooter>
        </form>
    );
}


export default function SettingsPage() {
    const [user, setUser] = React.useState<UserProfile | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchUser() {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
            setLoading(false);
        }
        fetchUser();
    }, []);

    if (loading) {
        return <Skeleton className="h-96 w-full" />
    }

    if (!user) {
        return <p>User not found or not authenticated.</p>
    }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application settings.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="profile"><User className="mr-2"/> Profile</TabsTrigger>
          <TabsTrigger value="security"><Shield className="mr-2"/> Security</TabsTrigger>
          <TabsTrigger value="branding" disabled><Palette className="mr-2"/> Branding</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
              <CardDescription>Manage your personal information, plan, and credits.</CardDescription>
            </CardHeader>
            <ProfileForm user={user}/>
          </Card>
        </TabsContent>
         <TabsContent value="security">
           <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password here. Use a strong, unique password.</CardDescription>
            </CardHeader>
            <PasswordForm/>
          </Card>
        </TabsContent>
        <TabsContent value="branding">
           <Card>
            <CardHeader>
              <CardTitle>App Branding</CardTitle>
              <CardDescription>Customize the look and feel of your application.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Branding settings coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
