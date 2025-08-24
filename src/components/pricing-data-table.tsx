
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Pen, Trash, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { PricingPlan } from "@/services/pricing-service";
import { PricingDialog } from "./pricing-dialog";

type PricingDataTableProps = {
  initialPlans: PricingPlan[];
};

export default function PricingDataTable({ initialPlans }: PricingDataTableProps) {
  const [plans, setPlans] = useState<PricingPlan[]>(initialPlans);
  const [filter, setFilter] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setPlans(initialPlans);
  }, [initialPlans]);

  const handleEdit = (plan: PricingPlan) => {
    setEditingPlan(plan);
    setIsDialogOpen(true);
  };
  
  const handleAdd = () => {
    setEditingPlan(null);
    setIsDialogOpen(true);
  }

  const handleDialogSave = (savedPlan: PricingPlan) => {
    if (editingPlan) {
      setPlans(plans.map(p => p.id === savedPlan.id ? savedPlan : p));
    } else {
      setPlans([...plans, savedPlan]);
    }
    setIsDialogOpen(false);
  }

  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Filter plans by name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleAdd}>
            <PlusCircle className="mr-2"/>
            Add New Plan
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Popular</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell>৳{plan.price}</TableCell>
                <TableCell>{plan.credits}</TableCell>
                <TableCell>
                  {plan.isPopular ? <Badge>Yes</Badge> : <Badge variant="secondary">No</Badge>}
                </TableCell>
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
                      <DropdownMenuItem onClick={() => handleEdit(plan)}>
                        <Pen className="mr-2 h-4 w-4"/>
                        Edit
                      </DropdownMenuItem>
                       <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                         <Trash className="mr-2 h-4 w-4"/>
                         Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <PricingDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        plan={editingPlan}
        onSave={handleDialogSave}
      />
    </div>
  );
}
