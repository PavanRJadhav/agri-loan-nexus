
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import FarmerDashboard from "@/components/dashboard/FarmerDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import VerifierDashboard from "@/components/dashboard/VerifierDashboard";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div>
      {user?.role === "farmer" && <FarmerDashboard userName={user.name || "Farmer"} />}
      {user?.role === "admin" && <AdminDashboard />}
      {user?.role === "verifier" && <VerifierDashboard />}
    </div>
  );
};

export default DashboardPage;
