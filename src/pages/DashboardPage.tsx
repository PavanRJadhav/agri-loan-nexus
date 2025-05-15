
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import FarmerDashboard from "@/components/dashboard/FarmerDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import VerifierDashboard from "@/components/dashboard/VerifierDashboard";
import { useToast } from "@/components/ui/use-toast";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Force refresh when the component mounts to ensure latest data
  useEffect(() => {
    // Add console logs to debug dashboard rendering
    console.log("Dashboard refreshed, current user role:", user?.role);
    
    // Retrieve fresh data from localStorage for the current user
    const refreshUserData = () => {
      if (user?.email) {
        try {
          const userDataKey = `agriloan_userdata_${user.email}`;
          localStorage.getItem(userDataKey);
          console.log("User data refreshed for dashboard");
        } catch (error) {
          console.error("Error refreshing user data:", error);
        }
      }
    };
    
    refreshUserData();
    
    // Set a refresh interval to check for updates every 30 seconds
    const intervalId = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 30000);
    
    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [user]);

  return (
    <div key={`dashboard-${user?.id}-${refreshTrigger}`}>
      {user?.role === "farmer" && <FarmerDashboard userName={user.name || "Farmer"} />}
      {user?.role === "admin" && <AdminDashboard key={`admin-${refreshTrigger}`} />}
      {user?.role === "verifier" && <VerifierDashboard key={`verifier-${refreshTrigger}`} />}
    </div>
  );
};

export default DashboardPage;
