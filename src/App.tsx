
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
import CreditCardsPage from "./pages/CreditCardsPage";
import TransactionsPage from "./pages/TransactionsPage";
import SupportChatPage from "./pages/SupportChatPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import LoanVerificationPage from "./pages/LoanVerificationPage";
import AllApplicationsPage from "./pages/AllApplicationsPage";
import UsersManagementPage from "./pages/UsersManagementPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import LendingPartnersPage from "./pages/LendingPartnersPage";
import LenderSelection from "./components/loans/LenderSelection";
import RepayLoanPage from "./pages/RepayLoanPage";

// Create a new QueryClient instance inside the component
function App() {
  const queryClient = React.useState(() => new QueryClient())[0];
  
  return (
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
              
              {/* Protected routes for all roles */}
              <Route path="/dashboard" element={<MainLayout />}>
                <Route index element={<DashboardPage />} />
              </Route>
              
              {/* Protected farmer routes */}
              <Route path="/loan-applications" element={<MainLayout requiredRole="farmer" />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="new" element={<LoanApplicationPage />} />
              </Route>
              
              <Route path="/credit-cards" element={<MainLayout requiredRole="farmer" />}>
                <Route index element={<CreditCardsPage />} />
              </Route>
              
              <Route path="/transactions" element={<MainLayout requiredRole="farmer" />}>
                <Route index element={<TransactionsPage />} />
              </Route>
              
              <Route path="/support" element={<MainLayout requiredRole="farmer" />}>
                <Route index element={<SupportChatPage />} />
              </Route>
              
              <Route path="/lenders" element={<MainLayout requiredRole="farmer" />}>
                <Route index element={<LenderSelection />} />
              </Route>
              
              <Route path="/repay-loan" element={<MainLayout requiredRole="farmer" />}>
                <Route index element={<RepayLoanPage />} />
              </Route>
              
              {/* Settings and Profile routes available for all roles */}
              <Route path="/settings" element={<MainLayout />}>
                <Route index element={<SettingsPage />} />
              </Route>
              
              <Route path="/profile" element={<MainLayout />}>
                <Route index element={<ProfilePage />} />
              </Route>
              
              {/* Protected admin routes */}
              <Route path="/all-applications" element={<MainLayout requiredRole="admin" />}>
                <Route index element={<AllApplicationsPage />} />
              </Route>
              
              <Route path="/users" element={<MainLayout requiredRole="admin" />}>
                <Route index element={<UsersManagementPage />} />
              </Route>
              
              <Route path="/analytics" element={<MainLayout requiredRole="admin" />}>
                <Route index element={<AnalyticsPage />} />
              </Route>
              
              {/* Protected verifier routes */}
              <Route path="/verify-applications" element={<MainLayout requiredRole="verifier" />}>
                <Route index element={<LoanVerificationPage />} />
              </Route>
              
              <Route path="/partners" element={<MainLayout requiredRole="verifier" />}>
                <Route index element={<LendingPartnersPage />} />
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
