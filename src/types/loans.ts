// Define the basic loan status types
export type LoanStatus = "pending" | "approved" | "rejected" | "repaid";

export type TransactionType = "payment" | "disbursement" | "expense";
export type TransactionStatus = "pending" | "on_time" | "late" | "completed";

// Define the basic LoanApplication interface
export interface LoanApplication {
  id: string;
  type: string;
  amount: number;
  purpose: string;
  status: LoanStatus;
  submittedAt: string;
  documents?: string[];
  amountRepaid: number;
  paymentsMade: number;
  lastPaymentDate?: string;
}

// Extended LoanApplication type that includes the additional fields needed for repayment
export interface LoanWithBalance extends LoanApplication {
  remainingBalance: number;
  totalPaid: number;
  paymentProgress: number;
  payments: Transaction[];
  nextPaymentDue: Date;
  minimumPayment: number;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string;
  status: TransactionStatus;
  date: string;
  loanId?: string;
  loanType?: string;
  paymentMethod?: "bank_transfer" | "upi" | "card";
}
