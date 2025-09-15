
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, X } from "lucide-react";
import type { PricingPlan } from "@/services/pricing-service";
import { savePricingPlanAction } from "@/app/dashboard/admin/pricing/actions";

const pricingPlanSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().min(0, "Price cannot be negative."),
  originalPrice: z.coerce.number().min(0, "Original Price cannot be negative."),
  discount: z.string().optional(),
  credits: z.coerce.number().min(1, "Credits must be at least 1."),
  validity: z.string().min(3, "Validity is required."),
  isPopular: z.boolean(),
  features: z.object({
      "Core Features": z.array(z.string()).min(1, "At least one core feature is required."),
      "Advanced Features": z.array(z.string()).optional(),
      "Premium Features": z.array(z.string()).optional(),
  })
});

type PlanFormValues = z.infer<typeof pricingPlanSchema>;

type PricingDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  plan: PricingPlan | null;
  onSave: (plan: PricingPlan) => void;
};

const FeatureInput = ({ field, title }: { field: any, title: string }) => {
  const [features, setFeatures] = useState<string[]>(field.value || []);
  
  const handleAddFeature = () => {
    setFeatures([...features, '']);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
    field.onChange(newFeatures);
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
    field.onChange(newFeatures);
  };

  useEffect(() => {
    field.onChange(features);
  }, [features, field]);

  return (
    <div className="col-span-4 space-y-2">
      <Label>{title}</Label>
      {features.map((feature, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} />
          <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveFeature(index)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={handleAddFeature}>Add Feature</Button>
    </div>
  );
};


export function PricingDialog({ isOpen, setIsOpen, plan, onSave }: PricingDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<PlanFormValues>({
    resolver: zodResolver(pricingPlanSchema),
    defaultValues: plan || {
      name: "",
      description: "",
      price: 0,
      originalPrice: 0,
      discount: "",
      credits: 0,
      validity: "",
      isPopular: false,
      features: { "Core Features": [""] },
    },
  });

  useEffect(() => {
    if (plan) {
      form.reset(plan);
    } else {
      form.reset({
        name: "", description: "", price: 0, originalPrice: 0, discount: "", credits: 0, validity: "", isPopular: false, features: { "Core Features": [""] }
      });
    }
  }, [plan, form]);

  const onSubmit = async (data: PlanFormValues) => {
    setIsSubmitting(true);
    const result = await savePricingPlanAction(plan ? plan.id : null, data);
    
    if (result.success && result.plan) {
        toast({ title: "Success", description: `Plan ${plan ? 'updated' : 'created'} successfully.` });
        onSave(result.plan);
        setIsOpen(false);
    } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{plan ? "Edit Plan" : "Add New Plan"}</DialogTitle>
          <DialogDescription>
            {plan ? "Update the details for this pricing plan." : "Fill in the details for the new pricing plan."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[80vh] overflow-y-auto pr-2">
                <FormField name="name" control={form.control} render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4"><FormLabel className="text-right">Name</FormLabel><FormControl className="col-span-3"><Input {...field} /></FormControl><FormMessage className="col-span-4 pl-[calc(25%+1rem)]"/></FormItem>
                )}/>
                 <FormField name="description" control={form.control} render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4"><FormLabel className="text-right">Description</FormLabel><FormControl className="col-span-3"><Textarea {...field} /></FormControl><FormMessage className="col-span-4 pl-[calc(25%+1rem)]"/></FormItem>
                )}/>
                <div className="grid grid-cols-4 gap-4">
                     <FormField name="price" control={form.control} render={({ field }) => (
                        <FormItem className="col-span-2 space-y-2"><FormLabel>Price (BDT)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>
                    )}/>
                     <FormField name="originalPrice" control={form.control} render={({ field }) => (
                        <FormItem className="col-span-2 space-y-2"><FormLabel>Original Price</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>
                    )}/>
                </div>
                 <div className="grid grid-cols-4 gap-4">
                     <FormField name="discount" control={form.control} render={({ field }) => (
                        <FormItem className="col-span-2 space-y-2"><FormLabel>Discount</FormLabel><FormControl><Input {...field} placeholder="e.g. 25% OFF" /></FormControl><FormMessage/></FormItem>
                    )}/>
                     <FormField name="credits" control={form.control} render={({ field }) => (
                        <FormItem className="col-span-2 space-y-2"><FormLabel>Credits</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>
                    )}/>
                </div>
                <FormField name="validity" control={form.control} render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4"><FormLabel className="text-right">Validity</FormLabel><FormControl className="col-span-3"><Input {...field} placeholder="e.g. 1 Month" /></FormControl><FormMessage className="col-span-4 pl-[calc(25%+1rem)]"/></FormItem>
                )}/>
                 <FormField name="isPopular" control={form.control} render={({ field }) => (
                    <FormItem className="flex items-center justify-center gap-4 pt-4"><FormLabel>Mark as Popular</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                )}/>
                <FormField name="features.Core Features" control={form.control} render={({ field }) => <FeatureInput field={field} title="Core Features" />} />
                <FormField name="features.Advanced Features" control={form.control} render={({ field }) => <FeatureInput field={field} title="Advanced Features" />} />
                <FormField name="features.Premium Features" control={form.control} render={({ field }) => <FeatureInput field={field} title="Premium Features" />} />

                <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                         {isSubmitting && <Sparkles className="mr-2 h-4 w-4 animate-spin" />}
                         {plan ? 'Save Changes' : 'Create Plan'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
