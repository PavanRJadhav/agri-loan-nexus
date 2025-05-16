
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import FarmDetailsStep from './steps/FarmDetailsStep';
import FinancialDetailsStep from './steps/FinancialDetailsStep';
import DocumentUploadStep from './steps/DocumentUploadStep';
import BankingInfoStep from './steps/BankingInfoStep';
import ReviewSubmitStep from './steps/ReviewSubmitStep';

const LoanApplicationContainer: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({
    farmDetails: {},
    financialDetails: {},
    documents: [],
    bankingInfo: {},
    selectedLender: user?.preferredLender || null,
    amount: '50000', // Default amount
    purpose: 'Crop cultivation',
    loanType: 'Standard Agricultural Loan'
  });

  // Determine current step based on URL path
  const getCurrentStep = () => {
    const path = location.pathname;
    if (path.includes('farm-details')) return 'farm-details';
    if (path.includes('financial-details')) return 'financial-details';
    if (path.includes('document-upload')) return 'document-upload';
    if (path.includes('banking-info')) return 'banking-info';
    if (path.includes('review')) return 'review';
    return 'farm-details'; // Default
  };

  // Load saved application data from localStorage
  useEffect(() => {
    if (user?.id) {
      const applicationDataKey = `loan_application_${user.id}`;
      const savedData = localStorage.getItem(applicationDataKey);
      
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          if (parsedData.data) {
            setFormData(prevData => ({
              ...prevData,
              ...parsedData.data
            }));
          }
        } catch (error) {
          console.error("Error loading saved application data:", error);
        }
      }
    }
  }, [user?.id]);

  // Save application data and navigate to next step
  const handleStepComplete = (stepData: any, nextStep: string) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);

    // Save to localStorage
    if (user?.id) {
      const applicationDataKey = `loan_application_${user.id}`;
      const currentStep = getCurrentStepIndex();
      
      const dataToSave = {
        step: currentStep + 1,
        data: updatedData,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(applicationDataKey, JSON.stringify(dataToSave));
    }

    // Navigate to next step
    navigate(`/loan-applications/${nextStep}`);
  };

  // Get current step index (0-4)
  const getCurrentStepIndex = () => {
    const currentStep = getCurrentStep();
    const steps = ['farm-details', 'financial-details', 'document-upload', 'banking-info', 'review'];
    return steps.indexOf(currentStep);
  };

  // Handle submission of the entire application
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate processing
    setTimeout(() => {
      // Add the application to user's loans in localStorage
      if (user?.id && user?.email) {
        try {
          const userDataKey = `agriloan_userdata_${user.email}`;
          const userData = localStorage.getItem(userDataKey);
          
          if (userData) {
            const parsedUserData = JSON.parse(userData);
            
            // Create new loan application
            const newLoan = {
              id: `loan-${Date.now()}`,
              amount: parseFloat(formData.amount) || 50000,
              date: new Date().toISOString(),
              type: formData.loanType || 'Standard Agricultural Loan',
              purpose: formData.purpose || 'Crop cultivation',
              status: 'pending',
              lender: user.preferredLender?.name || 'Default Lender',
              documents: formData.documents,
              farmDetails: formData.farmDetails,
              financialDetails: formData.financialDetails,
              bankingInfo: formData.bankingInfo
            };

            // Deduct processing fee from account balance
            const processingFee = 500;
            if (parsedUserData.accountBalance) {
              parsedUserData.accountBalance -= processingFee;
            }
            
            // Add the new loan to user data
            if (!parsedUserData.loans) {
              parsedUserData.loans = [];
            }
            parsedUserData.loans.push(newLoan);
            
            // Save updated user data
            localStorage.setItem(userDataKey, JSON.stringify(parsedUserData));
            
            // Clear application data
            const applicationDataKey = `loan_application_${user.id}`;
            localStorage.removeItem(applicationDataKey);
            
            // Show success toast
            toast.success("Loan application submitted successfully", {
              description: `A processing fee of ₹${processingFee} has been deducted from your account.`
            });
          }
        } catch (error) {
          console.error("Error saving loan application:", error);
          toast.error("Error submitting application");
        }
      }
      
      setIsSubmitting(false);
      
      // Redirect to dashboard
      navigate("/dashboard");
    }, 2000); // Simulate processing time
  };

  // Render the appropriate step based on the current URL
  const renderStep = () => {
    const currentStep = getCurrentStep();
    
    switch (currentStep) {
      case 'farm-details':
        return (
          <FarmDetailsStep
            onComplete={(data) => handleStepComplete(data, 'financial-details')}
            initialData={formData.farmDetails}
          />
        );
      case 'financial-details':
        return (
          <FinancialDetailsStep
            onComplete={(data) => handleStepComplete(data, 'document-upload')}
            initialData={formData.financialDetails}
          />
        );
      case 'document-upload':
        return (
          <DocumentUploadStep
            onComplete={(data) => handleStepComplete(data, 'banking-info')}
            initialData={formData.documents}
          />
        );
      case 'banking-info':
        return (
          <BankingInfoStep
            onComplete={(data) => handleStepComplete(data, 'review')}
            initialData={formData.bankingInfo}
          />
        );
      case 'review':
        return (
          <ReviewSubmitStep
            formData={formData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return (
          <FarmDetailsStep
            onComplete={(data) => handleStepComplete(data, 'financial-details')}
            initialData={formData.farmDetails}
          />
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {renderStep()}
    </div>
  );
};

export default LoanApplicationContainer;
