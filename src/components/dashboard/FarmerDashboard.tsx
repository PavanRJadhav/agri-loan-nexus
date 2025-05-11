
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, BarChart, ArrowUp, CalendarDays, FileText, PlusCircle, Landmark, BanknoteIcon, Building, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import StatCard from "./StatCard";
import ApplicationItem from "./ApplicationItem";
import CreditCardDisplay from "./CreditCardDisplay";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";

interface FarmerDashboardProps {
  userName: string;
}

const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ userName }) => {
  const { user, getUserFinancialData } = useAuth();
  const financialData = getUserFinancialData();
  
  // Calculate total loan amount from applications
  const totalLoanAmount = user?.loans?.reduce((total, loan) => total + loan.amount, 0) || 0;
  
  // Count active applications
  const activeApplications = user?.loans?.length || 0;
  const approvedApplications = user?.loans?.filter(loan => loan.status === "approved").length || 0;
  const pendingApplications = user?.loans?.filter(loan => loan.status === "pending").length || 0;
  
  // Get latest loans
  const recentLoans = user?.loans?.slice(0, 3) || [];
  
  // Get credit score information
  const creditScore = user?.creditScore;

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
          value={totalLoanAmount > 0 ? `₹${totalLoanAmount.toLocaleString()}` : "₹0"}
          description={financialData?.loanAmount ? `₹${financialData.loanAmount.toLocaleString()} requested` : "No loan amount set"}
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
          value={creditScore ? creditScore.score.toString() : "Not Available"}
          description={creditScore ? `Up to ₹${creditScore.maxEligibleAmount.toLocaleString()} eligible` : "Check your score"}
          icon={CheckCircle}
          link="/credit-score"
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
              <Link to="/loan-applications/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Application
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLoans.length > 0 ? (
                recentLoans.map((loan, index) => (
                  <ApplicationItem
                    key={loan.id}
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
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No loan applications yet</p>
                  <Button variant="link" asChild>
                    <Link to="/loan-applications/new">
                      Apply for your first loan
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          {creditScore ? (
            <>
              <CardHeader>
                <CardTitle>Credit Score</CardTitle>
                <CardDescription>
                  Your agricultural credit profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-4">
                  <div className="text-4xl font-bold mb-1">
                    <span className={
                      creditScore.score >= 700 ? "text-green-600" : 
                      creditScore.score >= 550 ? "text-yellow-600" : 
                      "text-red-600"
                    }>
                      {creditScore.score}
                    </span>
                  </div>
                  <Progress 
                    value={(creditScore.score - 300) / 5.5} 
                    className={`w-full h-2 ${
                      creditScore.score >= 700 ? "bg-green-500" : 
                      creditScore.score >= 550 ? "bg-yellow-500" : 
                      "bg-red-500"
                    }`}
                  />
                  <div className="w-full flex justify-between text-xs mt-1 text-muted-foreground">
                    <span>Poor</span>
                    <span>Fair</span>
                    <span>Good</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Max Eligible Loan:</span>
                    <span className="text-sm font-medium">₹{creditScore.maxEligibleAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Risk Level:</span>
                    <span className={`text-sm font-medium ${
                      creditScore.riskLevel === 'Low' ? 'text-green-600' : 
                      creditScore.riskLevel === 'Medium' ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {creditScore.riskLevel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Approval Likelihood:</span>
                    <span className={`text-sm font-medium ${
                      creditScore.loanApprovalLikelihood === 'High' ? 'text-green-600' : 
                      creditScore.loanApprovalLikelihood === 'Medium' ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {creditScore.loanApprovalLikelihood}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/credit-score">
                      View Full Credit Report
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle>Check Your Credit Score</CardTitle>
                <CardDescription>
                  Get a personalized credit assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <CheckCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <p className="mb-4">Your credit score helps determine your loan eligibility, interest rates, and borrowing limits.</p>
                  <Button asChild>
                    <Link to="/credit-score">
                      Check My Credit Score
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </>
          )}
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
                <Link to="/loan-applications/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Loan Application
                </Link>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <Link to="/loan-applications">
                  View All Applications
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5" />
              Lending Partners
            </CardTitle>
            <CardDescription>
              Choose a lending partner that best fits your financial needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <Button className="flex-1" asChild>
                <Link to="/lenders">
                  <Building className="mr-2 h-4 w-4" />
                  Select Preferred Lender
                </Link>
              </Button>
              {user?.preferredLender && (
                <Button variant="outline" className="flex-1" asChild>
                  <Link to="/profile">
                    View Selected Lender
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FarmerDashboard;
