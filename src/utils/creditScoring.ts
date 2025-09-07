/**
 * Credit Scoring Algorithm implementation based on AgriCred methodology
 */

// Parameters and their weights
const DEFAULT_WEIGHTS = {
  landholding: 0.25,   // w1 - Landholding size
  cropYield: 0.25,     // w2 - Historical crop yield
  repaymentRecord: 0.3, // w3 - Repayment history
  inputDemand: 0.2,    // w4 - Input demand index
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

// Calculate Credit Limit based on credit score
export const calculateCreditLimit = (creditScore: number): number => {
  const baseLimit = 50000; // Base credit limit of ₹50,000
  const multiplier = creditScore * 10; // Scale up to 10x for perfect scores
  return Math.round(baseLimit * multiplier);
};

// Get credit score category
export const getCreditScoreCategory = (score: number): string => {
  if (score >= 0.8) return "Excellent";
  if (score >= 0.6) return "Good";
  if (score >= 0.4) return "Fair";
  return "Poor";
};

// Get color for credit score display
export const getCreditScoreColor = (score: number): string => {
  if (score >= 0.8) return "bg-green-500";
  if (score >= 0.6) return "bg-blue-500";
  if (score >= 0.4) return "bg-yellow-500";
  return "bg-red-500";
};

// Generate mock credit data for a user based on their existing data
export const generateMockCreditData = (userData: any): FarmerCreditData => {
  // Get the number of loans
  const loanCount = userData?.loans?.length || 0;
  const approvedLoanCount = userData?.loans?.filter((loan: any) => loan.status === 'approved').length || 0;
  const rejectedLoanCount = userData?.loans?.filter((loan: any) => loan.status === 'rejected').length || 0;
  
  // Calculate repayment record based on payment history
  const totalPayments = userData?.transactions?.filter((t: any) => t.type === 'payment').length || 0;
  const latePayments = Math.floor(totalPayments * (rejectedLoanCount > 0 ? 0.3 : 0.1));
  const repaymentRecord = totalPayments > 0 
    ? 5 + (5 * (1 - (latePayments / totalPayments)))
    : 5; // Default to middle value if no payments
  
  // Calculate landholding based on farm size
  const landholding = userData?.financialData?.farmSize || 2;
  
  // Calculate crop yield based on transaction history and loan success
  const cropYield = 5 + (approvedLoanCount * 0.5) + (Math.random() * 2);
  
  // Calculate input demand based on loan frequency and amounts
  const totalLoanAmount = userData?.loans?.reduce((sum: number, loan: any) => sum + loan.amount, 0) || 0;
  const inputDemand = 4 + (Math.min(totalLoanAmount / 100000, 6)); // Scale up to 10 based on total loan amount
  
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

export interface CreditAssessment {
  creditScore: number;
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
