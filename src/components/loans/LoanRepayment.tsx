
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface LoanRepaymentProps {
  loanId?: string;
  defaultAmount?: number;
}

const LoanRepayment: React.FC<LoanRepaymentProps> = ({ loanId, defaultAmount }) => {
  const { user, addTransaction } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>(defaultAmount ? defaultAmount.toString() : '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Get all approved loans
  const approvedLoans = user?.loans?.filter((loan: any) => loan.status === 'approved') || [];
  
  const handleRepayLoan = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid repayment amount",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const numericAmount = parseFloat(amount);
      const targetLoanId = loanId || approvedLoans[0]?.id;
      
      if (!targetLoanId) {
        toast({
          title: "No loan selected",
          description: "Please select a loan to repay",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Add repayment transaction
      addTransaction({
        id: `txn-${Date.now()}`,
        amount: numericAmount,
        type: "repayment",
        description: `Loan repayment for ${targetLoanId}`,
        date: new Date().toISOString()
      });
      
      toast({
        title: "Payment successful",
        description: `Successfully repaid ₹${numericAmount.toLocaleString()} for your loan.`,
      });
      
      setAmount('');
    } catch (error) {
      console.error("Error processing repayment:", error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Repayment</CardTitle>
        <CardDescription>
          Make a payment towards your outstanding loans
        </CardDescription>
      </CardHeader>
      <CardContent>
        {approvedLoans.length > 0 ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="amount" className="text-sm font-medium block mb-1">
                Repayment Amount (₹)
              </label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter repayment amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm font-medium">Outstanding Loans</p>
              <ul className="mt-2 space-y-2">
                {approvedLoans.map((loan: any) => (
                  <li key={loan.id} className="text-sm flex justify-between">
                    <span>{loan.type}</span>
                    <span className="font-semibold">₹{loan.amount.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-center py-4 text-muted-foreground">
            You don't have any active loans to repay
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleRepayLoan} 
          disabled={isSubmitting || approvedLoans.length === 0}
        >
          {isSubmitting ? "Processing..." : "Make Payment"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoanRepayment;
