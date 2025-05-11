
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        
        <p className="text-gray-600 mb-6">
          You don't have permission to access the requested page. Please contact your administrator if you believe this is an error.
        </p>
        
        <div className="flex flex-col space-y-2">
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
          
          <Button onClick={() => navigate("/dashboard")}>
            Return to Dashboard
          </Button>
          
          <Button onClick={() => navigate("/login")} variant="ghost">
            Login as Different User
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
