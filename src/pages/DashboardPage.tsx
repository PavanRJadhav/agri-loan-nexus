
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import FarmerDashboard from "@/components/dashboard/FarmerDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import VerifierDashboard from "@/components/dashboard/VerifierDashboard";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    // Add console logs to debug dashboard rendering
    console.log("Current user role:", user?.role);
  }, [user]);

  return (
    <div>
      {user?.role === "farmer" && <FarmerDashboard userName={user.name || "Farmer"} />}
      {user?.role === "admin" && <AdminDashboard />}
      {user?.role === "verifier" && <VerifierDashboard />}
    </div>
  );
};

export default DashboardPage;
