import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, BarChart, ArrowDown, Users } from "lucide-react";
import StatCard from "./StatCard";
import CreditScoreBoard from "./CreditScoreBoard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { assessCreditworthiness } from "@/utils/creditScoring";

const VerifierDashboard: React.FC = () => {
  const { user, sendNotification } = useAuth();
  const { toast } = useToast();
  const [pendingApplications, setPendingApplications] = useState<{
    id: string;
    loanId: string;
    type: string;
    amount: number;
    userEmail: string;
    userName: string;
    applicantInitial: string;
    submittedAt: string;
    purpose: string;
    userData: any;
    creditScore: number;
  }[]>([]);
  
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [viewLoanDetails, setViewLoanDetails] = useState<boolean>(false);

  useEffect(() => {
    // Get all pending loan applications from localStorage
    const getAllPendingLoans = () => {
      const pendingLoans: any[] = [];
      
      // Loop through localStorage to find all users and their loans
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("agriloan_userdata_")) {
          try {
            const email = key.replace("agriloan_userdata_", "");
            const userData = JSON.parse(localStorage.getItem(key) || "{}");
            
            if (userData.name && email && userData.loans && userData.loans.length > 0) {
              // Filter only pending loans
              const pending = userData.loans.filter((loan: any) => loan.status === "pending");
              
              pending.forEach((loan: any) => {
                // Calculate credit score using the assessCreditworthiness function
                const creditAssessment = assessCreditworthiness(userData);
                const creditScore = Math.round(creditAssessment.creditScore * 100);
                
                pendingLoans.push({
                  id: `${email}-${loan.id}`,
                  loanId: loan.id,
                  type: loan.type,
                  amount: loan.amount,
                  userEmail: email,
                  userName: userData.name,
                  applicantInitial: userData.name.charAt(0).toUpperCase(),
                  submittedAt: loan.submittedAt,
                  purpose: loan.purpose || "No purpose specified",
                  userData: userData,
                  creditScore: creditScore
                });
              });
            }
          } catch (error) {
            console.error("Error parsing user data:", error);
          }
        }
      }
      
      console.log("Verifier dashboard - Pending loans found:", pendingLoans.length);
      if (pendingLoans.length > 0) {
        console.log("Pending loans data:", pendingLoans);
      }
      
      // Sort by submission date (newest first)
      return pendingLoans.sort((a, b) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
    };
    
    const applications = getAllPendingLoans();
    setPendingApplications(applications);
    
    // Set the first applicant as selected by default if available
    if (applications.length > 0) {
      setSelectedApplicant(applications[0]);
    }
  }, []);

  const handleApprove = (application: any) => {
    // Check if the credit score is at least 60 (eligible)
    if (application.creditScore < 60) {
      toast({
        title: "Cannot Approve",
        description: "This applicant's credit score is below the required minimum (60/100).",
        variant: "destructive"
      });
      return;
    }
    
    // Find the user data
    const userDataKey = `agriloan_userdata_${application.userEmail}`;
    const userData = localStorage.getItem(userDataKey);
    
    if (userData) {
      const parsedData = JSON.parse(userData);
      
      // Update the loan status
      if (parsedData.loans) {
        const updatedLoans = parsedData.loans.map((loan: any) => {
          if (loan.id === application.loanId) {
            return { ...loan, status: "approved" };
          }
          return loan;
        });
        
        // Update current balance
        const currentBalance = parsedData.currentBalance || 0;
        parsedData.currentBalance = currentBalance + application.amount;
        
        // Create a disbursement transaction
        const transactions = parsedData.transactions || [];
        transactions.push({
          id: `txn-${Date.now()}`,
          amount: application.amount,
          type: "disbursement",
          description: `Loan disbursement - ${application.type}`,
          date: new Date().toISOString()
        });
        
        // Save back to localStorage
        parsedData.loans = updatedLoans;
        parsedData.transactions = transactions;
        localStorage.setItem(userDataKey, JSON.stringify(parsedData));
        
        // Update local state
        setPendingApplications(prev => prev.filter(app => app.id !== application.id));
        setSelectedApplicant(null);
        
        // Send notification
        sendNotification("loan_approved", {
          type: application.type,
          amount: application.amount,
          email: application.userEmail
        });
        
        toast({
          title: "Loan Approved",
          description: `You've approved ${application.userName}'s loan application for ${application.type}.`,
        });
      }
    }
  };
  
  const handleReject = (application: any) => {
    // Find the user data
    const userDataKey = `agriloan_userdata_${application.userEmail}`;
    const userData = localStorage.getItem(userDataKey);
    
    if (userData) {
      const parsedData = JSON.parse(userData);
      
      // Update the loan status
      if (parsedData.loans) {
        const updatedLoans = parsedData.loans.map((loan: any) => {
          if (loan.id === application.loanId) {
            return { ...loan, status: "rejected" };
          }
          return loan;
        });
        
        // Create a notification transaction
        const transactions = parsedData.transactions || [];
        transactions.push({
          id: `txn-${Date.now()}`,
          amount: 0,
          type: "rejection",
          description: `Loan application for ${application.type} was rejected`,
          date: new Date().toISOString()
        });
        
        // Save back to localStorage
        parsedData.loans = updatedLoans;
        parsedData.transactions = transactions;
        localStorage.setItem(userDataKey, JSON.stringify(parsedData));
        
        // Update local state
        setPendingApplications(prev => prev.filter(app => app.id !== application.id));
        setSelectedApplicant(null);
        
        // Send notification
        sendNotification("loan_rejected", {
          type: application.type,
          email: application.userEmail
        });
        
        toast({
          title: "Loan Rejected",
          description: `You've rejected ${application.userName}'s loan application for ${application.type}.`,
          variant: "destructive"
        });
      }
    }
  };

  const handleSelectApplicant = (application: any) => {
    setSelectedApplicant(application);
  };
  
  const viewLoanPurpose = (application: any) => {
    setSelectedApplicant(application);
    setViewLoanDetails(true);
  };

  // Calculate statistics
  const urgentCount = pendingApplications.filter(app => {
    const submitTime = new Date(app.submittedAt).getTime();
    const hoursSince = (Date.now() - submitTime) / (1000 * 60 * 60);
    return hoursSince > 48;
  }).length;
  
  // Statistics for today's verifications (mocked for now)
  const verifiedToday = 8;
  const approvedToday = 6;
  const rejectedToday = 2;
  
  // Calculate average verification time
  const avgTime = "1.8 hrs";
  const timeChange = "-20 mins";
  
  // Credit score color function
  const getCreditScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Verifier Dashboard</h2>
        <p className="text-muted-foreground">
          Verify applications and manage lending partners.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Verification"
          value={pendingApplications.length.toString()}
          description={`${urgentCount} urgent (>48h)`}
          icon={CreditCard}
        />
        
        <StatCard
          title="Verified Today"
          value={verifiedToday.toString()}
          description={`${approvedToday} approved, ${rejectedToday} rejected`}
          icon={BarChart}
        />
        
        <StatCard
          title="Average Time"
          value={avgTime}
          description={`${timeChange} from yesterday`}
          icon={ArrowDown}
          descriptionColor="text-green-600"
        />
        
        <StatCard
          title="Active Partners"
          value="5"
          description="All regions covered"
          icon={Users}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Applications Needing Verification</CardTitle>
            <CardDescription>
              Review and verify these applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingApplications.length > 0 ? (
              <div className="space-y-4">
                {pendingApplications.map((app) => {
                  const daysAgo = Math.floor((Date.now() - new Date(app.submittedAt).getTime()) / (24 * 60 * 60 * 1000));
                  const timeAgo = daysAgo > 0 ? `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago` : 'today';
                  
                  return (
                    <div key={app.id} className="bg-gray-50 rounded-md p-4">
                      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-agriloan-primary flex items-center justify-center text-white">
                            {app.applicantInitial}
                          </div>
                          <div>
                            <p className="font-medium">{app.userName}</p>
                            <p className="text-sm text-muted-foreground">{app.type}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <p className="text-sm mr-2">Credit Score:</p>
                          <p className={`text-sm font-bold ${getCreditScoreColor(app.creditScore)}`}>
                            {app.creditScore.toFixed(0)}/100
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-between gap-2 items-start sm:items-center">
                        <div>
                          <p className="text-sm">Amount: <span className="font-semibold">₹{app.amount.toLocaleString()}</span></p>
                          <p className="text-xs text-muted-foreground">Submitted {timeAgo}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              handleSelectApplicant(app);
                              viewLoanPurpose(app);
                            }}
                          >
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-red-500 text-red-500 hover:bg-red-50"
                            onClick={() => handleReject(app)}
                          >
                            Reject
                          </Button>
                          <Button 
                            className={`${app.creditScore >= 60 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'}`}
                            size="sm"
                            onClick={() => handleApprove(app)}
                            disabled={app.creditScore < 60}
                          >
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center py-6 text-muted-foreground">No pending applications to verify</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Applicant Credit Score</CardTitle>
            <CardDescription>
              {selectedApplicant 
                ? `Credit assessment for ${selectedApplicant.userName}`
                : "Select an applicant to view credit score"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedApplicant ? (
              <CreditScoreBoard 
                userData={selectedApplicant.userData} 
                isVerifier={true}
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Select an application to view credit details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={viewLoanDetails} onOpenChange={setViewLoanDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Loan Application Details</DialogTitle>
            <DialogDescription>
              {selectedApplicant ? `From ${selectedApplicant.userName}` : ''}
            </DialogDescription>
          </DialogHeader>
          {selectedApplicant && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">Loan Type</h4>
                <p>{selectedApplicant.type}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Amount Requested</h4>
                <p>₹{selectedApplicant.amount.toLocaleString()}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Loan Purpose</h4>
                <p className="bg-gray-50 p-3 rounded-md">{selectedApplicant.purpose}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Credit Eligibility</h4>
                <p className={selectedApplicant.creditScore >= 60 ? "text-green-600" : "text-red-500"}>
                  {selectedApplicant.creditScore >= 60 
                    ? "Eligible for approval" 
                    : "Not eligible (credit score below 60)"}
                </p>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setViewLoanDetails(false)}>Close</Button>
                <Button 
                  variant="outline" 
                  className="border-red-500 text-red-500 hover:bg-red-50" 
                  onClick={() => {
                    handleReject(selectedApplicant);
                    setViewLoanDetails(false);
                  }}
                >
                  Reject
                </Button>
                <Button 
                  className={`${selectedApplicant.creditScore >= 60 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'}`} 
                  onClick={() => {
                    if (selectedApplicant.creditScore >= 60) {
                      handleApprove(selectedApplicant);
                      setViewLoanDetails(false);
                    }
                  }}
                  disabled={selectedApplicant.creditScore < 60}
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

export default VerifierDashboard;
