
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { assessCreditworthiness, CreditAssessment } from "@/utils/creditScoring";

interface CreditScoreBoardProps {
  userData?: any;
  isVerifier?: boolean;
}

const CreditScoreBoard: React.FC<CreditScoreBoardProps> = ({ userData, isVerifier = false }) => {
  const { user } = useAuth();
  const [creditData, setCreditData] = useState<CreditAssessment | null>(null);
  
  useEffect(() => {
    const dataToUse = userData || user;
    if (dataToUse) {
      const assessment = assessCreditworthiness(dataToUse);
      setCreditData(assessment);
      console.log("Credit assessment:", assessment); // Debug log
    }
  }, [userData, user]);
  
  if (!creditData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Credit Assessment</CardTitle>
          <CardDescription>Loading credit data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-20 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-agriloan-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const { creditScore, creditLimit, category, riskScore, recommendations, color } = creditData;
  const scorePercentage = Math.round(creditScore * 100);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Assessment</CardTitle>
        <CardDescription>
          {isVerifier ? "Farmer's credit worthiness analysis" : "Your credit worthiness analysis"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Credit Score</span>
              <span className="text-sm font-medium">{scorePercentage}/100 - {category}</span>
            </div>
            <Progress value={scorePercentage} className={`h-3 ${color}`} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">Credit Limit</p>
              <p className="text-xl font-semibold">₹{creditLimit.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">Risk Score</p>
              <p className="text-xl font-semibold">{(riskScore * 100).toFixed(1)}%</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Recommendations</h4>
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  {scorePercentage >= 60 ? (
                    <Check className="mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-4 w-4 text-yellow-500 flex-shrink-0" />
                  )}
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditScoreBoard;
