
import React, { useState } from "react";
import { calculateCreditScore, CreditScoreResult, CreditScoreFactors, generateLoanRecommendation } from "@/utils/creditScoring";
import CreditScoreDisplay from "@/components/credit/CreditScoreDisplay";
import CreditScoreForm from "@/components/credit/CreditScoreForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const CreditScorePage: React.FC = () => {
  const { user, updateUserData } = useAuth();
  const [creditScore, setCreditScore] = useState<CreditScoreResult | undefined>(user?.creditScore);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleCreditFactorsSubmit = async (data: CreditScoreFactors) => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would send the data to a backend API
      // Here we'll simulate a delay for processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Calculate credit score
      const scoreResult = calculateCreditScore(data);
      
      // Save credit score to user profile
      updateUserData({ creditScore: scoreResult });
      
      // Update local state
      setCreditScore(scoreResult);
      
      // Show recommendation
      const recommendation = generateLoanRecommendation(
        scoreResult.score, 
        user?.loans?.[0]?.amount || 50000, 
        scoreResult.maxEligibleAmount
      );
      
      toast.info("Credit Score Analysis", {
        description: recommendation,
        duration: 8000,
      });
    } catch (error) {
      console.error("Error calculating credit score:", error);
      toast.error("Failed to calculate credit score", {
        description: "Please try again later"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Credit Score</h1>
        <p className="text-muted-foreground">
          Analyze your farming data to determine your loan eligibility and creditworthiness
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <CreditScoreDisplay 
            creditResult={creditScore} 
            isLoading={isLoading}
            onRequestCreditCheck={() => {
              document.getElementById('credit-form')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
          
          {creditScore && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Loan Recommendations</CardTitle>
                <CardDescription>Based on your credit profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {creditScore.score >= 700 ? (
                    <>
                      <p className="text-green-600 font-medium">You qualify for premium loan options!</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Lower interest rates available</li>
                        <li>Higher loan amounts up to ₹{creditScore.maxEligibleAmount.toLocaleString()}</li>
                        <li>Flexible repayment options</li>
                        <li>Minimal documentation required</li>
                      </ul>
                    </>
                  ) : creditScore.score >= 550 ? (
                    <>
                      <p className="text-yellow-600 font-medium">You qualify for standard loan options</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Standard interest rates</li>
                        <li>Loan amounts up to ₹{creditScore.maxEligibleAmount.toLocaleString()}</li>
                        <li>Standard documentation required</li>
                      </ul>
                    </>
                  ) : (
                    <>
                      <p className="text-red-600 font-medium">Limited loan options available</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Higher interest rates may apply</li>
                        <li>Loan amounts limited to ₹{creditScore.maxEligibleAmount.toLocaleString()}</li>
                        <li>Additional collateral may be required</li>
                        <li>More documentation needed</li>
                      </ul>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="md:col-span-7" id="credit-form">
          <CreditScoreForm onSubmit={handleCreditFactorsSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default CreditScorePage;
