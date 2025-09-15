
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TransactionsDataTable from "@/components/transactions-data-table";

// This would typically come from your database
const transactions = [
    {
        id: "txn_1",
        user: "Olivia Martin",
        email: "olivia.martin@email.com",
        plan: "Beta Plan",
        amount: "৳1499.00",
        date: "2024-07-15",
        status: "Paid",
        method: "bKash"
    },
    {
        id: "txn_2",
        user: "Jackson Lee",
        email: "jackson.lee@email.com",
        plan: "Alpha Plan",
        amount: "৳499.00",
        date: "2024-07-14",
        status: "Paid",
        method: "Nagad"
    },
     {
        id: "txn_3",
        user: "User Two",
        email: "user.two@email.com",
        plan: "Sigma Plan",
        amount: "৳4999.00",
        date: "2024-07-14",
        status: "Pending",
        method: "Manual"
    },
    {
        id: "txn_4",
        user: "Isabella Nguyen",
        email: "isabella.nguyen@email.com",
        plan: "Beta Plan",
        amount: "৳1499.00",
        date: "2024-07-13",
        status: "Paid",
        method: "bKash"
    },
     {
        id: "txn_5",
        user: "User Three",
        email: "user.three@email.com",
        plan: "Alpha Plan",
        amount: "৳499.00",
        date: "2024-07-12",
        status: "Failed",
        method: "bKash"
    },
];

export default async function TransactionsPage() {

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Admin: Transactions</h1>
                <p className="text-muted-foreground">
                    View and manage all payments and transactions.
                </p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>All Transactions</CardTitle>
                    <CardDescription>
                        A list of all transactions. You can approve, reject, or refund payments here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <TransactionsDataTable initialTransactions={transactions} />
                </CardContent>
            </Card>
        </div>
    )
}
