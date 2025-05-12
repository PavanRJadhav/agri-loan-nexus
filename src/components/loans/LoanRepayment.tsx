
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LoanRepaymentProps {
  loanId?: string;
  defaultAmount?: number;
}

const LoanRepayment: React.FC<LoanRepaymentProps> = ({ loanId, defaultAmount }) => {
  const { user, addTransaction, updateUserData } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>(defaultAmount ? defaultAmount.toString() : '');
  const [selectedLoanId, setSelectedLoanId] = useState<string>(loanId || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Get all approved loans that haven't been fully repaid
  const approvedLoans = user?.loans?.filter((loan: any) => loan.status === 'approved') || [];
  
  // Calculate remaining balance for each loan
  const loansWithBalance = approvedLoans.map((loan: any) => {
    const repaidForThisLoan = user?.transactions
      ?.filter((txn: any) => 
        txn.type === "payment" && 
        txn.description.includes(`Loan repayment for ${loan.id}`)
      )
      ?.reduce((total: number, txn: any) => total + txn.amount, 0) || 0;
    
    const remainingBalance = Math.max(0, loan.amount - repaidForThisLoan);
    return {
      ...loan,
      remainingBalance
    };
  }).filter(loan => loan.remainingBalance > 0);
  
  // Set default selected loan
  useEffect(() => {
    if (loansWithBalance.length > 0 && !selectedLoanId) {
      setSelectedLoanId(loansWithBalance[0].id);
    }
  }, [loansWithBalance, selectedLoanId]);

  const handleRepayLoan = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid repayment amount",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedLoanId) {
      toast({
        title: "No loan selected",
        description: "Please select a loan to repay",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const numericAmount = parseFloat(amount);
      
      // Find the selected loan
      const selectedLoan = loansWithBalance.find(loan => loan.id === selectedLoanId);
      if (!selectedLoan) {
        throw new Error("Selected loan not found");
      }
      
      // Add repayment transaction
      addTransaction({
        amount: numericAmount,
        type: "payment", 
        description: `Loan repayment for ${selectedLoanId}`,
      });
      
      // Update user's current balance
      const currentBalance = user?.financialData?.currentBalance || 0;
      updateUserData({
        financialData: {
          ...user?.financialData,
          currentBalance: currentBalance - numericAmount
        }
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
        {loansWithBalance.length > 0 ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="loan-select" className="text-sm font-medium block mb-1">
                Select Loan to Repay
              </label>
              <Select
                value={selectedLoanId}
                onValueChange={setSelectedLoanId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a loan" />
                </SelectTrigger>
                <SelectContent>
                  {loansWithBalance.map((loan) => (
                    <SelectItem key={loan.id} value={loan.id}>
                      {loan.type} - ₹{loan.remainingBalance.toLocaleString()} remaining
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                {loansWithBalance.map((loan) => (
                  <li key={loan.id} className="text-sm flex justify-between">
                    <span>{loan.type}</span>
                    <span className="font-semibold">₹{loan.remainingBalance.toLocaleString()}</span>
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
          disabled={isSubmitting || loansWithBalance.length === 0}
        >
          {isSubmitting ? "Processing..." : "Make Payment"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoanRepayment;
