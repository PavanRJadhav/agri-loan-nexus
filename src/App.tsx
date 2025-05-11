
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import { Toaster as SonnerToaster } from "sonner";

// Layouts
import MainLayout from "@/components/layout/MainLayout";
import AuthLayout from "@/components/layout/AuthLayout";

// Pages
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import ProfilePage from "@/pages/ProfilePage";
import LoanApplicationsPage from "@/pages/LoanApplicationsPage";
import NewLoanApplicationPage from "@/pages/NewLoanApplicationPage";
import LendingPartnersPage from "@/pages/LendingPartnersPage";
import TransactionsPage from "@/pages/TransactionsPage";
import LoanVerificationPage from "@/pages/LoanVerificationPage";
import UsersPage from "@/pages/UsersPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import CreditScorePage from "./pages/CreditScorePage";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />

        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/loan-applications" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <LoanApplicationsPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/loan-applications/new" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <NewLoanApplicationPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/lenders" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <LendingPartnersPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/transactions" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <TransactionsPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/verify-loans" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <LoanVerificationPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <UsersPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <SettingsPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/credit-score" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <CreditScorePage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      
      <Toaster />
      <SonnerToaster position="top-right" />
    </Router>
  );
};

export default App;
