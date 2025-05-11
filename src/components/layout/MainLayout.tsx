
import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "./Sidebar";
import Header from "./Header";

interface MainLayoutProps {
  children?: React.ReactNode;
  requiredRole?: "farmer" | "admin" | "verifier";
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if user has required role - only restrict if requiredRole is specified
  if (requiredRole && user?.role !== requiredRole) {
    // For admin and verifier, they can access each other's specific pages
    if ((requiredRole === "admin" || requiredRole === "verifier") && 
        (user?.role === "admin" || user?.role === "verifier")) {
      // Allow cross-access between admin and verifier roles
      return (
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      );
    }
    
    // If user is farmer or doesn't have the required role
    if (user?.role === "farmer" || 
        !["admin", "verifier"].includes(user?.role)) {
      return <Navigate to="/unauthorized" state={{ from: location.pathname }} replace />;
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
