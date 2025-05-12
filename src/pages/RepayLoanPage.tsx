
import React from "react";
import LoanRepayment from "@/components/loans/LoanRepayment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const RepayLoanPage: React.FC = () => {
  const { user } = useAuth();
  
  // Calculate total outstanding loan amount
  const outstandingAmount = user?.loans
    ?.filter((loan: any) => loan.status === "approved")
    ?.reduce((total: number, loan: any) => total + loan.amount, 0) || 0;
  
  // Get total repaid amount from transactions
  const repaidAmount = user?.transactions
    ?.filter((txn: any) => txn.type === "repayment")
    ?.reduce((total: number, txn: any) => total + txn.amount, 0) || 0;
  
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
                <dd className="text-sm font-semibold">₹{outstandingAmount.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Total Repaid</dt>
                <dd className="text-sm font-semibold">₹{repaidAmount.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between pt-4 border-t">
                <dt className="text-base font-medium">Outstanding Balance</dt>
                <dd className="text-base font-bold">
                  ₹{Math.max(0, outstandingAmount - repaidAmount).toLocaleString()}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <LoanRepayment defaultAmount={Math.max(0, outstandingAmount - repaidAmount)} />
      </div>
    </div>
  );
};

export default RepayLoanPage;
