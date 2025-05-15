
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import FarmerDashboard from "@/components/dashboard/FarmerDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import VerifierDashboard from "@/components/dashboard/VerifierDashboard";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { toast: hookToast } = useToast();
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
          const userData = localStorage.getItem(userDataKey);
          console.log("User data refreshed for dashboard");
          
          // Show toast notification for new loan applications
          if (userData) {
            const parsedData = JSON.parse(userData);
            const pendingLoans = parsedData.loans?.filter((loan: any) => loan.status === "pending") || [];
            
            if (pendingLoans.length > 0 && user.role === "farmer") {
              toast.info(`You have ${pendingLoans.length} pending loan application(s)`);
            }
          }
        } catch (error) {
          console.error("Error refreshing user data:", error);
        }
      }
    };
    
    refreshUserData();
    
    // Set a refresh interval to check for updates every 15 seconds
    const intervalId = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
      refreshUserData();
    }, 15000);
    
    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [user]);

  // Immediate refresh effect for role-specific actions
  useEffect(() => {
    if (user?.role === "admin" || user?.role === "verifier") {
      // Refresh all users data from localStorage for admin/verifier
      const getAllUsersData = () => {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('agriloan_userdata_')) {
            try {
              localStorage.getItem(key);
            } catch (error) {
              console.error("Error refreshing all users data:", error);
            }
          }
        }
      };
      
      getAllUsersData();
    }
  }, [refreshTrigger, user?.role]);

  return (
    <div key={`dashboard-${user?.id}-${refreshTrigger}`}>
      {user?.role === "farmer" && <FarmerDashboard userName={user.name || "Farmer"} />}
      {user?.role === "admin" && <AdminDashboard key={`admin-${refreshTrigger}`} />}
      {user?.role === "verifier" && <VerifierDashboard key={`verifier-${refreshTrigger}`} />}
    </div>
  );
};

export default DashboardPage;
