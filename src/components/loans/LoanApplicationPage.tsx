
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import LoanApplicationForm from "./LoanApplicationForm";
import { useAuth } from "@/contexts/AuthContext";

const LoanApplicationPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast: hookToast } = useToast();
  const navigate = useNavigate();
  const { addLoanApplication, updateUserData, user, addTransaction } = useAuth();
  
  // Check if lender is selected
  useEffect(() => {
    if (!user?.preferredLender) {
      toast.info("Please select a lender first", {
        description: "You need to select a lender before applying for a loan."
      });
      navigate("/lenders");
    }
  }, [user?.preferredLender, navigate]);
  
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Log submission
      console.info("Submitting loan application:", data);
      
      // Get the selected loan type name
      const loanTypeName = data.loanType;
      
      // Add loan application with proper submission date and initial pending status
      const application = {
        id: `loan-${Date.now()}`,
        type: loanTypeName,
        amount: parseFloat(data.amount),
        purpose: data.purpose,
        lender: user?.preferredLender?.name || "Unknown Lender",
        status: "pending",
        submittedAt: new Date().toISOString(),
        paymentsMade: 0,
        amountRepaid: 0
      };
      
      // Add application to user's loans
      await addLoanApplication(application);
      
      // Add application fee deduction (Rs. 500)
      const currentBalance = user?.financialData?.currentBalance || 0;
      await updateUserData({
        financialData: {
          ...user?.financialData,
          currentBalance: Math.max(0, currentBalance - 500) // Ensure balance doesn't go negative
        }
      });
      
      // Add transaction for application fee
      if (user) {
        await addTransaction({
          amount: 500,
          type: "payment",
          description: "Loan application processing fee"
        });
      }
      
      // Show success message
      toast.success("Application Submitted", {
        description: "Your loan application has been submitted successfully.",
      });
      
      // Force refresh all relevant data in localStorage
      refreshAllUserData();
      
      // Navigate back to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Submission Failed", {
        description: "There was a problem submitting your application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to refresh all user data in localStorage
  const refreshAllUserData = () => {
    // First refresh current user's data
    if (user?.email) {
      const userDataKey = `agriloan_userdata_${user.email}`;
      const userData = localStorage.getItem(userDataKey);
      if (userData) {
        const parsedData = JSON.parse(userData);
        // Make sure the updated data is saved back
        localStorage.setItem(userDataKey, JSON.stringify(parsedData));
      }
    }
    
    // Then also refresh all other users' data to ensure admins and verifiers see updates
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('agriloan_userdata_') && (!user?.email || !key.includes(user.email))) {
        try {
          const otherUserData = localStorage.getItem(key);
          if (otherUserData) {
            const parsedData = JSON.parse(otherUserData);
            localStorage.setItem(key, JSON.stringify(parsedData));
          }
        } catch (error) {
          console.error("Error refreshing other user data:", error);
        }
      }
    }
  };
  
  if (!user?.preferredLender) {
    return null; // Don't render anything while redirecting
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Loan Application</h2>
        <p className="text-muted-foreground">
          Fill out the form below to apply for an agricultural loan with {user?.preferredLender?.name}
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>New Loan Application</CardTitle>
          <CardDescription>
            Please provide the required information to process your loan application.
            <span className="block mt-2 text-yellow-600">Note: A processing fee of ₹500 will be deducted upon application submission.</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoanApplicationForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanApplicationPage;
