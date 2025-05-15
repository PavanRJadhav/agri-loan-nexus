import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, BarChart, ArrowUp, CalendarDays, FileText, PlusCircle, Landmark, BanknoteIcon, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import StatCard from "./StatCard";
import ApplicationItem from "./ApplicationItem";
import CreditCardDisplay from "./CreditCardDisplay";
import CreditScoreBoard from "./CreditScoreBoard";
import { useAuth } from "@/contexts/AuthContext";
import { assessCreditworthiness } from "@/utils/creditScoring";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FarmerDashboardProps {
  userName: string;
  refreshKey?: number;
}

const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ userName, refreshKey }) => {
  const { user, getUserFinancialData, updateUserData } = useAuth();
  const financialData = getUserFinancialData();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState<string | null>(null);
  const [localLoans, setLocalLoans] = useState(user?.loans || []);
  
  // Update local loans whenever user or refreshKey changes
  useEffect(() => {
    // Force a refresh of loans from localStorage to ensure we have latest data
    if (user?.email) {
      try {
        const userDataKey = `agriloan_userdata_${user.email}`;
        const userData = localStorage.getItem(userDataKey);
        if (userData) {
          const parsedData = JSON.parse(userData);
          if (parsedData.loans) {
            console.log("FarmerDashboard - Refreshed loans:", parsedData.loans.length);
            setLocalLoans(parsedData.loans);
          }
        }
      } catch (error) {
        console.error("Error refreshing loans data in FarmerDashboard:", error);
      }
    } else {
      setLocalLoans(user?.loans || []);
    }
  }, [user, refreshKey]);
  
  // Calculate total loan amount from applications
  const totalLoanAmount = localLoans?.reduce((total, loan) => total + loan.amount, 0) || 0;
  
  // Get total approved loan amount
  const approvedLoanAmount = localLoans
    ?.filter(loan => loan.status === "approved")
    ?.reduce((total, loan) => total + loan.amount, 0) || 0;
  
  // Calculate repaid amount
  const repaidAmount = user?.transactions
    ?.filter(txn => txn.type === "payment" && txn.description.includes("Loan repayment"))
    ?.reduce((total, txn) => total + txn.amount, 0) || 0;
  
  // Outstanding balance
  const outstandingBalance = Math.max(0, approvedLoanAmount - repaidAmount);
  
  // Count active applications
  const activeApplications = localLoans?.length || 0;
  const approvedApplications = localLoans?.filter(loan => loan.status === "approved").length || 0;
  const pendingApplications = localLoans?.filter(loan => loan.status === "pending").length || 0;
  
  // Get latest loans - sort by submission date (newest first)
  const recentLoans = [...(localLoans || [])]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 3);
  
  // Get credit score
  const creditAssessment = assessCreditworthiness(user || {});
  const creditScore = Math.round(creditAssessment.creditScore * 100);

  // Handle delete application
  const handleDeleteApplication = (loanId: string) => {
    setLoanToDelete(loanId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteApplication = () => {
    if (loanToDelete && user) {
      const updatedLoans = localLoans?.filter(loan => loan.id !== loanToDelete) || [];
      updateUserData({ loans: updatedLoans });
      setLocalLoans(updatedLoans);
      toast.success("Loan application deleted successfully");
    }
    setDeleteDialogOpen(false);
    setLoanToDelete(null);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {userName}!</h2>
        <p className="text-muted-foreground">
          Here's an overview of your loan applications and credit status.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Loan Amount"
          value={`₹${approvedLoanAmount.toLocaleString()}`}
          description={`₹${outstandingBalance.toLocaleString()} outstanding`}
          icon={CreditCard}
        />
        
        <StatCard
          title="Active Applications"
          value={activeApplications.toString()}
          description={`${approvedApplications} approved, ${pendingApplications} pending`}
          icon={BarChart}
        />
        
        <StatCard
          title="Current Balance"
          value={financialData?.currentBalance ? `₹${financialData.currentBalance.toLocaleString()}` : "₹0"}
          description="Available in your account"
          icon={ArrowUp}
          descriptionColor="text-green-600"
        />
        
        <StatCard
          title="Credit Score"
          value={`${creditScore}/100`}
          description={creditAssessment.category}
          icon={CreditCard}
          descriptionColor={creditScore >= 60 ? "text-green-600" : "text-yellow-600"}
          link="/profile"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>
                Your recent loan applications and their status
              </CardDescription>
            </div>
            <Button variant="outline" asChild className="ml-auto">
              <Link to="/lenders">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Application
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLoans.length > 0 ? (
                recentLoans.map((loan, index) => (
                  <div key={loan.id} className="flex items-center">
                    <ApplicationItem
                      id={index + 1}
                      title={loan.type}
                      date={`Applied on ${new Date(loan.submittedAt).toLocaleDateString()}`}
                      status={loan.status}
                      statusColor={
                        loan.status === "approved" 
                          ? "bg-green-100 text-green-800" 
                          : loan.status === "rejected" 
                            ? "bg-red-100 text-red-800" 
                            : "bg-yellow-100 text-yellow-800"
                      }
                    />
                    {loan.status === "pending" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2 text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteApplication(loan.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No loan applications yet</p>
                  <Button variant="link" asChild>
                    <Link to="/lenders">
                      Apply for your first loan
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Credit Card Status</CardTitle>
            <CardDescription>
              Your Kisan Credit Card details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreditCardDisplay
              name={userName}
              cardNumber="**** **** **** 4589"
              validUntil="12/25"
              availableCredit={financialData?.currentBalance ? `₹${financialData.currentBalance.toLocaleString()}` : "₹0"}
              creditLimit="₹50,000"
              percentAvailable={financialData?.currentBalance ? Math.min(100, Math.round((financialData.currentBalance / 50000) * 100)) : 0}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Apply for Loans
            </CardTitle>
            <CardDescription>
              Need financial assistance? Apply for various agricultural loans tailored for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <Button className="flex-1" asChild>
                <Link to="/lenders">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Loan Application
                </Link>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <Link to="/repay-loan">
                  <BanknoteIcon className="mr-2 h-4 w-4" />
                  Repay Loan
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <CreditScoreBoard />
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Loan Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this loan application? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteApplication} className="bg-red-500 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FarmerDashboard;
