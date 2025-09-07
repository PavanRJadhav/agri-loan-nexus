import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { LoanApplication, LoanStatus } from "@/types/loans";

interface LoanRepaymentProps {
  loanId?: string;
  defaultAmount?: number;
}

const LoanRepayment: React.FC<LoanRepaymentProps> = ({ loanId, defaultAmount }) => {
  const { user, addTransaction, updateUserData } = useAuth();
  const { toast: uiToast } = useToast();
  const [amount, setAmount] = useState<string>('');
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
      remainingBalance,
      repaidAmount: repaidForThisLoan
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
      uiToast({
        title: "Invalid amount",
        description: "Please enter a valid repayment amount",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedLoanId) {
      uiToast({
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
      
      // Verify that the repayment amount is not greater than the remaining balance
      if (numericAmount > selectedLoan.remainingBalance) {
        uiToast({
          title: "Invalid amount",
          description: `The repayment amount cannot exceed the remaining balance of ₹${selectedLoan.remainingBalance.toLocaleString()}`,
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Verify that the user has enough balance
      if (numericAmount > (user?.financialData?.currentBalance || 0)) {
        uiToast({
          title: "Insufficient funds",
          description: `You don't have enough balance to make this payment.`,
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Add repayment transaction
      const transaction = await addTransaction({
        amount: numericAmount,
        type: "payment", 
        description: `Loan repayment for ${selectedLoanId}`,
        status: "on_time"
      });
      
      // Update user's current balance
      const currentBalance = user?.financialData?.currentBalance || 0;
      await updateUserData({
        financialData: {
          ...user?.financialData,
          currentBalance: currentBalance - numericAmount
        }
      });
      
      // Update loan payment records
      if (user?.loans) {
        const updatedLoans = user.loans.map(loan => {
          if (loan.id === selectedLoanId) {
            const prevPaymentsMade = loan.paymentsMade || 0;
            const prevAmountRepaid = loan.amountRepaid || 0;
            const totalRepaid = prevAmountRepaid + numericAmount;
            
            // Check if loan is fully repaid
            const isFullyRepaid = totalRepaid >= loan.amount;
            
            return {
              ...loan,
              paymentsMade: prevPaymentsMade + 1,
              amountRepaid: totalRepaid,
              status: isFullyRepaid ? "repaid" : loan.status,
              lastPaymentDate: new Date().toISOString()
            };
          }
          return loan;
        });
        
        await updateUserData({ loans: updatedLoans });
      }

      // Generate and download payment report
      const paymentReport = {
        transactionId: transaction.id,
        date: new Date().toISOString(),
        amount: numericAmount,
        loanId: selectedLoanId,
        loanType: selectedLoan.type,
        remainingBalance: selectedLoan.remainingBalance - numericAmount,
        status: "completed",
        paymentMethod: "Online Banking",
        receiptNumber: `RCPT-${Date.now()}`,
        borrowerDetails: {
          name: user?.name,
          email: user?.email,
          phone: user?.phone
        }
      };

      // Create and download PDF report
      const blob = new Blob([JSON.stringify(paymentReport, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment_receipt_${transaction.id}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Update UI with toast
      uiToast({
        title: "Payment successful",
        description: `Successfully repaid ₹${numericAmount.toLocaleString()} for your loan.`,
      });
      
      // Display additional notification if loan is fully repaid
      if (selectedLoan && numericAmount >= selectedLoan.remainingBalance) {
        toast.success("Loan fully repaid!", {
          description: "Congratulations! You have fully repaid this loan."
        });
      }
      
      // Clear the amount input
      setAmount('');
      
    } catch (error) {
      console.error("Error processing repayment:", error);
      uiToast({
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
                max={selectedLoanId ? loansWithBalance.find(loan => loan.id === selectedLoanId)?.remainingBalance : undefined}
              />
              {selectedLoanId && (
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum: ₹{loansWithBalance.find(loan => loan.id === selectedLoanId)?.remainingBalance.toLocaleString() || 0}
                </p>
              )}
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm font-medium">Outstanding Loans</p>
              <ul className="mt-2 space-y-2">
                {loansWithBalance.map((loan) => (
                  <li key={loan.id} className="text-sm flex justify-between">
                    <span>{loan.type}</span>
                    <div className="text-right">
                      <span className="font-semibold">₹{loan.remainingBalance.toLocaleString()}</span>
                      {loan.repaidAmount > 0 && (
                        <span className="block text-xs text-green-600">
                          (₹{loan.repaidAmount.toLocaleString()} already repaid)
                        </span>
                      )}
                    </div>
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
          disabled={isSubmitting || loansWithBalance.length === 0 || !amount}
        >
          {isSubmitting ? "Processing..." : "Make Payment"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoanRepayment;
