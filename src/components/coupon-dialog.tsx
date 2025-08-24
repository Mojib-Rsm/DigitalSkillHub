
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
import { Sparkles, Ticket } from "lucide-react";
import type { Coupon } from "@/services/coupon-service";
import { saveCouponAction } from "@/app/dashboard/admin/coupons/actions";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const couponSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters.").toUpperCase(),
  description: z.string().optional(),
  discountPercentage: z.coerce.number().min(1, "Discount must be at least 1%").max(100, "Discount cannot exceed 100%"),
  isActive: z.boolean(),
  validUntil: z.date().optional(),
  applicableTo: z.union([z.literal('all'), z.array(z.string())]),
});

type CouponFormValues = z.infer<typeof couponSchema>;

type CouponDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  coupon: Coupon | null;
  onSave: (coupon: Coupon) => void;
};

export function CouponDialog({ isOpen, setIsOpen, coupon, onSave }: CouponDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: coupon || {
      code: "",
      description: "",
      discountPercentage: 10,
      isActive: true,
      applicableTo: 'all',
    },
  });

  useEffect(() => {
    if (coupon) {
      form.reset(coupon);
    } else {
      form.reset({
        code: "", description: "", discountPercentage: 10, isActive: true, applicableTo: 'all'
      });
    }
  }, [coupon, form]);

  const onSubmit = async (data: CouponFormValues) => {
    setIsSubmitting(true);
    const result = await saveCouponAction(coupon ? coupon.id : null, data);
    
    if (result.success && result.coupon) {
        toast({ title: "Success", description: `Coupon ${coupon ? 'updated' : 'created'} successfully.` });
        onSave(result.coupon);
        setIsOpen(false);
    } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{coupon ? "Edit Coupon" : "Add New Coupon"}</DialogTitle>
          <DialogDescription>
            {coupon ? "Update the details for this coupon code." : "Fill in the details for the new coupon code."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[80vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                    <FormField name="code" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Coupon Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                    )}/>
                    <FormField name="discountPercentage" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Discount (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>
                    )}/>
                </div>
                 <FormField name="description" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} placeholder="e.g., Summer Sale Offer" /></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField name="applicableTo" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Applicable To</FormLabel>
                    <FormControl>
                        <RadioGroup
                            onValueChange={(value) => field.onChange(value)}
                            defaultValue={Array.isArray(field.value) ? 'specific' : field.value}
                            className="flex items-center space-x-4"
                        >
                            <FormItem className="flex items-center space-x-2">
                                <FormControl><RadioGroupItem value="all" /></FormControl>
                                <FormLabel className="font-normal">All Tools</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                                <FormControl><RadioGroupItem value="specific" disabled /></FormControl>
                                <FormLabel className="font-normal text-muted-foreground">Specific Tools (Coming Soon)</FormLabel>
                            </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
                )}/>

                 <FormField name="isActive" control={form.control} render={({ field }) => (
                    <FormItem className="flex items-center gap-4 pt-4"><FormLabel>Active</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                )}/>
               
                <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                         {isSubmitting && <Sparkles className="mr-2 h-4 w-4 animate-spin" />}
                         {coupon ? 'Save Changes' : 'Create Coupon'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
