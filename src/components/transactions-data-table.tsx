
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
import { MoreHorizontal, Check, X, RefreshCw, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

type Transaction = {
    id: string;
    user: string;
    email: string;
    plan: string;
    amount: string;
    date: string;
    status: "Paid" | "Pending" | "Failed";
    method: "bKash" | "Nagad" | "Manual";
};

type TransactionsDataTableProps = {
  initialTransactions: Transaction[];
};

const statusVariantMap = {
    "Paid": "default",
    "Pending": "secondary",
    "Failed": "destructive",
} as const;


export default function TransactionsDataTable({ initialTransactions }: TransactionsDataTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [filter, setFilter] = useState("");
  const { toast } = useToast();

  const handleAction = (transactionId: string, action: "approve" | "reject" | "refund") => {
      // In a real app, this would call a server action
      toast({
          title: "Action Simulated",
          description: `Transaction ${transactionId} has been marked for ${action}.`
      })
  }

  const filteredTransactions = transactions.filter(txn =>
    txn.user.toLowerCase().includes(filter.toLowerCase()) ||
    txn.email.toLowerCase().includes(filter.toLowerCase()) ||
    txn.plan.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Filter by user, email, or plan..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline">
            <Download className="mr-2"/>
            Export CSV
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((txn) => (
              <TableRow key={txn.id}>
                <TableCell className="font-medium">
                    <div>{txn.user}</div>
                    <div className="text-xs text-muted-foreground">{txn.email}</div>
                </TableCell>
                <TableCell>{txn.plan}</TableCell>
                <TableCell>{txn.amount}</TableCell>
                <TableCell>{txn.date}</TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Image src={`/${txn.method}-Logo.png`} alt={txn.method} width={40} height={16}/>
                    </div>
                </TableCell>
                <TableCell>
                    <Badge variant={statusVariantMap[txn.status]}>{txn.status}</Badge>
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
                      {txn.status === "Pending" && (
                          <>
                            <DropdownMenuItem onClick={() => handleAction(txn.id, 'approve')}>
                                <Check className="mr-2 h-4 w-4"/>
                                Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction(txn.id, 'reject')} className="text-destructive">
                                <X className="mr-2 h-4 w-4"/>
                                Reject
                            </DropdownMenuItem>
                          </>
                      )}
                       {txn.status === "Paid" && (
                           <DropdownMenuItem onClick={() => handleAction(txn.id, 'refund')} className="text-destructive">
                             <RefreshCw className="mr-2 h-4 w-4"/>
                             Refund
                          </DropdownMenuItem>
                       )}
                       {txn.status !== "Pending" && txn.status !== "Paid" && <DropdownMenuItem disabled>No actions</DropdownMenuItem>}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
