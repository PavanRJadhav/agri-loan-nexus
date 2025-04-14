
import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "farmer" | "admin" | "verifier";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("agriloan_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

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
      
      const user = {
        id: "user-" + Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0],
        email,
        role
      };
      
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
      
      const user = {
        id: "user-" + Math.random().toString(36).substring(2, 9),
        name,
        email,
        role
      };
      
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
      logout
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
