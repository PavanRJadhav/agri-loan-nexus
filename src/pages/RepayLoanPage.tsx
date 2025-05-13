
import React from "react";
import LoanRepayment from "@/components/loans/LoanRepayment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import CreditScoreBoard from "@/components/dashboard/CreditScoreBoard";

const RepayLoanPage: React.FC = () => {
  const { user } = useAuth();
  
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
      remainingBalance: Math.max(0, loan.amount - repaidForThisLoan)
    };
  });
  
  // Calculate total approved amount, repaid amount, and outstanding amount
  const totalApprovedAmount = loansWithBalance.reduce((total, loan) => total + loan.amount, 0);
  const outstandingAmount = loansWithBalance.reduce((total, loan) => total + loan.remainingBalance, 0);
  const repaidAmount = totalApprovedAmount - outstandingAmount;
  
  return (
    <div className="space-y-6">
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
                <dd className="text-sm font-semibold">₹{repaidAmount.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between pt-4 border-t">
                <dt className="text-base font-medium">Outstanding Balance</dt>
                <dd className="text-base font-bold">₹{outstandingAmount.toLocaleString()}</dd>
              </div>
              
              {loansWithBalance.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Individual Loan Balances:</h4>
                  <ul className="space-y-2">
                    {loansWithBalance.filter(loan => loan.remainingBalance > 0).map(loan => (
                      <li key={loan.id} className="flex justify-between text-sm">
                        <span>{loan.type}</span>
                        <span className="font-medium">₹{loan.remainingBalance.toLocaleString()}</span>
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
