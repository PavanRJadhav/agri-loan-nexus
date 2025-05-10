
import React from "react";
import CreditCardDisplay from "@/components/dashboard/CreditCardDisplay";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CreditCardsPage: React.FC = () => {
  const { user } = useAuth();
  
  // Get transactions from user context
  const transactions = user?.transactions || [];
  
  // Filter for just credit card related transactions
  const cardTransactions = transactions.filter(transaction => 
    transaction.type === "payment" || transaction.type === "disbursement"
  );

  // Sort by date (newest first)
  const recentCardTransactions = [...cardTransactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 3);
  
  // Format transaction date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  // Credit card data
  const creditCardData = {
    name: user?.name || "Unknown",
    cardNumber: "**** **** **** 4582",
    validUntil: "09/28",
    availableCredit: user?.financialData?.currentBalance ? 
      `₹${user.financialData.currentBalance.toLocaleString()}` : "₹0",
    creditLimit: "₹50,000",
    percentAvailable: user?.financialData?.currentBalance ? 
      Math.min(100, Math.round((user.financialData.currentBalance / 50000) * 100)) : 0
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Credit Cards</h2>
        <p className="text-muted-foreground">
          View and manage your Kisan Credit Card.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kisan Credit Card</CardTitle>
            <CardDescription>Your agricultural credit line</CardDescription>
          </CardHeader>
          <CardContent>
            <CreditCardDisplay {...creditCardData} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Last 30 days of card activity</CardDescription>
          </CardHeader>
          <CardContent>
            {recentCardTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentCardTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                    </div>
                    <span className={transaction.amount > 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                      {transaction.amount > 0 ? `+₹${transaction.amount.toLocaleString()}` : `-₹${Math.abs(transaction.amount).toLocaleString()}`}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <FileText className="h-12 w-12 mx-auto text-gray-300" />
                <p className="text-muted-foreground">No transaction history yet</p>
                <p className="text-sm text-muted-foreground">Your credit card transactions will appear here</p>
                <Button variant="outline" asChild className="mt-2">
                  <Link to="/loan-applications/new">Apply For Credit</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreditCardsPage;
