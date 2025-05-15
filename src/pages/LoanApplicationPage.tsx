
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import LoanApplicationForm from "@/components/loans/LoanApplicationForm";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";

// Step components
import FarmDetailsStep from "@/components/loans/steps/FarmDetailsStep";
import FinancialDetailsStep from "@/components/loans/steps/FinancialDetailsStep";
import BankingInfoStep from "@/components/loans/steps/BankingInfoStep";
import DocumentUploadStep from "@/components/loans/steps/DocumentUploadStep";
import LenderSelectionStep from "@/components/loans/steps/LenderSelectionStep";
import ReviewSubmitStep from "@/components/loans/steps/ReviewSubmitStep";

// Define the steps of the application process
const STEPS = [
  { id: 1, title: "Farm Details", description: "Information about your farm" },
  { id: 2, title: "Financial Details", description: "Income and existing loans" },
  { id: 3, title: "Banking Information", description: "Your bank account details" },
  { id: 4, title: "Document Upload", description: "Required documents for verification" },
  { id: 5, title: "Select Lender", description: "Choose best interest rate offer" },
  { id: 6, title: "Review & Submit", description: "Verify your application details" }
];

const LoanApplicationPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({
    // Form state will be built up across steps
    farmDetails: {},
    financialDetails: {},
    bankingInfo: {},
    documents: [],
    selectedLender: null,
    loanType: "",
    amount: "",
    purpose: ""
  });
  
  const { toast: hookToast } = useToast();
  const navigate = useNavigate();
  const { addLoanApplication, updateUserData, user, addTransaction } = useAuth();
  
  // Check if lender is selected from previous page
  useEffect(() => {
    if (!user?.preferredLender) {
      toast.info("Please select a lender first", {
        description: "You need to select a lender before applying for a loan."
      });
      navigate("/lenders");
    } else {
      // Pre-fill the lender selection
      setFormData(prev => ({
        ...prev,
        selectedLender: user.preferredLender
      }));
    }
  }, [user?.preferredLender, navigate]);
  
  const handleStepComplete = (stepData: any) => {
    // Update form data with the data from the current step
    setFormData(prevData => ({
      ...prevData,
      ...stepData
    }));
    
    // Move to next step
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      console.info("Submitting loan application:", formData);
      
      // Create the loan application object
      const application = {
        id: `loan-${Date.now()}`,
        type: formData.loanType || "Farm Loan",
        amount: parseFloat(formData.amount),
        purpose: formData.purpose,
        lender: formData.selectedLender?.name || user?.preferredLender?.name || "Unknown Lender",
        status: "pending",
        submittedAt: new Date().toISOString(),
        paymentsMade: 0,
        amountRepaid: 0,
        // Include additional data from the steps
        farmDetails: formData.farmDetails,
        bankingInfo: formData.bankingInfo
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
      
      // Force refresh all data in localStorage
      refreshAllUserData();
      
      // Show success message
      toast.success("Application Submitted", {
        description: "Your loan application has been submitted successfully.",
      });
      
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
  
  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (STEPS.length - 1)) * 100;
  
  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <FarmDetailsStep onComplete={handleStepComplete} initialData={formData.farmDetails} />;
      case 2:
        return <FinancialDetailsStep onComplete={handleStepComplete} initialData={formData.financialDetails} />;
      case 3:
        return <BankingInfoStep onComplete={handleStepComplete} initialData={formData.bankingInfo} />;
      case 4:
        return <DocumentUploadStep onComplete={handleStepComplete} initialData={formData.documents} />;
      case 5:
        return (
          <LenderSelectionStep 
            onComplete={handleStepComplete} 
            initialData={formData.selectedLender} 
            preferredLender={user?.preferredLender}
          />
        );
      case 6:
        return (
          <ReviewSubmitStep 
            formData={formData} 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
          />
        );
      default:
        return null;
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
          Complete your loan application by following the steps below
        </p>
      </div>
      
      {/* Progress bar */}
      <div className="mb-8">
        <Progress value={progressPercentage} className="h-2 mb-4" />
        
        <div className="flex justify-between">
          {STEPS.map((step) => (
            <div key={step.id} className="relative flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.id < currentStep ? 'bg-green-500 text-white' : 
                  step.id === currentStep ? 'bg-primary text-white' : 
                  'bg-gray-200 text-gray-500'
                }`}
              >
                {step.id < currentStep ? <CheckCircle className="h-5 w-5" /> : step.id}
              </div>
              <span className={`text-xs mt-1 text-center hidden md:block ${
                step.id === currentStep ? 'font-medium text-primary' : ''
              }`}>
                {step.title}
              </span>
              <p className="text-xs hidden lg:block text-muted-foreground text-center w-24">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
          <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
          {currentStep === 6 && (
            <div className="mt-2 text-sm text-yellow-600">
              Note: A processing fee of ₹500 will be deducted upon application submission.
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          {renderStep()}
        </CardContent>
        
        {currentStep !== 6 && (
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBackStep}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            {/* Next button is handled by the step components */}
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default LoanApplicationPage;
