
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

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
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  
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

  // Refresh effect to update UI after repayment
  useEffect(() => {
    if (refreshTrigger > 0) {
      // Force refresh data from localStorage
      if (user?.email) {
        try {
          const userDataKey = `agriloan_userdata_${user.email}`;
          localStorage.getItem(userDataKey);
          console.log("Loan repayment data refreshed");
        } catch (error) {
          console.error("Error refreshing loan data:", error);
        }
      }
    }
  }, [refreshTrigger, user?.email]);

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
      
      // Verify that the repayment amount is not greater than the remaining balance
      if (numericAmount > selectedLoan.remainingBalance) {
        toast({
          title: "Invalid amount",
          description: `The repayment amount cannot exceed the remaining balance of ₹${selectedLoan.remainingBalance.toLocaleString()}`,
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Add repayment transaction
      await addTransaction({
        amount: numericAmount,
        type: "payment", 
        description: `Loan repayment for ${selectedLoanId}`,
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
            // Fix: Use optional chaining for properties that might not exist on loan type
            const prevPaymentsMade = loan.paymentsMade || 0;
            const prevAmountRepaid = loan.amountRepaid || 0;
            
            return {
              ...loan,
              // Add these properties if they don't exist in the LoanApplication type
              paymentsMade: prevPaymentsMade + 1,
              amountRepaid: prevAmountRepaid + numericAmount
            };
          }
          return loan;
        });
        
        await updateUserData({ loans: updatedLoans });
      }
      
      // Update UI with toast
      toast({
        title: "Payment successful",
        description: `Successfully repaid ₹${numericAmount.toLocaleString()} for your loan.`,
      });
      
      // Display additional notification if loan is fully repaid
      if (numericAmount >= selectedLoan.remainingBalance) {
        // Fix: Use the proper syntax for sonner toast
        toast.message("Loan fully repaid!", {
          description: "Congratulations! You have fully repaid this loan."
        });
      }
      
      // Force refresh to update the UI
      setRefreshTrigger(prev => prev + 1);
      setAmount('');
      
      // Force refresh data in localStorage to ensure all components see the update
      refreshAllUserData();
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
  
  // Function to refresh all user data
  const refreshAllUserData = () => {
    if (user?.email) {
      const userDataKey = `agriloan_userdata_${user.email}`;
      const userData = localStorage.getItem(userDataKey);
      if (userData) {
        const parsedData = JSON.parse(userData);
        // Make sure the updated data is saved back
        localStorage.setItem(userDataKey, JSON.stringify(parsedData));
      }
    }
    
    // Also refresh all other users' data to ensure admins see updates
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('agriloan_userdata_') && (!user?.email || !key.includes(user.email))) {
        try {
          const otherUserData = localStorage.getItem(key);
          if (otherUserData) {
            localStorage.setItem(key, JSON.stringify(otherUserData));
          }
        } catch (error) {
          console.error("Error refreshing other user data:", error);
        }
      }
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
          disabled={isSubmitting || loansWithBalance.length === 0}
        >
          {isSubmitting ? "Processing..." : "Make Payment"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoanRepayment;
