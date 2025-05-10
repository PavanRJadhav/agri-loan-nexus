
import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface MainLayoutProps {
  requiredRole?: "farmer" | "admin" | "verifier";
}

const MainLayout: React.FC<MainLayoutProps> = ({ requiredRole }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-agriloan-light">
        <div className="w-16 h-16 border-4 border-agriloan-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if user has required role - only restrict if requiredRole is specified
  if (requiredRole && user?.role !== requiredRole) {
    // For admin and verifier, they can access their own specific pages
    // But farmers can only access farmer pages
    if (user?.role === "farmer" || 
        !["admin", "verifier"].includes(user?.role)) {
      return <Navigate to="/unauthorized" state={{ from: location.pathname }} replace />;
    }
    
    // If here, user is either admin or verifier, allow cross-access to their pages
    if ((user?.role === "admin" || user?.role === "verifier") && 
        (requiredRole === "admin" || requiredRole === "verifier")) {
      return (
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              <Outlet />
            </main>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
