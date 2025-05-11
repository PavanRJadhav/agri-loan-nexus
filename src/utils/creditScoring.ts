
// Credit Scoring System for Farmer Loan Applications

interface CreditScoreFactors {
  landSize?: number;          // Land size in acres
  cropHistory?: string[];     // Past crops grown
  seasonalData?: {            // Seasonal farming data
    season: string;
    crop: string;
    yield: number;
  }[];
  marketPrices?: {            // Market prices for crops
    crop: string;
    pricePerUnit: number;
  }[];
  weatherData?: {             // Optional weather data
    rainfall: number;         // mm
    temperature: number;      // celsius
  };
  creditHistory?: {           // Optional previous loan history
    previousLoans: number;
    onTimePayments: number;
    missedPayments: number;
  };
  aadhaarVerified: boolean;   // Whether Aadhaar is verified
  previousLoanAmount?: number; // Previous loan amount if any
  previousLoanRepaid?: boolean; // Whether previous loan was repaid
  farmingExperience?: number; // Years of farming experience
}

export interface CreditScoreResult {
  score: number;              // 300-850 scale
  maxEligibleAmount: number;  // Maximum eligible loan amount
  riskLevel: 'Low' | 'Medium' | 'High';
  contributingFactors: string[]; // Factors that contributed to the score
  loanApprovalLikelihood: 'High' | 'Medium' | 'Low';
}

// Calculate credit score based on multiple factors
export const calculateCreditScore = (factors: CreditScoreFactors): CreditScoreResult => {
  let baseScore = 500; // Starting score
  const contributingFactors: string[] = [];

  // Aadhaar verification is mandatory
  if (!factors.aadhaarVerified) {
    return {
      score: 0,
      maxEligibleAmount: 0,
      riskLevel: 'High',
      contributingFactors: ['Aadhaar not verified'],
      loanApprovalLikelihood: 'Low'
    };
  }
  
  // Land size factor (larger land typically means more capacity)
  if (factors.landSize) {
    const landSizeScore = Math.min(factors.landSize * 10, 100);
    baseScore += landSizeScore;
    if (landSizeScore > 50) {
      contributingFactors.push('Substantial land ownership');
    }
  }
  
  // Crop diversity factor
  if (factors.cropHistory && factors.cropHistory.length > 0) {
    const uniqueCrops = new Set(factors.cropHistory).size;
    const cropDiversityScore = Math.min(uniqueCrops * 15, 75);
    baseScore += cropDiversityScore;
    if (cropDiversityScore > 30) {
      contributingFactors.push('Good crop diversity');
    }
  }
  
  // Seasonal data factor
  if (factors.seasonalData && factors.seasonalData.length > 0) {
    const averageYield = factors.seasonalData.reduce((sum, season) => sum + season.yield, 0) / factors.seasonalData.length;
    const seasonalScore = Math.min(averageYield * 5, 50);
    baseScore += seasonalScore;
    if (seasonalScore > 25) {
      contributingFactors.push('Strong seasonal yields');
    }
  }
  
  // Credit history factor (most important)
  if (factors.creditHistory) {
    const { previousLoans, onTimePayments, missedPayments } = factors.creditHistory;
    
    if (previousLoans > 0) {
      const repaymentRatio = onTimePayments / previousLoans;
      const creditHistoryScore = repaymentRatio * 100 - (missedPayments * 20);
      baseScore += Math.max(creditHistoryScore, -150); // Can heavily penalize score
      
      if (repaymentRatio > 0.8) {
        contributingFactors.push('Excellent repayment history');
      } else if (missedPayments > 2) {
        contributingFactors.push('Multiple missed payments detected');
      }
    }
  }
  
  // Previous loan repayment
  if (factors.previousLoanAmount) {
    if (factors.previousLoanRepaid) {
      baseScore += 75;
      contributingFactors.push('Successfully repaid previous loan');
    } else {
      baseScore -= 100;
      contributingFactors.push('Previous loan not fully repaid');
    }
  }
  
  // Farming experience
  if (factors.farmingExperience) {
    const experienceScore = Math.min(factors.farmingExperience * 5, 50);
    baseScore += experienceScore;
    if (experienceScore > 25) {
      contributingFactors.push('Significant farming experience');
    }
  }
  
  // Ensure score stays within valid range
  const finalScore = Math.max(300, Math.min(850, baseScore));
  
  // Determine risk level
  let riskLevel: 'Low' | 'Medium' | 'High';
  if (finalScore >= 700) {
    riskLevel = 'Low';
  } else if (finalScore >= 550) {
    riskLevel = 'Medium';
  } else {
    riskLevel = 'High';
  }
  
  // Calculate max eligible loan amount based on score
  // Formula: Base amount (50,000) + score factor * 1000
  const maxEligibleAmount = 50000 + (finalScore - 300) * 1000;
  
  // Determine loan approval likelihood
  let loanApprovalLikelihood: 'High' | 'Medium' | 'Low';
  if (finalScore >= 680) {
    loanApprovalLikelihood = 'High';
  } else if (finalScore >= 550) {
    loanApprovalLikelihood = 'Medium';
  } else {
    loanApprovalLikelihood = 'Low';
  }
  
  return {
    score: finalScore,
    maxEligibleAmount: Math.round(maxEligibleAmount / 1000) * 1000, // Round to nearest thousand
    riskLevel,
    contributingFactors: contributingFactors.length > 0 ? contributingFactors : ['Insufficient data for detailed analysis'],
    loanApprovalLikelihood
  };
};

// Simulate AI prediction for repayment ability
export const predictRepaymentAbility = (
  loanAmount: number, 
  creditScore: number, 
  monthlyIncome?: number
): { canRepay: boolean; confidence: number } => {
  // Basic affordability check
  if (monthlyIncome && loanAmount > monthlyIncome * 36) {
    return { canRepay: false, confidence: 0.85 };
  }
  
  // Credit score based prediction
  if (creditScore >= 700) {
    return { canRepay: true, confidence: 0.9 };
  } else if (creditScore >= 600) {
    return { canRepay: true, confidence: 0.7 };
  } else if (creditScore >= 500) {
    return { canRepay: loanAmount < 150000, confidence: 0.6 };
  } else {
    return { canRepay: loanAmount < 50000, confidence: 0.5 };
  }
};

// Generate recommendation based on credit analysis
export const generateLoanRecommendation = (
  creditScore: number,
  requestedAmount: number,
  maxEligibleAmount: number
): string => {
  if (requestedAmount > maxEligibleAmount) {
    return `The requested amount exceeds your eligible limit. We recommend applying for ₹${maxEligibleAmount.toLocaleString()} or less.`;
  }
  
  if (creditScore >= 700) {
    return "Your credit profile is strong. Consider exploring premium loan options with lower interest rates.";
  } else if (creditScore >= 600) {
    return "Your credit score is good. We recommend proceeding with the standard loan application.";
  } else {
    return "Your credit score indicates higher risk. Consider applying for a smaller loan amount or providing additional collateral.";
  }
};
