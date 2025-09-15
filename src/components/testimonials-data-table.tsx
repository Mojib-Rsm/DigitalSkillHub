
"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Pen, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Testimonial } from "@/services/testimonial-service";
import { TestimonialDialog } from "./testimonial-dialog";
import { deleteTestimonialAction } from "@/app/dashboard/admin/testimonials/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type TestimonialsDataTableProps = {
  initialTestimonials: Testimonial[];
};

export default function TestimonialsDataTable({ initialTestimonials }: TestimonialsDataTableProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [filter, setFilter] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setTestimonials(initialTestimonials);
  }, [initialTestimonials]);

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setIsDialogOpen(true);
  };
  
  const handleAdd = () => {
    setEditingTestimonial(null);
    setIsDialogOpen(true);
  }

  const handleDelete = async (testimonialId: string) => {
    const result = await deleteTestimonialAction(testimonialId);
    if(result.success) {
      setTestimonials(testimonials.filter(t => t.id !== testimonialId));
      toast({ title: "Success", description: result.message });
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  }

  const handleDialogSave = (savedTestimonial: Testimonial) => {
    if (editingTestimonial) {
      setTestimonials(testimonials.map(t => t.id === savedTestimonial.id ? savedTestimonial : t));
    } else {
      setTestimonials([...testimonials, savedTestimonial]);
    }
    setIsDialogOpen(false);
  }

  const filteredTestimonials = testimonials.filter(t =>
    t.authorName.toLowerCase().includes(filter.toLowerCase()) ||
    t.feature.toLowerCase().includes(filter.toLowerCase()) ||
    t.quote.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Filter by author, feature, or quote..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleAdd}>
            <PlusCircle className="mr-2"/>
            Add New Testimonial
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead>Feature</TableHead>
              <TableHead>Quote</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTestimonials.map((testimonial) => (
              <TableRow key={testimonial.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.authorName} />
                      <AvatarFallback>{testimonial.authorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{testimonial.authorName}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.authorRole}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{testimonial.feature}</TableCell>
                <TableCell className="max-w-xs truncate">{testimonial.quote}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(testimonial)}>
                        <Pen className="mr-2 h-4 w-4"/>
                        Edit
                      </DropdownMenuItem>
                       <DropdownMenuSeparator />
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive">
                                <Trash className="mr-2 h-4 w-4"/>
                                Delete
                            </div>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the testimonial by <span className="font-bold">{testimonial.authorName}</span>.
                              </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(testimonial.id)}>Continue</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <TestimonialDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        testimonial={editingTestimonial}
        onSave={handleDialogSave}
      />
    </div>
  );
}
