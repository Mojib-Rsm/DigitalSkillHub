
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
import { MoreHorizontal, PlusCircle, Pen, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Coupon } from "@/services/coupon-service";
import { CouponDialog } from "./coupon-dialog";
import { deleteCouponAction } from "@/app/dashboard/admin/coupons/actions";
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
} from "@/components/ui/alert-dialog"

type CouponDataTableProps = {
  initialCoupons: Coupon[];
};

export default function CouponDataTable({ initialCoupons }: CouponDataTableProps) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [filter, setFilter] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setCoupons(initialCoupons);
  }, [initialCoupons]);

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setIsDialogOpen(true);
  };
  
  const handleAdd = () => {
    setEditingCoupon(null);
    setIsDialogOpen(true);
  }

  const handleDelete = async (couponId: string) => {
    const result = await deleteCouponAction(couponId);
    if(result.success) {
      setCoupons(coupons.filter(c => c.id !== couponId));
      toast({ title: "Success", description: result.message });
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  }

  const handleDialogSave = (savedCoupon: Coupon) => {
    if (editingCoupon) {
      setCoupons(coupons.map(c => c.id === savedCoupon.id ? savedCoupon : c));
    } else {
      setCoupons([...coupons, savedCoupon]);
    }
    setIsDialogOpen(false);
  }

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(filter.toLowerCase()) ||
    coupon.description?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Filter coupons by code or description..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleAdd}>
            <PlusCircle className="mr-2"/>
            Add New Coupon
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCoupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="font-medium">
                  <Badge variant="outline">{coupon.code}</Badge>
                </TableCell>
                <TableCell>{coupon.discountPercentage}%</TableCell>
                <TableCell>{coupon.description}</TableCell>
                <TableCell>
                  {coupon.isActive ? <Badge>Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
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
                      <DropdownMenuItem onClick={() => handleEdit(coupon)}>
                        <Pen className="mr-2 h-4 w-4"/>
                        Edit
                      </DropdownMenuItem>
                       <DropdownMenuSeparator />
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive">
                                <Trash className="mr-2 h-4 w-4"/>
                                Delete
                            </div>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the coupon <span className="font-bold">{coupon.code}</span>.
                              </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(coupon.id)}>Continue</AlertDialogAction>
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
      <CouponDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        coupon={editingCoupon}
        onSave={handleDialogSave}
      />
    </div>
  );
}
