// Add export to the CreditScoreFactors interface to make it accessible
export interface CreditScoreFactors {
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
  let score = 500; // Base score

  // Adjust score based on factors
  switch (factors.paymentHistory) {
    case 'good': score += 150; break;
    case 'average': score += 50; break;
    case 'poor': score -= 100; break;
  }

  switch (factors.cropYields) {
    case 'high': score += 100; break;
    case 'medium': score += 50; break;
    case 'low': score -= 50; break;
  }

  switch (factors.landOwnership) {
    case 'owned': score += 80; break;
    case 'leased': score -= 30; break;
    case 'partial': score += 40; break;
  }

  switch (factors.farmingExperience) {
    case 'expert': score += 70; break;
    case 'experienced': score += 50; break;
    case 'novice': score -= 20; break;
  }

  switch (factors.existingLoans) {
    case 'none': score += 100; break;
    case 'few': score += 30; break;
    case 'many': score -= 70; break;
  }

  switch (factors.marketVolatility) {
    case 'stable': score += 50; break;
    case 'moderate': score -= 20; break;
    case 'volatile': score -= 80; break;
  }

   switch (factors.landSize) {
    case 'large': score += 60; break;
    case 'medium': score += 30; break;
    case 'small': score -= 10; break;
  }

  switch (factors.weatherImpact) {
    case 'minimal': score += 40; break;
    case 'moderate': score -= 10; break;
    case 'severe': score -= 50; break;
  }

  switch (factors.incomeStability) {
    case 'stable': score += 70; break;
    case 'seasonal': score += 20; break;
    case 'volatile': score -= 40; break;
  }

  switch (factors.insuranceCoverage) {
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
  if (factors.paymentHistory === 'poor') contributingFactors.push('Poor payment history');
  if (factors.cropYields === 'low') contributingFactors.push('Low crop yields');
  if (factors.landOwnership === 'leased') contributingFactors.push('Leased land');
  if (factors.existingLoans === 'many') contributingFactors.push('Many existing loans');
  if (factors.marketVolatility === 'volatile') contributingFactors.push('Volatile market');
  if (factors.incomeStability === 'volatile') contributingFactors.push('Volatile income');
  if (factors.insuranceCoverage === 'none') contributingFactors.push('No insurance coverage');

  // Calculate max eligible loan amount
  let maxEligibleAmount = 10000; // Base amount
  if (riskLevel === 'Low') {
    maxEligibleAmount = 500000;
  } else if (riskLevel === 'Medium') {
    maxEligibleAmount = 200000;
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
