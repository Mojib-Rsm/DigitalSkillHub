
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
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";
import type { Testimonial } from "@/services/testimonial-service";
import { saveTestimonialAction } from "@/app/dashboard/admin/testimonials/actions";

const testimonialSchema = z.object({
  feature: z.string().min(3, "Feature must be at least 3 characters."),
  quote: z.string().min(10, "Quote must be at least 10 characters."),
  metric: z.string().min(3, "Metric must be at least 3 characters."),
  authorName: z.string().min(3, "Author name is required."),
  authorRole: z.string().min(3, "Author role is required."),
  avatar: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
  dataAiHint: z.string().optional(),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

type TestimonialDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  testimonial: Testimonial | null;
  onSave: (testimonial: Testimonial) => void;
};

export function TestimonialDialog({ isOpen, setIsOpen, testimonial, onSave }: TestimonialDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: testimonial || {
      feature: "",
      quote: "",
      metric: "",
      authorName: "",
      authorRole: "",
      avatar: "",
      dataAiHint: "",
    },
  });

  useEffect(() => {
    if (testimonial) {
      form.reset(testimonial);
    } else {
      form.reset({
        feature: "", quote: "", metric: "", authorName: "", authorRole: "", avatar: "", dataAiHint: "",
      });
    }
  }, [testimonial, form]);

  const onSubmit = async (data: TestimonialFormValues) => {
    setIsSubmitting(true);
    const result = await saveTestimonialAction(testimonial ? testimonial.id : null, data);
    
    if (result.success && result.testimonial) {
        toast({ title: "Success", description: `Testimonial ${testimonial ? 'updated' : 'created'} successfully.` });
        onSave(result.testimonial);
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
          <DialogTitle>{testimonial ? "Edit Testimonial" : "Add New Testimonial"}</DialogTitle>
          <DialogDescription>
            {testimonial ? "Update the details for this testimonial." : "Fill in the details for the new testimonial."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[80vh] overflow-y-auto pr-2">
                <FormField name="feature" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Feature</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                )}/>
                 <FormField name="quote" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Quote</FormLabel><FormControl><Textarea {...field} rows={4} /></FormControl><FormMessage/></FormItem>
                )}/>
                 <FormField name="metric" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Key Metric</FormLabel><FormControl><Input {...field} placeholder="e.g., 300% engagement boost" /></FormControl><FormMessage/></FormItem>
                )}/>
                <div className="grid grid-cols-2 gap-4">
                    <FormField name="authorName" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Author Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                    )}/>
                    <FormField name="authorRole" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Author Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                    )}/>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField name="avatar" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Avatar URL</FormLabel><FormControl><Input {...field} placeholder="https://placehold.co/40x40.png" /></FormControl><FormMessage/></FormItem>
                    )}/>
                    <FormField name="dataAiHint" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>AI Hint for Image</FormLabel><FormControl><Input {...field} placeholder="e.g., man portrait" /></FormControl><FormMessage/></FormItem>
                    )}/>
                </div>
               
                <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                         {isSubmitting && <Sparkles className="mr-2 h-4 w-4 animate-spin" />}
                         {testimonial ? 'Save Changes' : 'Create Testimonial'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
