

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
import { saveToolAction } from "@/app/dashboard/admin/tools/actions";
import { Sparkles } from "lucide-react";
import type { Tool } from "@/lib/demo-data";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";


const toolSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  href: z.string().startsWith('/', "Href must start with a '/'. example: /ai-tools/my-tool"),
  icon: z.string().min(1, "Icon name is required."),
  category: z.string().min(3, "Category is required."),
  enabled: z.boolean(),
  isFree: z.boolean(),
  credits: z.coerce.number().min(0, "Credits cannot be negative.").default(0),
});

type ToolFormValues = z.infer<typeof toolSchema>;

type ToolDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  tool: Tool | null;
  onSave: (tool: Tool) => void;
};

export function ToolDialog({ isOpen, setIsOpen, tool, onSave }: ToolDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ToolFormValues>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      title: "",
      description: "",
      href: "/ai-tools/",
      icon: "",
      category: "",
      enabled: true,
      isFree: true,
      credits: 0,
    },
  });

  const isFree = form.watch("isFree");

  useEffect(() => {
    if (tool) {
      form.reset(tool);
    } else {
      form.reset({
        title: "", description: "", href: "/ai-tools/", icon: "", category: "", enabled: true, isFree: true, credits: 0,
      });
    }
  }, [tool, form]);

  const onSubmit = async (data: ToolFormValues) => {
    setIsSubmitting(true);
    // If tool is free, credits should be 0
    if (data.isFree) {
        data.credits = 0;
    }

    const result = await saveToolAction(tool ? tool.id : null, data);
    
    if (result.success && result.tool) {
        toast({ title: "Success", description: `Tool ${tool ? 'updated' : 'created'} successfully.` });
        onSave(result.tool);
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
          <DialogTitle>{tool ? "Edit Tool" : "Add New Tool"}</DialogTitle>
          <DialogDescription>
            {tool ? "Update the details for this AI tool." : "Fill in the details for the new AI tool."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">Title</FormLabel>
                            <FormControl className="col-span-3">
                                <Input {...field} />
                            </FormControl>
                            <FormMessage className="col-span-4 pl-[calc(25%+1rem)]"/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-start gap-4">
                            <FormLabel className="text-right pt-2">Description</FormLabel>
                            <FormControl className="col-span-3">
                                <Textarea {...field} rows={3}/>
                            </FormControl>
                             <FormMessage className="col-span-4 pl-[calc(25%+1rem)]"/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="href"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">URL (href)</FormLabel>
                            <FormControl className="col-span-3">
                                <Input {...field} />
                            </FormControl>
                            <FormMessage className="col-span-4 pl-[calc(25%+1rem)]"/>
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">Icon</FormLabel>
                            <FormControl className="col-span-3">
                                <Input {...field} placeholder="e.g., PenSquare"/>
                            </FormControl>
                            <FormMessage className="col-span-4 pl-[calc(25%+1rem)]"/>
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">Category</FormLabel>
                            <FormControl className="col-span-3">
                                <Input {...field} placeholder="e.g., Content & Writing" />
                            </FormControl>
                            <FormMessage className="col-span-4 pl-[calc(25%+1rem)]"/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="isFree"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">Pricing</FormLabel>
                             <FormControl className="col-span-3">
                                <RadioGroup
                                    onValueChange={(value) => field.onChange(value === "true")}
                                    defaultValue={String(field.value)}
                                    className="flex items-center space-x-4"
                                >
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <RadioGroupItem value="true" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Free</FormLabel>
                                    </FormItem>
                                     <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <RadioGroupItem value="false" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Paid (Credits)</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                        </FormItem>
                    )}
                />
                {!isFree && (
                    <FormField
                        control={form.control}
                        name="credits"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-4 items-center gap-4">
                                <FormLabel className="text-right">Credit Cost</FormLabel>
                                <FormControl className="col-span-3">
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage className="col-span-4 pl-[calc(25%+1rem)]"/>
                            </FormItem>
                        )}
                    />
                )}
                 <FormField
                    control={form.control}
                    name="enabled"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-center gap-4 pt-4">
                            <FormLabel>Enabled</FormLabel>
                            <FormControl>
                               <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                         {isSubmitting && <Sparkles className="mr-2 h-4 w-4 animate-spin" />}
                         {tool ? 'Save Changes' : 'Create Tool'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
