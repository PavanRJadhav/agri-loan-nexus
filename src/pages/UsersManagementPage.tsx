
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import UserActivityItem from "@/components/dashboard/UserActivityItem";
import { User } from "@/contexts/AuthContext";

const UsersManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [loggedInUsers, setLoggedInUsers] = useState<User[]>([]);
  
  useEffect(() => {
    // Get all users from local storage
    const getAllUsers = () => {
      const users: User[] = [];
      // Loop through localStorage to find all users
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("agriloan_userdata_")) {
          try {
            const email = key.replace("agriloan_userdata_", "");
            const userData = JSON.parse(localStorage.getItem(key) || "{}");
            
            if (userData.name && email) {
              users.push({
                id: userData.id || `user-${Math.random().toString(36).substring(2, 9)}`,
                name: userData.name,
                email: email,
                role: userData.role || "farmer",
                financialData: userData.financialData,
                loans: userData.loans || [],
                transactions: userData.transactions || [],
                preferredLender: userData.preferredLender
              });
            }
          } catch (error) {
            console.error("Error parsing user data:", error);
          }
        }
      }
      return users;
    };
    
    setLoggedInUsers(getAllUsers());
  }, []);
  
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
            {loggedInUsers.length > 0 ? (
              loggedInUsers.map((user, index) => (
                <UserActivityItem
                  key={user.id}
                  initials={user.name.split(" ").map(n => n[0]).join("")}
                  name={user.name}
                  role={user.role}
                  activity={user.loans && user.loans.length > 0 
                    ? `${user.loans.length} loan application(s)` 
                    : "No loan applications yet"}
                  bgColor={`bg-agriloan-${index % 3 === 0 ? "primary" : index % 3 === 1 ? "secondary" : "accent"}`}
                />
              ))
            ) : (
              <p className="text-center py-6 text-muted-foreground">No users registered yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManagementPage;
