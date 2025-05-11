
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const NewLoanApplicationPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Apply for a Loan</h1>
        <p className="text-muted-foreground">
          Fill out the form below to submit a new loan application
        </p>
      </div>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>New Loan Application</CardTitle>
          <CardDescription>
            Please provide the necessary details for your loan application
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* This component will be implemented separately */}
          <div className="py-8 text-center text-muted-foreground">
            Loan application form will be displayed here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewLoanApplicationPage;
