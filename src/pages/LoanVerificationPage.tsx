import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

const LoanVerificationPage: React.FC = () => {
  const { user, addTransaction, sendNotification } = useAuth();
  
  // Process all loans from all users
  const getAllPendingLoans = () => {
    // In a real app, this would come from a backend API
    // Simulating getting all loans from localStorage
    const allLoans: Array<{
      userId: string;
      userName: string;
      userEmail: string;
      loan: any;
    }> = [];
    
    // Try to get all users from localStorage (in a real app, this would be a database query)
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('agriloan_userdata_')) {
        const email = key.replace('agriloan_userdata_', '');
        const userData = JSON.parse(localStorage.getItem(key) || '{}');
        
        if (userData.loans && Array.isArray(userData.loans)) {
          userData.loans.forEach((loan: any) => {
            if (loan.status === 'pending') {
              allLoans.push({
                userId: userData.id || 'unknown',
                userName: userData.name || email.split('@')[0],
                userEmail: email,
                loan
              });
            }
          });
        }
      }
    }
    
    return allLoans;
  };
  
  const pendingLoans = getAllPendingLoans();
  
  const handleApproveLoan = (userEmail: string, loanId: string, amount: number) => {
    // Get the user data
    const userDataKey = `agriloan_userdata_${userEmail}`;
    const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
    
    if (!userData.loans) return;
    
    // Find the loan by ID
    const loan = userData.loans.find((loan: any) => loan.id === loanId);
    if (!loan) return;
    
    // Update the loan status
    const updatedLoans = userData.loans.map((loan: any) => 
      loan.id === loanId ? { ...loan, status: 'approved' } : loan
    );
    
    // Update the user's current balance
    const currentBalance = userData.currentBalance || 0;
    userData.currentBalance = currentBalance + amount;
    
    // Create a disbursement transaction
    const newTransaction = {
      id: `txn-${Date.now()}`,
      amount: amount,
      type: "disbursement",
      description: `Loan disbursement - ${amount} approved`,
      date: new Date().toISOString()
    };
    
    // Update user data with new transaction
    userData.loans = updatedLoans;
    userData.transactions = [...(userData.transactions || []), newTransaction];
    
    // Save back to localStorage
    localStorage.setItem(userDataKey, JSON.stringify(userData));
    
    toast.success("Loan approved successfully", {
      description: `Loan for ${userEmail} has been approved and funds have been disbursed.`
    });
    
    // Send email notification
    sendNotification("loan_approved", {
      type: loan.type,
      amount: loan.amount,
      email: userEmail
    });
  };
  
  const handleRejectLoan = (userEmail: string, loanId: string) => {
    // Get the user data
    const userDataKey = `agriloan_userdata_${userEmail}`;
    const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
    
    if (!userData.loans) return;
    
    // Find the loan by ID
    const loan = userData.loans.find((loan: any) => loan.id === loanId);
    if (!loan) return;
    
    // Update the loan status
    const updatedLoans = userData.loans.map((loan: any) => 
      loan.id === loanId ? { ...loan, status: 'rejected' } : loan
    );
    
    // Create a notification transaction (with 0 amount)
    const newTransaction = {
      id: `txn-${Date.now()}`,
      amount: 0,
      type: "payment",
      description: "Loan application rejected",
      date: new Date().toISOString()
    };
    
    // Update user data
    userData.loans = updatedLoans;
    userData.transactions = [...(userData.transactions || []), newTransaction];
    
    // Save back to localStorage
    localStorage.setItem(userDataKey, JSON.stringify(userData));
    
    toast.error("Loan rejected", {
      description: `Loan for ${userEmail} has been rejected.`
    });
    
    // Send email notification
    sendNotification("loan_rejected", {
      type: loan.type,
      email: userEmail
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Loan Verification</h2>
        <p className="text-muted-foreground">
          Review and verify pending loan applications
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Pending Applications</CardTitle>
          <CardDescription>
            Verify these applications to approve or reject loan requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingLoans.length > 0 ? (
            <div className="space-y-4">
              {pendingLoans.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{item.userName}</h3>
                      <p className="text-sm text-muted-foreground">{item.userEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-lg">₹{item.loan.amount?.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{item.loan.type}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-1">Purpose:</p>
                    <p className="text-sm p-2 bg-gray-100 rounded">{item.loan.purpose}</p>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-4">
                    Submitted: {new Date(item.loan.submittedAt).toLocaleDateString('en-IN', { 
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button 
                      variant="outline" 
                      className="border-red-500 text-red-500 hover:bg-red-50" 
                      onClick={() => handleRejectLoan(item.userEmail, item.loan.id)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApproveLoan(item.userEmail, item.loan.id, item.loan.amount)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg font-medium">No pending applications</p>
              <p className="text-muted-foreground">There are no loan applications requiring verification at this time</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanVerificationPage;
