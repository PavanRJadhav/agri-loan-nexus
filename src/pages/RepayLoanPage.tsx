
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Wallet } from "lucide-react";

const RepayLoanPage: React.FC = () => {
  const { user, updateUserData, addTransaction } = useAuth();
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const loanApplications = user?.loans?.filter(loan => loan.status === "approved") || [];
  const [selectedLoan, setSelectedLoan] = useState<string>(loanApplications[0]?.id || "");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!selectedLoan || amount <= 0) {
      toast.error("Please select a loan and enter a valid amount");
      setIsSubmitting(false);
      return;
    }
    
    // Simulate payment processing
    setTimeout(() => {
      // Add transaction record
      addTransaction({
        amount: amount,
        type: "payment",
        description: `Loan repayment via ${paymentMethod.toUpperCase()}`,
      });
      
      // Update user loans - in a real app, you'd update the loan balance
      const updatedLoans = user?.loans?.map(loan => {
        if (loan.id === selectedLoan) {
          return {
            ...loan,
            // Here we would typically reduce the balance, but for this demo
            // we'll just mark that a payment was made in the status
            status: "approved" as "pending" | "approved" | "rejected",
          };
        }
        return loan;
      });
      
      updateUserData({ loans: updatedLoans });
      
      toast.success("Payment successful", {
        description: `₹${amount.toLocaleString()} has been paid towards your loan`,
      });
      
      setAmount(0);
      setIsSubmitting(false);
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Repay Your Loan</h1>
        <p className="text-muted-foreground">
          Make payments towards your approved loans
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Loan Repayment
            </CardTitle>
            <CardDescription>
              Select a loan and enter the amount you want to repay
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loanApplications.length === 0 ? (
              <Alert>
                <AlertDescription>
                  You don't have any approved loans to repay.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loan">Select Loan</Label>
                  <Select 
                    value={selectedLoan}
                    onValueChange={setSelectedLoan}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a loan" />
                    </SelectTrigger>
                    <SelectContent>
                      {loanApplications.map((loan) => (
                        <SelectItem key={loan.id} value={loan.id}>
                          {loan.type} - ₹{loan.amount.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min={1}
                    placeholder="Enter repayment amount"
                    disabled={isSubmitting}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select 
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="card">Debit/Credit Card</SelectItem>
                      <SelectItem value="netbanking">Net Banking</SelectItem>
                      <SelectItem value="wallet">Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting || !selectedLoan || amount <= 0}
                >
                  {isSubmitting ? "Processing..." : "Make Payment"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start">
            <p className="text-sm text-muted-foreground">
              Payments are processed securely. It may take 24-48 hours to reflect in your loan account.
            </p>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Active Loans</CardTitle>
            <CardDescription>
              Overview of your current loan balances
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loanApplications.length === 0 ? (
              <p className="text-muted-foreground">No active loans found.</p>
            ) : (
              <div className="space-y-4">
                {loanApplications.map((loan) => (
                  <div key={loan.id} className="flex justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">{loan.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(loan.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{loan.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Principal Amount</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {user?.transactions && user.transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.transactions
                .filter(transaction => transaction.type === "payment")
                .slice(0, 5)
                .map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-green-600 font-semibold">
                      ₹{transaction.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RepayLoanPage;
