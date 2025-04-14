
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TransactionsPage: React.FC = () => {
  // Mock transaction data - in a real app, this would come from an API
  const transactions = [
    { id: 1, description: "Farm Equipment Purchase", amount: -15000, date: "Apr 12, 2025", category: "Equipment", type: "expense" },
    { id: 2, description: "Crop Sale - Wheat", amount: 45000, date: "Apr 8, 2025", category: "Sales", type: "income" },
    { id: 3, description: "Loan Disbursement", amount: 50000, date: "Apr 5, 2025", category: "Loan", type: "income" },
    { id: 4, description: "Seed Purchase", amount: -8000, date: "Apr 2, 2025", category: "Supplies", type: "expense" },
    { id: 5, description: "Fertilizer Purchase", amount: -6500, date: "Mar 28, 2025", category: "Supplies", type: "expense" },
    { id: 6, description: "Loan Repayment", amount: -5000, date: "Mar 25, 2025", category: "Loan", type: "expense" },
  ];

  const renderTransactionList = (transactionType?: string) => {
    const filteredTransactions = transactionType 
      ? transactions.filter(t => t.type === transactionType) 
      : transactions;

    return (
      <div className="space-y-2">
        {filteredTransactions.map(transaction => (
          <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-md bg-white">
            <div className="flex-1">
              <p className="font-medium">{transaction.description}</p>
              <p className="text-sm text-muted-foreground">{transaction.date} • {transaction.category}</p>
            </div>
            <span className={`font-medium ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {transaction.amount > 0 ? `+₹${transaction.amount.toLocaleString()}` : `-₹${Math.abs(transaction.amount).toLocaleString()}`}
            </span>
          </div>
        ))}
      </div>
    );
  };

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
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expense">Expenses</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              {renderTransactionList()}
            </TabsContent>
            <TabsContent value="income" className="mt-4">
              {renderTransactionList("income")}
            </TabsContent>
            <TabsContent value="expense" className="mt-4">
              {renderTransactionList("expense")}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
