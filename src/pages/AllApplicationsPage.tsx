
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, FileText, ArrowUp, ArrowDown } from "lucide-react";

const AllApplicationsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Process all loans from all users
  const getAllLoans = () => {
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
            allLoans.push({
              userId: userData.id || 'unknown',
              userName: userData.name || email.split('@')[0],
              userEmail: email,
              loan
            });
          });
        }
      }
    }
    
    return allLoans;
  };
  
  const allLoans = getAllLoans();
  
  // Filter loans based on active tab
  const filteredLoans = allLoans.filter(item => {
    if (activeTab === 'all') return true;
    return item.loan.status === activeTab;
  });
  
  // Sort by date (newest first)
  const sortedLoans = [...filteredLoans].sort((a, b) => 
    new Date(b.loan.submittedAt).getTime() - new Date(a.loan.submittedAt).getTime()
  );
  
  // Stats for summary cards
  const totalApplications = allLoans.length;
  const pendingApplications = allLoans.filter(item => item.loan.status === 'pending').length;
  const approvedApplications = allLoans.filter(item => item.loan.status === 'approved').length;
  const rejectedApplications = allLoans.filter(item => item.loan.status === 'rejected').length;
  
  // Calculate total approved amount
  const totalApprovedAmount = allLoans
    .filter(item => item.loan.status === 'approved')
    .reduce((sum, item) => sum + (item.loan.amount || 0), 0);
  
  const handleApproveLoan = (userEmail: string, loanId: string, amount: number) => {
    // Get the user data
    const userDataKey = `agriloan_userdata_${userEmail}`;
    const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
    
    if (!userData.loans) return;
    
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
    
    // Update user data
    userData.loans = updatedLoans;
    userData.transactions = [...(userData.transactions || []), newTransaction];
    
    // Save back to localStorage
    localStorage.setItem(userDataKey, JSON.stringify(userData));
    
    toast.success("Loan approved successfully", {
      description: `Loan for ${userEmail} has been approved and funds have been disbursed.`
    });
    
    // Refresh data by re-rendering
    setActiveTab(activeTab);
  };
  
  const handleRejectLoan = (userEmail: string, loanId: string) => {
    // Get the user data
    const userDataKey = `agriloan_userdata_${userEmail}`;
    const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
    
    if (!userData.loans) return;
    
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
    
    // Refresh data by re-rendering
    setActiveTab(activeTab);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">All Applications</h2>
        <p className="text-muted-foreground">
          Monitor and manage all loan applications
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
              <p className="text-2xl font-bold">{totalApplications}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{pendingApplications}</p>
            </div>
            <ArrowUp className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold">{approvedApplications}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Disbursed</p>
              <p className="text-2xl font-bold">₹{totalApprovedAmount.toLocaleString()}</p>
            </div>
            <ArrowDown className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Loan Applications</CardTitle>
          <CardDescription>
            Review all loan applications in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              {sortedLoans.length > 0 ? (
                <div className="space-y-4">
                  {sortedLoans.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{item.userName}</h3>
                          <p className="text-sm text-muted-foreground">{item.userEmail}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-lg">₹{item.loan.amount?.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{item.loan.type}</p>
                          <div className={`
                            mt-2 px-2 py-1 rounded text-xs font-medium inline-block
                            ${item.loan.status === 'approved' ? 'bg-green-100 text-green-800' : 
                              item.loan.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}
                          `}>
                            {item.loan.status.charAt(0).toUpperCase() + item.loan.status.slice(1)}
                          </div>
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
                      
                      {item.loan.status === 'pending' && (
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
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-lg font-medium">No applications found</p>
                  <p className="text-muted-foreground">There are no loan applications matching the selected filter</p>
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllApplicationsPage;
