
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import React from "react"; // Make sure React is imported

import MainLayout from "./components/layout/MainLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFound from "./pages/NotFound";
import LoanApplicationPage from "./components/loans/LoanApplicationPage";

// Create a new QueryClient instance outside of the component
const queryClient = new QueryClient();

// Update the App component to be a function declaration with explicit React.FC type
const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                
                {/* Protected farmer routes */}
                <Route path="/dashboard" element={<MainLayout requiredRole="farmer" />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="/dashboard/loan-applications/new" element={<LoanApplicationPage />} />
                </Route>
                
                <Route path="/loan-applications/new" element={<MainLayout requiredRole="farmer" />}>
                  <Route index element={<LoanApplicationPage />} />
                </Route>
                
                {/* Protected admin routes */}
                <Route path="/admin" element={<MainLayout requiredRole="admin" />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  {/* Add more admin-specific routes here */}
                </Route>
                
                {/* Protected verifier routes */}
                <Route path="/verifier" element={<MainLayout requiredRole="verifier" />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  {/* Add more verifier-specific routes here */}
                </Route>
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
