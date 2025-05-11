
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Home, Mail, Phone, Calendar, Landmark, CreditCard, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";

const ProfileDetails: React.FC = () => {
  const { user, getUserFinancialData } = useAuth();
  const financialData = getUserFinancialData();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!user) {
    return <div>Loading profile information...</div>;
  }

  const getIncomeSourceLabel = (source: string) => {
    const sources: Record<string, string> = {
      "agriculture": "Agriculture",
      "livestock": "Livestock",
      "mixed_farming": "Mixed Farming",
      "other": "Other",
    };
    return sources[source] || source;
  };

  // Calculate total income and expenses from transactions
  const calculateFinancialSummary = () => {
    if (!user.transactions || user.transactions.length === 0) {
      return { totalIncome: 0, totalExpenses: 0 };
    }
    
    return user.transactions.reduce(
      (acc, transaction) => {
        if (["deposit", "disbursement"].includes(transaction.type)) {
          acc.totalIncome += transaction.amount;
        } else {
          acc.totalExpenses += Math.abs(transaction.amount);
        }
        return acc;
      },
      { totalIncome: 0, totalExpenses: 0 }
    );
  };

  const { totalIncome, totalExpenses } = calculateFinancialSummary();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Full Name</h4>
              <p className="text-base">{user.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
              <p className="text-base">{user.email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">User Type</h4>
              <p className="text-base capitalize">{user.role}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Account ID</h4>
              <p className="text-base">{user.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {user.role === "farmer" && (
        <>
          {user.preferredLender && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Landmark className="h-5 w-5 mr-2" />
                  Preferred Lending Partner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Lender Name</h4>
                    <p className="text-base">{user.preferredLender.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Interest Rate</h4>
                    <p className="text-base">{user.preferredLender.interestRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {financialData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Financial Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Current Balance</h4>
                    <p className="text-xl font-semibold text-green-600">
                      {formatCurrency(financialData.currentBalance)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Loan Amount</h4>
                    <p className="text-xl font-semibold text-blue-600">
                      {formatCurrency(financialData.loanAmount)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Income Source</h4>
                    <div className="flex items-center mt-1">
                      <Landmark className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{getIncomeSourceLabel(financialData.incomeSource)}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Farm Size</h4>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{financialData.farmSize ? `${financialData.farmSize} acres` : "Not specified"}</p>
                    </div>
                  </div>
                </div>

                {user.transactions && user.transactions.length > 0 && (
                  <>
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Total Income</h4>
                        <p className="text-lg font-medium text-green-600">
                          {formatCurrency(totalIncome)}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Total Expenses</h4>
                        <p className="text-lg font-medium text-red-600">
                          {formatCurrency(totalExpenses)}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileDetails;
