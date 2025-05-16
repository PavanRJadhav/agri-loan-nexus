
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  CheckIcon,
  CreditCard,
  FileText,
  Building2,
  ChevronRight,
  BanknoteIcon,
  FileCheck
} from "lucide-react";

const steps = [
  {
    id: "farm-details",
    title: "Farm Details",
    description: "Information about your farm",
    icon: Building2,
    path: "/loan-applications/farm-details"
  },
  {
    id: "financial-details",
    title: "Financial Details",
    description: "Your financial information",
    icon: BanknoteIcon,
    path: "/loan-applications/financial-details"
  },
  {
    id: "document-upload",
    title: "Document Upload",
    description: "Upload required documents",
    icon: FileText,
    path: "/loan-applications/document-upload"
  },
  {
    id: "banking-info",
    title: "Banking Information",
    description: "Your banking details",
    icon: CreditCard,
    path: "/loan-applications/banking-info"
  },
  {
    id: "review",
    title: "Review & Submit",
    description: "Review and submit application",
    icon: FileCheck,
    path: "/loan-applications/review"
  }
];

const LoanApplicationSteps: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if lender is selected
    if (!user?.preferredLender) {
      toast.info("Please select a lender first", {
        description: "You need to select a lender before applying for a loan."
      });
      navigate("/lenders");
    }
  }, [user?.preferredLender, navigate]);

  useEffect(() => {
    // Initialize step data in localStorage if not already there
    const applicationDataKey = `loan_application_${user?.id}`;
    const savedData = localStorage.getItem(applicationDataKey);
    
    if (!savedData) {
      const initialData = {
        step: 0,
        data: {
          farmDetails: {},
          financialDetails: {},
          documents: [],
          bankingInfo: {}
        },
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(applicationDataKey, JSON.stringify(initialData));
    } else {
      // Load current step from saved data
      const parsedData = JSON.parse(savedData);
      setCurrentStep(parsedData.step || 0);
    }
  }, [user?.id]);

  const handleStepClick = (index: number) => {
    // Don't allow skipping ahead more than one step
    if (index > currentStep + 1) {
      toast.error("Please complete the previous steps first");
      return;
    }
    
    navigate(steps[index].path);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Loan Application</h2>
        <p className="text-muted-foreground">
          Complete the steps below to apply for a loan with {user?.preferredLender?.name || "your selected lender"}
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Application Steps</CardTitle>
          <CardDescription>
            Follow these steps to complete your loan application.
            <span className="block mt-2 text-yellow-600">Note: A processing fee of ₹500 will be deducted upon application submission.</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/4 space-y-2">
              {steps.map((step, index) => (
                <Button
                  key={step.id}
                  variant={index === currentStep ? "default" : "outline"}
                  className={`w-full justify-start mb-2 ${
                    index < currentStep ? "bg-green-50 text-green-700 border-green-300" : ""
                  }`}
                  onClick={() => handleStepClick(index)}
                  disabled={index > currentStep + 1}
                >
                  <div className="flex items-center w-full">
                    {index < currentStep ? (
                      <CheckIcon className="mr-2 h-4 w-4 text-green-600" />
                    ) : (
                      <step.icon className="mr-2 h-4 w-4" />
                    )}
                    <span>{step.title}</span>
                    
                    {index === currentStep && (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    )}
                  </div>
                </Button>
              ))}
            </div>
            
            <div className="md:w-3/4 p-4 bg-gray-50 rounded-lg min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Ready to Start Your Application?</h3>
                <p className="mb-4 text-gray-600">Click on "Farm Details" to begin the application process</p>
                <Button 
                  onClick={() => navigate(steps[0].path)}
                  className="mt-4"
                >
                  Start Application
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanApplicationSteps;
