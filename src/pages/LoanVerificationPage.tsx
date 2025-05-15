
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Eye, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { assessCreditworthiness } from "@/utils/creditScoring";

const LoanVerificationPage: React.FC = () => {
  const { user, addTransaction, sendNotification } = useAuth();
  const [viewDetails, setViewDetails] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [pendingLoans, setPendingLoans] = useState<Array<{
    userId: string;
    userName: string;
    userEmail: string;
    loan: any;
    creditScore: number;
  }>>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Initial load and periodic refresh
  useEffect(() => {
    fetchPendingLoans();
    
    // Set up periodic refresh
    const intervalId = setInterval(() => {
      fetchPendingLoans(false); // silent refresh
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Function to fetch all pending loans
  const fetchPendingLoans = (showToast = true) => {
    if (showToast) {
      setIsRefreshing(true);
    }
    
    // Get all pending loans
    const allLoans = getAllPendingLoans();
    setPendingLoans(allLoans);
    
    if (showToast) {
      if (allLoans.length > 0) {
        toast.success(`Found ${allLoans.length} pending application(s)`, {
          description: "The latest loan applications are now ready for review."
        });
      } else {
        toast.info("No pending applications", {
          description: "There are no loan applications requiring verification at this time."
        });
      }
      setIsRefreshing(false);
    }
    
    console.log("Fetched pending loans:", allLoans);
  };
  
  // Process all loans from all users with improved debugging
  const getAllPendingLoans = () => {
    // In a real app, this would come from a backend API
    // Simulating getting all loans from localStorage
    const allLoans: Array<{
      userId: string;
      userName: string;
      userEmail: string;
      loan: any;
      creditScore: number;
    }> = [];
    
    let usersChecked = 0;
    let pendingLoansFound = 0;
    
    // Try to get all users from localStorage (in a real app, this would be a database query)
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('agriloan_userdata_')) {
        try {
          usersChecked++;
          const email = key.replace('agriloan_userdata_', '');
          const userData = JSON.parse(localStorage.getItem(key) || '{}');
          
          if (userData.loans && Array.isArray(userData.loans)) {
            // Calculate credit score
            const creditAssessment = assessCreditworthiness(userData);
            const creditScore = Math.round(creditAssessment.creditScore * 100);
            
            userData.loans.forEach((loan: any) => {
              if (loan.status === 'pending') {
                pendingLoansFound++;
                allLoans.push({
                  userId: userData.id || 'unknown',
                  userName: userData.name || email.split('@')[0],
                  userEmail: email,
                  loan,
                  creditScore: creditScore
                });
              }
            });
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
    
    console.log(`LoanVerificationPage - Checked ${usersChecked} users, found ${pendingLoansFound} pending loans`);
    
    // Sort by submission date, newest first
    return allLoans.sort((a, b) => 
      new Date(b.loan.submittedAt).getTime() - new Date(a.loan.submittedAt).getTime()
    );
  };
  
  const handleViewDetails = (loan: any) => {
    setSelectedLoan(loan);
    setViewDetails(true);
  };
  
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
    
    // Update the user's financial data
    const currentBalance = userData.financialData?.currentBalance || 0;
    const updatedFinancialData = {
      ...userData.financialData,
      currentBalance: currentBalance + amount
    };
    
    // Create a disbursement transaction
    const newTransaction = {
      id: `txn-${Date.now()}`,
      amount: amount,
      type: "disbursement",
      description: `Loan disbursement - ${loan.type} approved`,
      date: new Date().toISOString()
    };
    
    // Update user data with new transaction and financial data
    userData.loans = updatedLoans;
    userData.financialData = updatedFinancialData;
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
    
    // Remove from pending loans list
    setPendingLoans(prevLoans => 
      prevLoans.filter(item => !(item.userEmail === userEmail && item.loan.id === loanId))
    );
    
    // Close dialog if open
    setViewDetails(false);
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
    
    // Remove from pending loans list
    setPendingLoans(prevLoans => 
      prevLoans.filter(item => !(item.userEmail === userEmail && item.loan.id === loanId))
    );
    
    // Close dialog if open
    setViewDetails(false);
  };
  
  // Credit score color function
  const getCreditScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Loan Verification</h2>
          <p className="text-muted-foreground">
            Review and verify pending loan applications
          </p>
        </div>
        
        <Button 
          onClick={() => fetchPendingLoans()} 
          variant="outline" 
          className="flex items-center gap-2"
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Applications
        </Button>
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
                  
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-muted-foreground">
                      Submitted: {new Date(item.loan.submittedAt).toLocaleDateString('en-IN', { 
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    
                    <div className="flex items-center">
                      <span className="text-sm mr-2">Credit Score:</span>
                      <span className={`font-bold ${getCreditScoreColor(item.creditScore)}`}>
                        {item.creditScore.toFixed(0)}/100
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button 
                      variant="outline"
                      onClick={() => handleViewDetails(item)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-red-500 text-red-500 hover:bg-red-50" 
                      onClick={() => handleRejectLoan(item.userEmail, item.loan.id)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button 
                      className={`${item.creditScore >= 60 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'}`}
                      onClick={() => handleApproveLoan(item.userEmail, item.loan.id, item.loan.amount)}
                      disabled={item.creditScore < 60}
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
      
      <Dialog open={viewDetails} onOpenChange={setViewDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Loan Application Details</DialogTitle>
            <DialogDescription>
              {selectedLoan ? `From ${selectedLoan.userName}` : ''}
            </DialogDescription>
          </DialogHeader>
          
          {selectedLoan && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">Loan Type</h4>
                <p>{selectedLoan.loan.type}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Amount Requested</h4>
                <p>₹{selectedLoan.loan.amount.toLocaleString()}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Loan Purpose</h4>
                <p className="bg-gray-50 p-3 rounded-md">{selectedLoan.loan.purpose}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Preferred Lender</h4>
                <p>{selectedLoan.loan.lender}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Credit Eligibility</h4>
                <p className={selectedLoan.creditScore >= 60 ? "text-green-600" : "text-red-500"}>
                  {selectedLoan.creditScore >= 60 
                    ? "Eligible for approval" 
                    : "Not eligible (credit score below 60)"}
                </p>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setViewDetails(false)}>Close</Button>
                <Button 
                  variant="outline" 
                  className="border-red-500 text-red-500 hover:bg-red-50" 
                  onClick={() => handleRejectLoan(selectedLoan.userEmail, selectedLoan.loan.id)}
                >
                  Reject
                </Button>
                <Button 
                  className={`${selectedLoan.creditScore >= 60 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'}`} 
                  onClick={() => handleApproveLoan(selectedLoan.userEmail, selectedLoan.loan.id, selectedLoan.loan.amount)}
                  disabled={selectedLoan.creditScore < 60}
                >
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoanVerificationPage;
