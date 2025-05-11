import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { sendEmailNotification, getNotificationTemplates } from "@/services/NotificationService";

export type UserRole = "farmer" | "admin" | "verifier";

export interface UserFinancialData {
  currentBalance: number;
  loanAmount: number;
  incomeSource: string;
  farmSize: string;
}

export interface LoanApplication {
  id: string;
  type: string;
  amount: number;
  purpose: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: "deposit" | "withdrawal" | "payment" | "disbursement";
  description: string;
  date: string;
}

export interface PreferredLender {
  id: string;
  name: string;
  interestRate: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "farmer" | "admin" | "verifier";
  loans?: LoanApplication[];
  transactions?: Transaction[];
  preferredLender?: {
    id: string;
    name: string;
    interestRate: number;
  };
  aadhaarVerified?: boolean;
  aadhaarNumber?: string;
  currentBalance?: number;
  creditScore?: {
    score: number;
    maxEligibleAmount: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    contributingFactors: string[];
    loanApprovalLikelihood: 'High' | 'Medium' | 'Low';
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateUserData: (data: Partial<User>) => void;
  getUserFinancialData: () => UserFinancialData | undefined;
  addLoanApplication: (loan: Omit<LoanApplication, "id" | "submittedAt" | "status">) => void;
  addTransaction: (transaction: Omit<Transaction, "id" | "date">) => void;
  sendNotification: (type: string, data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("agriloan_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      
      // Load additional user data if available
      const userDataKey = `agriloan_userdata_${parsedUser.email}`;
      const userData = localStorage.getItem(userDataKey);
      
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        setUser({
          ...parsedUser,
          financialData: {
            currentBalance: parsedUserData.currentBalance || 0,
            loanAmount: parsedUserData.loanAmount || 0,
            incomeSource: parsedUserData.incomeSource || '',
            farmSize: parsedUserData.farmSize || ''
          },
          loans: parsedUserData.loans || [],
          transactions: parsedUserData.transactions || [],
          preferredLender: parsedUserData.preferredLender || null
        });
      } else {
        setUser(parsedUser);
      }
    }
    setIsLoading(false);
  }, []);

  // Send notification based on type and data
  const sendNotification = async (type: string, data: any) => {
    if (!user?.email) return;
    
    const templates = getNotificationTemplates();
    let emailContent;
    
    switch(type) {
      case "loan_application":
        emailContent = templates.loanApplication(user.name, data.type, data.amount);
        break;
      case "loan_approved":
        emailContent = templates.loanApproved(user.name, data.type, data.amount);
        break;
      case "loan_rejected":
        emailContent = templates.loanRejected(user.name, data.type);
        break;
      case "lender_selected":
        emailContent = templates.lenderSelected(user.name, data.name);
        break;
      case "profile_updated":
        emailContent = templates.profileUpdated(user.name);
        break;
      default:
        return;
    }
    
    await sendEmailNotification({
      to: user.email,
      subject: emailContent.subject,
      body: emailContent.body
    });
  };

  const updateUserData = useCallback((data: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    
    // Update localStorage
    localStorage.setItem(`agriloan_userdata_${updatedUser.email}`, JSON.stringify(updatedUser));
    
    // Update additional data in separate storage
    if (user.email) {
      const userDataKey = `agriloan_userdata_${user.email}`;
      const existingData = localStorage.getItem(userDataKey);
      const userData = existingData ? JSON.parse(existingData) : {};
      
      const updatedUserData = {
        ...userData,
        currentBalance: updatedUser.financialData?.currentBalance || userData.currentBalance || 0,
        loanAmount: updatedUser.financialData?.loanAmount || userData.loanAmount || 0,
        incomeSource: updatedUser.financialData?.incomeSource || userData.incomeSource || '',
        farmSize: updatedUser.financialData?.farmSize || userData.farmSize || '',
        loans: updatedUser.loans || userData.loans || [],
        transactions: updatedUser.transactions || userData.transactions || [],
        preferredLender: updatedUser.preferredLender || userData.preferredLender || null
      };
      
      localStorage.setItem(userDataKey, JSON.stringify(updatedUserData));
      
      // Send profile updated notification
      sendNotification("profile_updated", {});
    }
  }, [user]);

  const getUserFinancialData = () => {
    if (!user || !user.email) return undefined;
    
    const userDataKey = `agriloan_userdata_${user.email}`;
    const userData = localStorage.getItem(userDataKey);
    
    if (userData) {
      const parsedData = JSON.parse(userData);
      return {
        currentBalance: parsedData.currentBalance || 0,
        loanAmount: parsedData.loanAmount || 0,
        incomeSource: parsedData.incomeSource || '',
        farmSize: parsedData.farmSize || ''
      };
    }
    
    return undefined;
  };

  const addLoanApplication = (loan: Omit<LoanApplication, "id" | "submittedAt" | "status">) => {
    if (!user || !user.email) return;
    
    const newLoan: LoanApplication = {
      ...loan,
      id: `loan-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: "pending"
    };
    
    const updatedLoans = [...(user.loans || []), newLoan];
    
    // Update user state
    setUser(prev => {
      if (!prev) return null;
      return { ...prev, loans: updatedLoans };
    });
    
    // Update in localStorage
    const userDataKey = `agriloan_userdata_${user.email}`;
    const userData = localStorage.getItem(userDataKey);
    
    if (userData) {
      const parsedData = JSON.parse(userData);
      parsedData.loans = updatedLoans;
      localStorage.setItem(userDataKey, JSON.stringify(parsedData));
    }
    
    // Send loan application notification
    sendNotification("loan_application", loan);
  };

  const addTransaction = (transaction: Omit<Transaction, "id" | "date">) => {
    if (!user || !user.email) return;
    
    const newTransaction: Transaction = {
      ...transaction,
      id: `txn-${Date.now()}`,
      date: new Date().toISOString()
    };
    
    const updatedTransactions = [...(user.transactions || []), newTransaction];
    
    // Update user state
    setUser(prev => {
      if (!prev) return null;
      return { ...prev, transactions: updatedTransactions };
    });
    
    // Update in localStorage
    const userDataKey = `agriloan_userdata_${user.email}`;
    const userData = localStorage.getItem(userDataKey);
    
    if (userData) {
      const parsedData = JSON.parse(userData);
      parsedData.transactions = updatedTransactions;
      localStorage.setItem(userDataKey, JSON.stringify(parsedData));
    }
  };

  // In a real app, these would connect to a backend
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, determine role based on email
      let role: UserRole = "farmer";
      if (email.includes("admin")) {
        role = "admin";
      } else if (email.includes("verifier")) {
        role = "verifier";
      }
      
      const userId = "user-" + Math.random().toString(36).substring(2, 9);
      
      // Check if user data exists
      const userDataKey = `agriloan_userdata_${email}`;
      const userData = localStorage.getItem(userDataKey);
      
      const user: User = {
        id: userId,
        name: userData ? JSON.parse(userData).name : email.split('@')[0],
        email,
        role
      };
      
      if (userData) {
        const parsedData = JSON.parse(userData);
        user.financialData = {
          currentBalance: parsedData.currentBalance || 0,
          loanAmount: parsedData.loanAmount || 0,
          incomeSource: parsedData.incomeSource || '',
          farmSize: parsedData.farmSize || ''
        };
        user.loans = parsedData.loans || [];
        user.transactions = parsedData.transactions || [];
        user.preferredLender = parsedData.preferredLender || null;
      }
      
      localStorage.setItem("agriloan_user", JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Mock register - would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userId = "user-" + Math.random().toString(36).substring(2, 9);
      
      // Get additional user data if it exists
      const userDataKey = `agriloan_userdata_${email}`;
      const userData = localStorage.getItem(userDataKey);
      
      const user: User = {
        id: userId,
        name,
        email,
        role
      };
      
      if (userData) {
        const parsedData = JSON.parse(userData);
        user.financialData = {
          currentBalance: parsedData.currentBalance || 0,
          loanAmount: parsedData.loanAmount || 0,
          incomeSource: parsedData.incomeSource || '',
          farmSize: parsedData.farmSize || ''
        };
        user.loans = parsedData.loans || [];
        user.transactions = parsedData.transactions || [];
        user.preferredLender = parsedData.preferredLender || null;
      }
      
      localStorage.setItem("agriloan_user", JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error("Registration failed:", error);
      throw new Error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("agriloan_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading,
      login,
      register,
      logout,
      updateUserData,
      getUserFinancialData,
      addLoanApplication,
      addTransaction,
      sendNotification
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
