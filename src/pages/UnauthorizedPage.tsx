
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldAlert } from "lucide-react";

const UnauthorizedPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine where to redirect the user based on their role
  const handleReturnToDashboard = () => {
    if (user) {
      // Redirect to the appropriate dashboard based on user role
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-6 max-w-md">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="h-8 w-8 text-yellow-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-lg text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>
        <div className="space-y-2">
          <Button 
            onClick={handleReturnToDashboard} 
            className="bg-agriloan-primary hover:bg-agriloan-secondary w-full"
          >
            Return to Dashboard
          </Button>
          {user && (
            <p className="text-sm text-gray-500 mt-4">
              Logged in as {user.name} ({user.role}).
              <br />
              If you believe this is a mistake, please contact support.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
