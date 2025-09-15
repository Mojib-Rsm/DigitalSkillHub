"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bot, Sparkles, Image as ImageIcon, Database, User, CheckCircle, ChevronLeft, ChevronRight, Palette, HardDrive, Languages, Shield } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { finishSetupAction } from './actions';
import { useRouter } from 'next/navigation';


const StepIndicator = ({ currentStep }: { currentStep: number }) => {
    const steps = [
        { name: "Welcome", icon: <Bot/> },
        { name: "Config", icon: <Languages/> },
        { name: "Storage", icon: <HardDrive/> },
        { name: "Admin", icon: <Shield/> },
        { name: "Finish", icon: <CheckCircle/> }
    ];

    return (
        <div className="flex items-center justify-center gap-4 md:gap-8">
            {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        currentStep > index + 1 ? 'bg-primary text-primary-foreground' : 
                        currentStep === index + 1 ? 'border-2 border-primary text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                        {currentStep > index + 1 ? <CheckCircle className="w-6 h-6"/> : step.icon}
                    </div>
                    <p className="text-xs font-medium">{step.name}</p>
                </div>
            ))}
        </div>
    );
};

const WelcomeStep = ({ onNext }: { onNext: () => void }) => (
    <div className="text-center">
        <Bot className="h-16 w-16 text-primary mx-auto mb-4"/>
        <h1 className="text-4xl font-bold font-headline">Welcome to TotthoAi</h1>
        <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Easily create passport size photos online with background removal & auto-cropping. Let's get your application set up in a few simple steps.
        </p>
        <Button size="lg" className="mt-8" onClick={onNext}>
            Get Started <ChevronRight className="ml-2"/>
        </Button>
    </div>
);

const BasicConfigStep = ({ data, setData }: {data: any, setData: any}) => (
     <div className="space-y-6">
        <div className="space-y-2">
            <Label>Default Language</Label>
            <Select name="language" value={data.language} onValueChange={(value) => setData({...data, language: value})}>
                <SelectTrigger><SelectValue placeholder="Select a language" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <Label>Default Photo Size Standard</Label>
            <Select name="photo_size" value={data.photo_size} onValueChange={(value) => setData({...data, photo_size: value})}>
                <SelectTrigger><SelectValue placeholder="Select a standard" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="BD">Bangladesh (2" x 2")</SelectItem>
                    <SelectItem value="IN">India (2" x 2")</SelectItem>
                    <SelectItem value="US">USA (2" x 2")</SelectItem>
                    <SelectItem value="EU">European Union (35mm x 45mm)</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <Label>Default Background Color</Label>
            <RadioGroup name="bg_color" value={data.bg_color} onValueChange={(value) => setData({...data, bg_color: value})} className="flex gap-4">
                <div className="flex items-center gap-2">
                    <RadioGroupItem value="white" id="white" /><Label htmlFor="white">White</Label>
                </div>
                 <div className="flex items-center gap-2">
                    <RadioGroupItem value="light_blue" id="light_blue" /><Label htmlFor="light_blue">Light Blue</Label>
                </div>
                 <div className="flex items-center gap-2">
                    <RadioGroupItem value="custom" id="custom" disabled /><Label htmlFor="custom" className="text-muted-foreground">Custom (Soon)</Label>
                </div>
            </RadioGroup>
        </div>
    </div>
);

const StorageStep = ({ data, setData }: {data: any, setData: any}) => {
    const handleSliderChange = (value: number[]) => {
        setData({...data, max_file_size: value[0]});
    }

    const handleCheckboxChange = (checked: boolean, format: string) => {
        let newFormats = [...data.allowed_formats];
        if (checked) {
            newFormats.push(format);
        } else {
            newFormats = newFormats.filter(f => f !== format);
        }
        setData({...data, allowed_formats: newFormats});
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Max Upload File Size: {data.max_file_size}MB</Label>
                <Slider value={[data.max_file_size]} onValueChange={handleSliderChange} max={10} min={1} step={1} />
            </div>
            <div className="space-y-2">
                <Label>Allowed Formats</Label>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="jpeg" checked={data.allowed_formats.includes('JPEG')} onChange={(e) => handleCheckboxChange(e.target.checked, 'JPEG')} />
                        <Label htmlFor="jpeg">JPEG</Label>
                    </div>
                     <div className="flex items-center gap-2">
                        <input type="checkbox" id="png" checked={data.allowed_formats.includes('PNG')} onChange={(e) => handleCheckboxChange(e.target.checked, 'PNG')} />
                        <Label htmlFor="png">PNG</Label>
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <Label>Storage Provider</Label>
                <Select name="storage_provider" value={data.storage_provider} onValueChange={(value) => setData({...data, storage_provider: value})}>
                    <SelectTrigger><SelectValue placeholder="Select a provider" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="local">Local Storage</SelectItem>
                        <SelectItem value="firebase" disabled>Firebase (Coming Soon)</SelectItem>
                        <SelectItem value="aws" disabled>AWS S3 (Coming Soon)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

const AdminStep = ({ data, setData, issues }: {data: any, setData: any, issues: Record<string, string[]>}) => (
    <div className="space-y-4">
        <div className="space-y-1">
            <Label htmlFor="admin_name">Admin Name</Label>
            <Input id="admin_name" value={data.admin_name} onChange={(e) => setData({...data, admin_name: e.target.value})} required/>
            {issues.admin_name && <p className="text-destructive text-xs">{issues.admin_name[0]}</p>}
        </div>
        <div className="space-y-1">
            <Label htmlFor="admin_email">Admin Email</Label>
            <Input id="admin_email" type="email" value={data.admin_email} onChange={(e) => setData({...data, admin_email: e.target.value})} required/>
             {issues.admin_email && <p className="text-destructive text-xs">{issues.admin_email[0]}</p>}
        </div>
        <div className="space-y-1">
            <Label htmlFor="admin_password">Password</Label>
            <Input id="admin_password" type="password" value={data.admin_password} onChange={(e) => setData({...data, admin_password: e.target.value})} required/>
             {issues.admin_password && <p className="text-destructive text-xs">{issues.admin_password[0]}</p>}
        </div>
         <div className="space-y-1">
            <Label htmlFor="confirm_password">Confirm Password</Label>
            <Input id="confirm_password" type="password" value={data.confirm_password} onChange={(e) => setData({...data, confirm_password: e.target.value})} required/>
             {issues.confirm_password && <p className="text-destructive text-xs">{issues.confirm_password[0]}</p>}
        </div>
    </div>
);

const SummaryStep = ({ data }: {data: any}) => (
    <div className="space-y-4">
        <Card>
            <CardHeader><CardTitle>Basic Configuration</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
                <p><strong>Language:</strong> {data.language === 'bn' ? 'বাংলা' : 'English'}</p>
                <p><strong>Photo Size:</strong> {data.photo_size}</p>
                <p><strong>Background Color:</strong> {data.bg_color}</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader><CardTitle>Storage Settings</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
                <p><strong>Max File Size:</strong> {data.max_file_size}MB</p>
                <p><strong>Allowed Formats:</strong> {data.allowed_formats.join(', ')}</p>
                <p><strong>Provider:</strong> {data.storage_provider}</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader><CardTitle>Admin Account</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
                <p><strong>Name:</strong> {data.admin_name}</p>
                <p><strong>Email:</strong> {data.admin_email}</p>
            </CardContent>
        </Card>
    </div>
);


export default function InstallPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formIssues, setFormIssues] = useState<Record<string, string[]>>({});
    const [formData, setFormData] = useState({
        language: 'bn',
        photo_size: 'BD',
        bg_color: 'white',
        max_file_size: 5,
        allowed_formats: ['JPEG', 'PNG'],
        storage_provider: 'local',
        admin_name: '',
        admin_email: '',
        admin_password: '',
        confirm_password: '',
    });
    const { toast } = useToast();
    const router = useRouter();


    const handleNext = () => {
        if (currentStep < 5) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    const handleFinish = async () => {
        setIsSubmitting(true);
        setFormIssues({});
        
        const result = await finishSetupAction(formData);

        if (result.success) {
            toast({
                title: "Setup Complete!",
                description: "Your application is ready. Redirecting to dashboard...",
            });
            router.push('/dashboard');
        } else {
            if(result.issues) {
                setFormIssues(result.issues);
                toast({
                    variant: "destructive",
                    title: "Validation Error",
                    description: "Please check the form for errors.",
                });
                // Go back to the step with the error
                if(result.issues.admin_name || result.issues.admin_email || result.issues.admin_password || result.issues.confirm_password) {
                    setCurrentStep(4);
                }

            } else {
                toast({
                    variant: "destructive",
                    title: "Setup Failed",
                    description: result.message || "An unknown error occurred.",
                });
            }
        }
        setIsSubmitting(false);
    }

    const stepTitles: Record<number, string> = {
        1: "Welcome",
        2: "Basic Configuration",
        3: "Storage & Upload Settings",
        4: "Create Admin Account",
        5: "Final Confirmation"
    }

    return (
        <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
             <div className="w-full max-w-2xl">
                <div className="mb-8">
                    <StepIndicator currentStep={currentStep}/>
                </div>
                 <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl">{stepTitles[currentStep]}</CardTitle>
                    </CardHeader>
                    <CardContent className="min-h-[300px]">
                        {currentStep === 1 && <WelcomeStep onNext={handleNext} />}
                        {currentStep === 2 && <BasicConfigStep data={formData} setData={setFormData} />}
                        {currentStep === 3 && <StorageStep data={formData} setData={setFormData} />}
                        {currentStep === 4 && <AdminStep data={formData} setData={setFormData} issues={formIssues}/>}
                        {currentStep === 5 && <SummaryStep data={formData} />}
                    </CardContent>
                    {currentStep > 1 && (
                         <CardContent>
                             <Separator />
                              <div className="flex justify-between items-center mt-6">
                                <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                                    <ChevronLeft className="mr-2"/> Back
                                </Button>
                                {currentStep < 5 ? (
                                    <Button onClick={handleNext}>
                                        Next <ChevronRight className="ml-2"/>
                                    </Button>
                                ) : (
                                    <Button onClick={handleFinish} disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <><Sparkles className="animate-spin mr-2"/>Finishing...</>
                                        ) : (
                                            <>Finish Setup</>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    );
}