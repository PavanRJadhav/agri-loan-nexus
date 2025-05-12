
/**
 * Credit Scoring Algorithm implementation based on AgriCred methodology
 */

// Parameters and their weights
const DEFAULT_WEIGHTS = {
  landholding: 0.25,   // w1
  cropYield: 0.25,     // w2
  repaymentRecord: 0.3, // w3
  inputDemand: 0.2,    // w4
  bias: -2.5           // b - bias term
};

// Sigmoid function for logistic regression
const sigmoid = (z: number): number => {
  return 1 / (1 + Math.exp(-z));
};

// Interface for farmer credit data
export interface FarmerCreditData {
  landholding: number;          // in acres
  cropYield: number;            // normalized 0-10 scale
  repaymentRecord: number;      // normalized 0-10 scale
  inputDemand: number;          // normalized 0-10 scale
  missedDueDays?: number;       // number of days payment was late
  totalDueDays?: number;        // total number of days payments were due
  latePayments?: number;        // number of late payments
  totalPayments?: number;       // total number of payments
}

// Calculate Creditworthiness Score (CWS)
export const calculateCWS = (data: FarmerCreditData, weights = DEFAULT_WEIGHTS): number => {
  const z = 
    weights.landholding * data.landholding + 
    weights.cropYield * data.cropYield + 
    weights.repaymentRecord * data.repaymentRecord + 
    weights.inputDemand * data.inputDemand + 
    weights.bias;
  
  return sigmoid(z);
};

// Calculate Credit Limit based on CWS
export const calculateCreditLimit = (cws: number, baseCreditLimit: number = 50000): number => {
  // Scale credit limit based on CWS
  return Math.round(cws * baseCreditLimit * 2); // Maximum of 2x base credit limit
};

// Calculate Risk Score (RS)
export const calculateRiskScore = (
  data: FarmerCreditData, 
  penaltyFactor: number = 1.5
): number => {
  if (!data.missedDueDays || !data.totalDueDays || !data.latePayments || !data.totalPayments) {
    return 0; // Not enough data to calculate risk
  }
  
  const missedRatio = data.missedDueDays / Math.max(data.totalDueDays, 1);
  const lateRatio = data.latePayments / Math.max(data.totalPayments, 1);
  
  return missedRatio + (penaltyFactor * lateRatio);
};

// Calculate Subsidy Savings
export interface SubsidyTransaction {
  amount: number;
  subsidyRate: number;
}

export const calculateSubsidySavings = (transactions: SubsidyTransaction[]): number => {
  return transactions.reduce((total, transaction) => {
    return total + (transaction.amount * transaction.subsidyRate);
  }, 0);
};

// Credit score categories
export const getCreditScoreCategory = (cws: number): string => {
  if (cws >= 0.9) return "Excellent";
  if (cws >= 0.8) return "Very Good";
  if (cws >= 0.6) return "Good";
  if (cws >= 0.4) return "Fair";
  return "Poor";
};

// Color for credit score visualization
export const getCreditScoreColor = (cws: number): string => {
  if (cws >= 0.9) return "bg-green-500";
  if (cws >= 0.8) return "bg-green-400";
  if (cws >= 0.6) return "bg-yellow-400";
  if (cws >= 0.4) return "bg-orange-400";
  return "bg-red-500";
};

// Generate mock credit data for a user based on their existing data
export const generateMockCreditData = (userData: any): FarmerCreditData => {
  // Get the number of loans
  const loanCount = userData?.loans?.length || 0;
  const approvedLoanCount = userData?.loans?.filter((loan: any) => loan.status === 'approved').length || 0;
  const rejectedLoanCount = userData?.loans?.filter((loan: any) => loan.status === 'rejected').length || 0;
  
  // Base repayment record on the ratio of approved to total loans
  const repaymentRecord = loanCount > 0 
    ? 5 + (5 * (approvedLoanCount / loanCount))
    : 5; // Default to middle value if no loans
  
  // More loans generally means more land to farm
  const landholding = 2 + (loanCount * 0.5);
  
  // Random but realistic values for other metrics
  const cropYield = 5 + (Math.random() * 5);
  const inputDemand = 4 + (Math.random() * 6);
  
  // Payment history based on transaction history
  const totalPayments = userData?.transactions?.filter((t: any) => t.type === 'payment').length || 0;
  const latePayments = Math.floor(totalPayments * (rejectedLoanCount > 0 ? 0.3 : 0.1));
  
  return {
    landholding,
    cropYield,
    repaymentRecord,
    inputDemand,
    missedDueDays: latePayments * 4, // Assume average 4 days late per late payment
    totalDueDays: totalPayments * 30, // Assume monthly payments
    latePayments,
    totalPayments
  };
};

// Calculate overall score and recommendations
export interface CreditAssessment {
  creditScore: number; // 0-1 scale
  creditLimit: number;
  category: string;
  riskScore: number;
  recommendations: string[];
  color: string;
}

export const assessCreditworthiness = (userData: any): CreditAssessment => {
  const mockData = generateMockCreditData(userData);
  const creditScore = calculateCWS(mockData);
  const creditLimit = calculateCreditLimit(creditScore);
  const riskScore = calculateRiskScore(mockData);
  const category = getCreditScoreCategory(creditScore);
  const color = getCreditScoreColor(creditScore);
  
  // Generate recommendations based on score
  const recommendations: string[] = [];
  
  if (creditScore < 0.4) {
    recommendations.push("Establish consistent repayment history");
    recommendations.push("Consider starting with smaller loan amounts");
  } else if (creditScore < 0.6) {
    recommendations.push("Improve crop yield with better farming practices");
    recommendations.push("Maintain timely repayment of existing loans");
  } else if (creditScore < 0.8) {
    recommendations.push("Optimize input usage for better efficiency");
    recommendations.push("Consider expanding landholding if possible");
  } else {
    recommendations.push("Eligible for premium lending rates");
    recommendations.push("Consider diversifying crops for additional income");
  }
  
  return {
    creditScore,
    creditLimit,
    category,
    riskScore,
    recommendations,
    color
  };
};
