// Add export to the CreditScoreFactors interface to make it accessible
export interface CreditScoreFactors {
  loanAmount: number;
  incomeSource: string;
  farmSize: 'small' | 'medium' | 'large';
  experience: 'novice' | 'experienced' | 'expert';
  repaymentHistory: number;
}

// Original interface
export interface CreditScoreFactors2 {
  paymentHistory: 'good' | 'average' | 'poor';
  cropYields: 'high' | 'medium' | 'low';
  landOwnership: 'owned' | 'leased' | 'partial';
  farmingExperience: 'novice' | 'experienced' | 'expert';
  existingLoans: 'none' | 'few' | 'many';
  marketVolatility: 'stable' | 'moderate' | 'volatile';
  landSize: 'small' | 'medium' | 'large';
  weatherImpact: 'minimal' | 'moderate' | 'severe';
  incomeStability: 'stable' | 'seasonal' | 'volatile';
  insuranceCoverage: 'high' | 'partial' | 'none';
}

export interface CreditScoreResult {
  score: number;
  maxEligibleAmount: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  contributingFactors: string[];
  loanApprovalLikelihood: 'High' | 'Medium' | 'Low';
}

export const calculateCreditScore = (factors: CreditScoreFactors): CreditScoreResult => {
  // Convert simple form factors to a more comprehensive credit assessment
  const mappedFactors = {
    paymentHistory: factors.repaymentHistory > 80 ? 'good' : factors.repaymentHistory > 60 ? 'average' : 'poor',
    farmingExperience: factors.experience,
    landSize: factors.farmSize,
    // Default values for other factors
    cropYields: 'medium' as const,
    landOwnership: 'owned' as const,
    existingLoans: 'few' as const,
    marketVolatility: 'moderate' as const,
    weatherImpact: 'moderate' as const,
    incomeStability: 'seasonal' as const,
    insuranceCoverage: 'partial' as const
  };
  
  let score = 500; // Base score

  // Factor: Payment history
  switch (mappedFactors.paymentHistory) {
    case 'good': score += 150; break;
    case 'average': score += 50; break;
    case 'poor': score -= 100; break;
  }

  // Factor: Farming experience
  switch (mappedFactors.farmingExperience) {
    case 'expert': score += 70; break;
    case 'experienced': score += 50; break;
    case 'novice': score -= 20; break;
  }

  // Factor: Land size
  switch (mappedFactors.landSize) {
    case 'large': score += 60; break;
    case 'medium': score += 30; break;
    case 'small': score -= 10; break;
  }

  // Loan amount adjustment (higher loan amounts are slightly riskier)
  const loanAmountFactor = Math.min(100, Math.max(-100, (500000 - factors.loanAmount) / 10000));
  score += loanAmountFactor;

  // Other factors
  switch (mappedFactors.cropYields) {
    case 'high': score += 100; break;
    case 'medium': score += 50; break;
    case 'low': score -= 50; break;
  }

  switch (mappedFactors.landOwnership) {
    case 'owned': score += 80; break;
    case 'leased': score -= 30; break;
    case 'partial': score += 40; break;
  }

  switch (mappedFactors.existingLoans) {
    case 'none': score += 100; break;
    case 'few': score += 30; break;
    case 'many': score -= 70; break;
  }

  switch (mappedFactors.marketVolatility) {
    case 'stable': score += 50; break;
    case 'moderate': score -= 20; break;
    case 'volatile': score -= 80; break;
  }

  switch (mappedFactors.weatherImpact) {
    case 'minimal': score += 40; break;
    case 'moderate': score -= 10; break;
    case 'severe': score -= 50; break;
  }

  switch (mappedFactors.incomeStability) {
    case 'stable': score += 70; break;
    case 'seasonal': score += 20; break;
    case 'volatile': score -= 40; break;
  }

  switch (mappedFactors.insuranceCoverage) {
    case 'high': score += 50; break;
    case 'partial': score += 20; break;
    case 'none': score -= 30; break;
  }

  // Cap the score between 300 and 850
  score = Math.max(300, Math.min(score, 850));

  // Determine risk level
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Medium';
  if (score >= 700) {
    riskLevel = 'Low';
  } else if (score < 550) {
    riskLevel = 'High';
  }

  // Determine loan approval likelihood
  let loanApprovalLikelihood: 'High' | 'Medium' | 'Low' = 'Medium';
  if (score >= 700) {
    loanApprovalLikelihood = 'High';
  } else if (score < 550) {
    loanApprovalLikelihood = 'Low';
  }

  // Determine contributing factors
  const contributingFactors: string[] = [];
  
  // Add factors based on form data
  if (factors.repaymentHistory < 60) contributingFactors.push('Poor payment history');
  if (factors.experience === 'novice') contributingFactors.push('Limited farming experience');
  if (factors.farmSize === 'small') contributingFactors.push('Small farm size');
  
  // Add default factors if needed
  if (contributingFactors.length === 0) {
    if (score < 600) {
      contributingFactors.push('Multiple risk factors');
    } else {
      contributingFactors.push('Good overall credit profile');
    }
  }

  // Calculate max eligible loan amount based on score
  let maxEligibleAmount = 10000; // Base amount
  if (score >= 700) {
    maxEligibleAmount = 500000;
  } else if (score >= 600) {
    maxEligibleAmount = 300000;
  } else if (score >= 550) {
    maxEligibleAmount = 200000;
  } else if (score >= 500) {
    maxEligibleAmount = 100000;
  } else if (score >= 450) {
    maxEligibleAmount = 50000;
  }

  return {
    score: Math.round(score),
    maxEligibleAmount,
    riskLevel,
    contributingFactors,
    loanApprovalLikelihood,
  };
};

export const generateLoanRecommendation = (creditScore: number, currentLoanAmount: number, maxEligibleAmount: number): string => {
  if (creditScore >= 700) {
    return `Congratulations! With a credit score of ${creditScore}, you are eligible for loans up to ₹${maxEligibleAmount.toLocaleString()} with favorable interest rates.`;
  } else if (creditScore >= 550) {
    return `With a credit score of ${creditScore}, you are eligible for standard loan options up to ₹${maxEligibleAmount.toLocaleString()}.`;
  } else {
    return `With a credit score of ${creditScore}, loan options may be limited. Consider improving your credit score to access better loan terms. You may be eligible for loans up to ₹${maxEligibleAmount.toLocaleString()}.`;
  }
};
