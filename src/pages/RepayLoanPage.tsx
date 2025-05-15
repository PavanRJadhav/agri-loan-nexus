
import React, { useState, useEffect } from "react";
import LoanRepayment from "@/components/loans/LoanRepayment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import CreditScoreBoard from "@/components/dashboard/CreditScoreBoard";

const RepayLoanPage: React.FC = () => {
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Force refresh when component mounts
  useEffect(() => {
    // Set up a timer to periodically refresh the page data
    const intervalId = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Calculate total outstanding loan amount
  const approvedLoans = user?.loans
    ?.filter((loan: any) => loan.status === "approved") || [];
  
  // Calculate outstanding balance for each approved loan
  const loansWithBalance = approvedLoans.map((loan: any) => {
    const repaidForThisLoan = user?.transactions
      ?.filter((txn: any) => 
        txn.type === "payment" && 
        txn.description.includes(`Loan repayment for ${loan.id}`)
      )
      ?.reduce((total: number, txn: any) => total + txn.amount, 0) || 0;
    
    return {
      ...loan,
      remainingBalance: Math.max(0, loan.amount - repaidForThisLoan),
      repaidAmount: repaidForThisLoan
    };
  });
  
  // Calculate total approved amount, repaid amount, and outstanding amount
  const totalApprovedAmount = loansWithBalance.reduce((total, loan) => total + loan.amount, 0);
  const outstandingAmount = loansWithBalance.reduce((total, loan) => total + loan.remainingBalance, 0);
  const repaidAmount = loansWithBalance.reduce((total, loan) => total + loan.repaidAmount, 0);
  
  return (
    <div className="space-y-6" key={`repay-page-${refreshTrigger}`}>
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Loan Repayment</h2>
        <p className="text-muted-foreground">
          Repay your outstanding loans and improve your credit score
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Loan Summary</CardTitle>
            <CardDescription>Your current loan status</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Total Approved Loans</dt>
                <dd className="text-sm font-semibold">₹{totalApprovedAmount.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Total Repaid</dt>
                <dd className="text-sm font-semibold text-green-600">₹{repaidAmount.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between pt-4 border-t">
                <dt className="text-base font-medium">Outstanding Balance</dt>
                <dd className="text-base font-bold">₹{outstandingAmount.toLocaleString()}</dd>
              </div>
              
              {loansWithBalance.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Individual Loan Balances:</h4>
                  <ul className="space-y-2">
                    {loansWithBalance.map(loan => (
                      <li key={loan.id} className="flex justify-between text-sm">
                        <span>{loan.type}</span>
                        <div className="text-right">
                          <span className="font-medium">₹{loan.remainingBalance.toLocaleString()}</span>
                          {loan.repaidAmount > 0 && (
                            <span className="block text-xs text-green-600">
                              (₹{loan.repaidAmount.toLocaleString()} repaid)
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
        
        <LoanRepayment defaultAmount={Math.min(user?.financialData?.currentBalance || 0, outstandingAmount)} />
      </div>
      
      <div className="mt-6">
        <CreditScoreBoard />
      </div>
    </div>
  );
};

export default RepayLoanPage;
