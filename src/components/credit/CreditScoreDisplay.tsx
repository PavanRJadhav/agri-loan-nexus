
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CreditScoreResult } from "@/utils/creditScoring";
import { CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreditScoreDisplayProps {
  creditResult?: CreditScoreResult;
  isLoading?: boolean;
  onRequestCreditCheck?: () => void;
}

const CreditScoreDisplay: React.FC<CreditScoreDisplayProps> = ({
  creditResult,
  isLoading = false,
  onRequestCreditCheck
}) => {
  // Function to determine score color based on range
  const getScoreColor = (score: number) => {
    if (score >= 700) return "text-green-600";
    if (score >= 550) return "text-yellow-600";
    return "text-red-600";
  };
  
  // Function to determine progress color
  const getProgressColor = (score: number) => {
    if (score >= 700) return "bg-green-500";
    if (score >= 550) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  if (!creditResult && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Credit Score</CardTitle>
          <CardDescription>
            Your credit score helps determine loan eligibility
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="mb-4 text-muted-foreground">
            No credit score available. Get your AI-powered credit score to improve loan approval chances.
          </p>
          <Button onClick={onRequestCreditCheck}>
            Check My Credit Score
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Credit Score</CardTitle>
          <CardDescription>
            Analyzing your farming and financial data...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-6">
          <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-blue-500 animate-pulse" 
              style={{ width: '60%' }}
            ></div>
          </div>
          <p className="text-muted-foreground">Please wait while our AI evaluates your credit worthiness</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Farmer Credit Score</CardTitle>
        <CardDescription>
          Based on your farming history, crop data & financial records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-6">
          <div className="text-5xl font-bold mb-1 flex items-center gap-2">
            <span className={getScoreColor(creditResult.score)}>
              {creditResult.score}
            </span>
            {creditResult.score >= 700 && (
              <CheckCircle className="h-6 w-6 text-green-500" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            Score range: 300-850
          </p>
          <div className="w-full mt-2">
            <Progress 
              value={(creditResult.score - 300) / 5.5} 
              className={`h-3 ${getProgressColor(creditResult.score)}`}
            />
            <div className="flex justify-between text-xs mt-1 text-muted-foreground">
              <span>300</span>
              <span>Poor</span>
              <span>Fair</span>
              <span>Good</span>
              <span>850</span>
            </div>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 mb-4">
          <div className="p-3 bg-gray-100 rounded-md">
            <p className="text-sm font-medium">Max Eligible Loan</p>
            <p className="text-lg font-bold">₹{creditResult.maxEligibleAmount.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-gray-100 rounded-md">
            <p className="text-sm font-medium">Risk Level</p>
            <p className={`text-lg font-bold ${
              creditResult.riskLevel === 'Low' ? 'text-green-600' : 
              creditResult.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {creditResult.riskLevel}
            </p>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Contributing Factors</p>
          <ul className="text-sm space-y-1">
            {creditResult.contributingFactors.map((factor, index) => (
              <li key={index} className="flex items-center gap-2">
                {factor.toLowerCase().includes('not') || factor.toLowerCase().includes('missed') ? (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                {factor}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
          <div className="flex items-center gap-2 text-blue-700">
            <ArrowRight className="h-4 w-4" />
            <p className="text-sm font-medium">Approval Likelihood: {creditResult.loanApprovalLikelihood}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditScoreDisplay;
