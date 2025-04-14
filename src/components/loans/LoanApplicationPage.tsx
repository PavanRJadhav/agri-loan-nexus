
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoanApplicationForm from "./LoanApplicationForm";
import { FileText, Clock, Check, ArrowRight } from "lucide-react";

const LoanApplicationPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Apply for a Loan</h2>
        <p className="text-muted-foreground">
          Fill out the form below to submit a new loan application.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="bg-green-50 border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-green-700">
              <FileText className="h-5 w-5 mr-2" />
              Step 1: Complete Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-green-700">
              Fill out all required fields with accurate information about your loan needs.
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-blue-700">
              <Clock className="h-5 w-5 mr-2" />
              Step 2: Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-blue-700">
              Our team will review your application within 2-3 business days.
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-purple-700">
              <Check className="h-5 w-5 mr-2" />
              Step 3: Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-purple-700">
              Once approved, funds will be disbursed to your registered bank account.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loan Application Form</CardTitle>
          <CardDescription>
            Please provide accurate information to expedite your loan approval process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoanApplicationForm />
        </CardContent>
      </Card>

      <div className="rounded-lg border p-4 bg-amber-50 border-amber-200">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-amber-200 p-2">
            <ArrowRight className="h-4 w-4 text-amber-700" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-amber-800">Need assistance with your application?</h4>
            <p className="text-xs text-amber-700">
              Contact our support team at support@agriloan.com or visit your nearest branch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationPage;
