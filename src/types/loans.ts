
// Define the basic loan status types
export type LoanStatus = "pending" | "approved" | "rejected" | "repaid";

// Define the basic LoanApplication interface
export interface LoanApplication {
  id: string;
  type: string;
  amount: number;
  purpose: string;
  submittedAt: string;
  status: LoanStatus;
  lender?: string;
  // Add optional fields that might be used in repayment functionality
  paymentsMade?: number;
  amountRepaid?: number;
}

// Extended LoanApplication type that includes the additional fields needed for repayment
export interface LoanWithBalance extends LoanApplication {
  remainingBalance: number;
  repaidAmount: number;
}
