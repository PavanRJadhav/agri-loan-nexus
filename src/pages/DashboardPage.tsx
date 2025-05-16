
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
    console.log("Dashboard refreshed, current user role:", user?.role);
    
    // Retrieve fresh data from localStorage for the current user
    const refreshUserData = () => {
      if (user?.email) {
        try {
          const userDataKey = `agriloan_userdata_${user.email}`;
          const storedData = localStorage.getItem(userDataKey);
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            console.log("User data refreshed for dashboard:", parsedData);
            
            // Show toast notification for new loan applications
            if (parsedData.loans) {
              const pendingLoans = parsedData.loans.filter((loan: any) => loan.status === "pending") || [];
              
              if (pendingLoans.length > 0 && user.role === "farmer") {
                toast.info(`You have ${pendingLoans.length} pending loan application(s)`);
              }
            }
          }
        } catch (error) {
          console.error("Error refreshing user data:", error);
        }
      }
    };
    
    refreshUserData();
    
    // Set a refresh interval to check for updates every 3 seconds (more frequent than before)
    const intervalId = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
      refreshUserData();
    }, 3000);
    
    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [user]);

  // Enhanced refresh mechanism - fixed to ensure ALL users' data is fresh across dashboards
  useEffect(() => {
    const refreshAllDataInLocalStorage = () => {
      console.log(`Refreshing all data for ${user?.role} dashboard...`);
      
      // For all users, ensure localStorage data is fresh
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('agriloan_userdata_')) {
          try {
            // Force a completely fresh read of the data
            const rawData = localStorage.getItem(key) || "{}";
            const userData = JSON.parse(rawData);
            
            if (userData) {
              // Write it back to ensure it's fresh - THIS IS CRUCIAL FOR DATA SYNC
              localStorage.setItem(key, JSON.stringify(userData));
              
              // Log data details for verification
              if (userData.loans && userData.loans.length > 0) {
                console.log(`Refreshed ${userData.loans.length} loans for ${key.replace('agriloan_userdata_', '')}`);
                console.log(`Loan statuses: ${userData.loans.map((l: any) => l.status).join(', ')}`);
              }
            }
          } catch (error) {
            console.error("Error refreshing user data:", error);
          }
        }
      }
    };
    
    // Execute refresh immediately
    refreshAllDataInLocalStorage();
    
    // Add a specific refresh interval just for admin and verifier dashboards
    let intervalId: number | undefined;
    if (user?.role === "admin" || user?.role === "verifier") {
      intervalId = window.setInterval(() => {
        refreshAllDataInLocalStorage();
      }, 2000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [refreshTrigger, user?.role]);

  return (
    // Add key with refresh trigger to force component re-rendering when data changes
    <div key={`dashboard-${user?.id}-${refreshTrigger}-${Date.now()}`} className="dashboard-container">
      {user?.role === "farmer" && <FarmerDashboard userName={user.name || "Farmer"} refreshKey={refreshTrigger} />}
      {user?.role === "admin" && <AdminDashboard key={`admin-${refreshTrigger}-${Date.now()}`} />}
      {user?.role === "verifier" && <VerifierDashboard key={`verifier-${refreshTrigger}-${Date.now()}`} />}
    </div>
  );
};

export default DashboardPage;
