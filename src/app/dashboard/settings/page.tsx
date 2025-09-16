
"use client";

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfileAction, changePasswordAction } from './actions';
import { Sparkles, User, Palette, Shield, Star, Award, Phone, Upload, Type, CaseLower, CornerDownLeft, Heart, Image as ImageIcon, CornerDownRight, Link as LinkIcon } from 'lucide-react';
import { getCurrentUser, UserProfile } from '@/services/user-service';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';


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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      toast({
        variant: state.success ? 'default' : 'destructive',
        title: state.success ? 'Success' : 'Error',
        description: state.message,
      });
      if (state.success) {
        setPreviewUrl(null);
        // We might want to reload the page or user data here to show the new image
      }
    }
  }, [state, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const planName = user.plan_id ? user.plan_id.charAt(0).toUpperCase() + user.plan_id.slice(1) : "Free";


  return (
    <form action={formAction}>
       <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label>Profile Picture</Label>
                <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20">
                        <AvatarImage src={previewUrl || user.profile_image} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="photo" className="cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center">
                            <Upload className="mr-2"/> Change Picture
                        </Label>
                        <Input id="photo" name="photo" type="file" className="hidden" onChange={handleFileChange} accept="image/*"/>
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 4MB.</p>
                    </div>
                </div>
            </div>
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
                        <span className="font-semibold">{planName}</span>
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

function BrandingForm() {
  const { toast } = useToast();
  const [color, setColor] = useState("#22A5C1");
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Branding Saved!",
      description: "Your branding settings have been updated.",
    });
    // In a real app, you would send this data to your backend
    console.log({
        primaryColor: color,
    });
  };
  
  return (
    <form onSubmit={handleSaveBranding}>
        <CardContent className="space-y-8">
             <div className="space-y-4 rounded-lg border p-4">
                <h4 className="font-semibold text-lg">Typography</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="headlineFont" className="flex items-center gap-2"><Type/> Headline Font</Label>
                        <Select name="headlineFont" defaultValue="Tiro Bangla">
                            <SelectTrigger id="headlineFont"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Tiro Bangla">Tiro Bangla</SelectItem>
                                <SelectItem value="Poppins">Poppins</SelectItem>
                                <SelectItem value="Montserrat">Montserrat</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bodyFont" className="flex items-center gap-2"><CaseLower/> Body Font</Label>
                        <Select name="bodyFont" defaultValue="Hind Siliguri">
                            <SelectTrigger id="bodyFont"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Hind Siliguri">Hind Siliguri</SelectItem>
                                <SelectItem value="Inter">Inter</SelectItem>
                                <SelectItem value="Roboto">Roboto</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4">
                 <h4 className="font-semibold text-lg">Layout & Appearance</h4>
                <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center gap-2">
                        <Input id="primaryColor" name="primaryColor" value={color} onChange={handleColorChange} className="w-24 p-1"/>
                        <div className="w-10 h-10 rounded-md border" style={{ backgroundColor: color }}></div>
                    </div>
                </div>
            </div>
           
        </CardContent>
        <CardFooter>
            <Button type="submit">Save Branding</Button>
        </CardFooter>
    </form>
  )
}

function WordPressIntegrationForm() {
  const { toast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Connection Saved (Demo)",
      description: "In a real application, your connection details would be securely saved.",
    });
  };
  
  return (
    <form onSubmit={handleSave}>
        <CardContent className="space-y-6">
             <Alert>
                <LinkIcon className="h-4 w-4" />
                <AlertTitle>Important Security Note</AlertTitle>
                <AlertDescription>
                    For security, please use an <a href="https://wordpress.org/documentation/article/application-passwords/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Application Password</a> from your WordPress admin panel instead of your main password. This is a more secure way to connect applications.
                </AlertDescription>
            </Alert>
             <div className="space-y-2">
                <Label htmlFor="wpUrl">WordPress Site URL</Label>
                <Input id="wpUrl" name="wpUrl" placeholder="https://your-website.com" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="wpUsername">WordPress Username</Label>
                <Input id="wpUsername" name="wpUsername" placeholder="Your WordPress admin username" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="wpAppPassword">Application Password</Label>
                <Input id="wpAppPassword" name="wpAppPassword" type="password" placeholder="Enter your application password" />
            </div>
        </CardContent>
        <CardFooter>
            <Button type="submit">Save Connection</Button>
        </CardFooter>
    </form>
  )
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
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="profile"><User className="mr-2"/> Profile</TabsTrigger>
          <TabsTrigger value="security"><Shield className="mr-2"/> Security</TabsTrigger>
          <TabsTrigger value="branding"><Palette className="mr-2"/> Branding</TabsTrigger>
          <TabsTrigger value="integrations"><LinkIcon className="mr-2"/> Integrations</TabsTrigger>
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
            <BrandingForm/>
          </Card>
        </TabsContent>
        <TabsContent value="integrations">
           <Card>
            <CardHeader>
              <CardTitle>WordPress Integration</CardTitle>
              <CardDescription>Connect your WordPress site to automatically post generated content.</CardDescription>
            </CardHeader>
            <WordPressIntegrationForm/>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    