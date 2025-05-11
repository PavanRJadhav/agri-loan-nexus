
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, BarChart, ArrowDown, Users } from "lucide-react";
import StatCard from "./StatCard";
import ApplicationItem from "./ApplicationItem";
import { useAuth, LoanApplication } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

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
  }[]>([]);
  
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
              const pending = userData.loans.filter((loan: LoanApplication) => loan.status === "pending");
              
              pending.forEach((loan: LoanApplication) => {
                pendingLoans.push({
                  id: `${email}-${loan.id}`,
                  loanId: loan.id,
                  type: loan.type,
                  amount: loan.amount,
                  userEmail: email,
                  userName: userData.name,
                  applicantInitial: userData.name.split(" ").map((n: string) => n[0]).join(""),
                  submittedAt: loan.submittedAt
                });
              });
            }
          } catch (error) {
            console.error("Error parsing user data:", error);
          }
        }
      }
      
      // Sort by submission date (newest first)
      return pendingLoans.sort((a, b) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
    };
    
    setPendingApplications(getAllPendingLoans());
  }, []);

  const handleApprove = (application: any) => {
    // Find the user data
    const userDataKey = `agriloan_userdata_${application.userEmail}`;
    const userData = localStorage.getItem(userDataKey);
    
    if (userData) {
      const parsedData = JSON.parse(userData);
      
      // Update the loan status
      if (parsedData.loans) {
        const updatedLoans = parsedData.loans.map((loan: LoanApplication) => {
          if (loan.id === application.loanId) {
            return { ...loan, status: "approved" };
          }
          return loan;
        });
        
        // Save back to localStorage
        parsedData.loans = updatedLoans;
        localStorage.setItem(userDataKey, JSON.stringify(parsedData));
        
        // Update local state
        setPendingApplications(prev => prev.filter(app => app.id !== application.id));
        
        // Send notification
        sendNotification("loan_approved", {
          type: application.type,
          amount: application.amount
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
        const updatedLoans = parsedData.loans.map((loan: LoanApplication) => {
          if (loan.id === application.loanId) {
            return { ...loan, status: "rejected" };
          }
          return loan;
        });
        
        // Save back to localStorage
        parsedData.loans = updatedLoans;
        localStorage.setItem(userDataKey, JSON.stringify(parsedData));
        
        // Update local state
        setPendingApplications(prev => prev.filter(app => app.id !== application.id));
        
        // Send notification
        sendNotification("loan_rejected", {
          type: application.type
        });
        
        toast({
          title: "Loan Rejected",
          description: `You've rejected ${application.userName}'s loan application for ${application.type}.`,
          variant: "destructive"
        });
      }
    }
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
      
      <div className="grid gap-4 md:grid-cols-1">
        <Card>
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
                  const timeAgo = daysAgo > 0 ? `${daysAgo} day${daysAgo !== 1 ? 's' : ''}` : 'today';
                  
                  return (
                    <ApplicationItem
                      key={app.id}
                      id={parseInt(app.loanId.replace("loan-", ""))}
                      title={`${app.userName}'s Application`}
                      date={`Submitted ${timeAgo}`}
                      status="Awaiting verification"
                      statusColor="bg-yellow-100 text-yellow-800"
                      showActions={true}
                      amount={`₹${app.amount.toLocaleString()}`}
                      type={app.type}
                      applicantInitial={app.applicantInitial}
                      onApprove={() => handleApprove(app)}
                      onReject={() => handleReject(app)}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-center py-6 text-muted-foreground">No pending applications to verify</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifierDashboard;
