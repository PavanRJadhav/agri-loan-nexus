
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const LoanApplicationsPage: React.FC = () => {
  const { user } = useAuth();
  const [applications] = useState(user?.loans || []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Loan Applications</h1>
          <p className="text-muted-foreground">
            Manage and track your loan applications
          </p>
        </div>
        <Button asChild>
          <Link to="/loan-applications/new">New Application</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-lg text-muted-foreground">
                You don't have any loan applications yet.
              </p>
              <Button asChild className="mt-4">
                <Link to="/loan-applications/new">Create Your First Application</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div 
                  key={app.id} 
                  className="flex items-center justify-between border rounded-md p-4"
                >
                  <div>
                    <p className="font-medium">{app.type} Loan</p>
                    <p className="text-sm text-muted-foreground">
                      ₹{app.amount.toLocaleString()} - {new Date(app.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanApplicationsPage;
