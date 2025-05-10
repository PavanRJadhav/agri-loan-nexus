
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import UserActivityItem from "@/components/dashboard/UserActivityItem";

const UsersManagementPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">
          Manage and monitor all registered users.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            List of all registered users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <UserActivityItem
              initials="JD"
              name="John Doe"
              role="Farmer"
              activity="Account created on May 8, 2025"
              bgColor="bg-agriloan-primary"
            />
            
            <UserActivityItem
              initials="MS"
              name="Maria Singh"
              role="Verifier" 
              activity="Last active 30 minutes ago"
              bgColor="bg-agriloan-secondary"
            />
            
            <UserActivityItem
              initials="RK"
              name="Raj Kumar"
              role="Farmer"
              activity="3 loan applications"
              bgColor="bg-agriloan-accent"
            />
            
            <UserActivityItem
              initials="AP"
              name="Anika Patel"
              role="Farmer"
              activity="1 approved loan"
              bgColor="bg-agriloan-primary" 
            />

            <UserActivityItem
              initials="VG"
              name="Vikram Gupta"
              role="Farmer"
              activity="New registration today"
              bgColor="bg-agriloan-secondary" 
            />

            <UserActivityItem
              initials="SK"
              name="Sarah Khan"
              role="Verifier"
              activity="Verified 12 applications"
              bgColor="bg-agriloan-accent" 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManagementPage;
