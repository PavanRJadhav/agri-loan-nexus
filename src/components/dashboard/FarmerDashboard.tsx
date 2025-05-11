
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, BarChart, ArrowUp, CalendarDays, FileText, PlusCircle, Landmark, BanknoteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import StatCard from "./StatCard";
import ApplicationItem from "./ApplicationItem";
import CreditCardDisplay from "./CreditCardDisplay";
import { useAuth } from "@/contexts/AuthContext";

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
          title="Preferred Lender"
          value={user?.preferredLender?.name || "Not selected"}
          description={user?.preferredLender?.interestRate ? `${user.preferredLender.interestRate}% interest rate` : "Choose a lending partner"}
          icon={Landmark}
          link={user?.preferredLender ? "/profile" : "/lenders"}
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
              <Bank className="mr-2 h-5 w-5" />
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
                  <Bank className="mr-2 h-4 w-4" />
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
