
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TransactionsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Get transactions from user context
  const transactions = user?.transactions || [];
  
  // Format transaction date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Map transaction types to categories for display purposes
  const getCategoryFromType = (type: string): string => {
    const categories: Record<string, string> = {
      "deposit": "Income",
      "withdrawal": "Expense",
      "payment": "Expense",
      "disbursement": "Income"
    };
    return categories[type] || type;
  };

  // Generate transaction list based on active tab
  const getFilteredTransactions = () => {
    if (activeTab === "all") return transactions;
    if (activeTab === "income") return transactions.filter(t => ["deposit", "disbursement"].includes(t.type));
    if (activeTab === "expense") return transactions.filter(t => ["withdrawal", "payment"].includes(t.type));
    return transactions;
  };

  const filteredTransactions = getFilteredTransactions();
  
  // Sort by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-10 space-y-3">
      <FileText className="h-16 w-16 mx-auto text-gray-300" />
      <p className="text-lg font-medium">No transactions yet</p>
      <p className="text-muted-foreground">Your financial activity will appear here</p>
      <Button variant="outline" asChild className="mt-4">
        <Link to="/loan-applications/new">
          <PlusCircle className="mr-2 h-4 w-4" />
          Apply For Credit
        </Link>
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        <p className="text-muted-foreground">
          View and manage your financial transactions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expense">Expenses</TabsTrigger>
            </TabsList>
            
            {sortedTransactions.length > 0 ? (
              <div className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.description}</TableCell>
                        <TableCell>{formatDate(transaction.date)}</TableCell>
                        <TableCell>{getCategoryFromType(transaction.type)}</TableCell>
                        <TableCell className={`text-right font-medium ${
                          ["deposit", "disbursement"].includes(transaction.type) 
                            ? "text-green-500" 
                            : "text-red-500"
                          }`}
                        >
                          {["deposit", "disbursement"].includes(transaction.type) 
                            ? `+₹${transaction.amount.toLocaleString()}` 
                            : `-₹${Math.abs(transaction.amount).toLocaleString()}`}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <TabsContent value={activeTab} className="mt-0">
                <EmptyState />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
