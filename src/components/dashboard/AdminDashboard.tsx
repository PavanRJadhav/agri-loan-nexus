
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Users, ArrowUp, CalendarDays } from "lucide-react";
import StatCard from "./StatCard";
import ApplicationItem from "./ApplicationItem";
import UserActivityItem from "./UserActivityItem";
import { useAuth, User, LoanApplication } from "@/contexts/AuthContext";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allLoans, setAllLoans] = useState<{id: string, loan: LoanApplication, userName: string}[]>([]);
  
  useEffect(() => {
    // Get all users and their loans from localStorage
    const users: User[] = [];
    const loans: {id: string, loan: LoanApplication, userName: string}[] = [];
    
    // Loop through localStorage to find all users
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("agriloan_userdata_")) {
        try {
          const email = key.replace("agriloan_userdata_", "");
          const userData = JSON.parse(localStorage.getItem(key) || "{}");
          
          if (userData.name && email) {
            const userObj: User = {
              id: userData.id || `user-${Math.random().toString(36).substring(2, 9)}`,
              name: userData.name,
              email: email,
              role: userData.role || "farmer",
              financialData: userData.financialData,
              loans: userData.loans || [],
              transactions: userData.transactions || [],
              preferredLender: userData.preferredLender
            };
            
            users.push(userObj);
            
            // Add all loans from this user
            if (userData.loans && userData.loans.length > 0) {
              userData.loans.forEach((loan: LoanApplication) => {
                loans.push({
                  id: `${userObj.id}-${loan.id}`,
                  loan,
                  userName: userData.name
                });
              });
            }
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
    
    setAllUsers(users);
    setAllLoans(loans);
  }, []);

  // Calculate approval rate
  const approvedApplications = allLoans.filter(item => item.loan.status === "approved").length;
  const approvalRate = allLoans.length > 0 ? Math.round((approvedApplications / allLoans.length) * 100) : 0;

  // Calculate average processing time (dummy value for demo)
  const avgProcessingDays = 3.2;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Monitor and manage all loan applications and users.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Applications"
          value={allLoans.length.toString()}
          description={`${allLoans.length > 0 ? '+' : ''}${allLoans.length} applications`}
          icon={CreditCard}
        />
        
        <StatCard
          title="Total Users"
          value={allUsers.length.toString()}
          description={`${allUsers.filter(u => u.role === "farmer").length} farmers`}
          icon={Users}
        />
        
        <StatCard
          title="Approval Rate"
          value={`${approvalRate}%`}
          description={`${approvedApplications} approved`}
          icon={ArrowUp}
          descriptionColor="text-green-600"
        />
        
        <StatCard
          title="Average Processing"
          value={`${avgProcessingDays} days`}
          description="Target: 2 days"
          icon={CalendarDays}
          descriptionColor="text-green-600"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Loan Applications</CardTitle>
            <CardDescription>
              Latest loan applications requiring review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allLoans.length > 0 ? (
                allLoans.slice(0, 5).map((item) => {
                  let statusColor = "";
                  if (item.loan.status === "pending") statusColor = "bg-yellow-100 text-yellow-800";
                  else if (item.loan.status === "approved") statusColor = "bg-green-100 text-green-800";
                  else if (item.loan.status === "rejected") statusColor = "bg-red-100 text-red-800";
                  
                  const daysAgo = Math.floor((Date.now() - new Date(item.loan.submittedAt).getTime()) / (24 * 60 * 60 * 1000));
                  
                  return (
                    <ApplicationItem
                      key={item.id}
                      id={parseInt(item.loan.id.replace("loan-", ""))}
                      title={`${item.userName}'s ${item.loan.type}`}
                      date={`Submitted ${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`}
                      status={item.loan.status.charAt(0).toUpperCase() + item.loan.status.slice(1)}
                      statusColor={statusColor}
                      amount={`₹${item.loan.amount.toLocaleString()}`}
                      type={item.loan.type}
                    />
                  );
                })
              ) : (
                <p className="text-center py-6 text-muted-foreground">No loan applications yet</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>
              Recent user registrations and activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allUsers.length > 0 ? (
                allUsers.slice(0, 5).map((user, i) => (
                  <UserActivityItem
                    key={user.id}
                    initials={user.name.split(" ").map(n => n[0]).join("")}
                    name={user.name}
                    role={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    activity={user.loans && user.loans.length > 0 
                      ? `${user.loans.length} loan application(s)` 
                      : "No loan applications yet"}
                    bgColor={`bg-agriloan-${i % 3 === 0 ? "primary" : i % 3 === 1 ? "secondary" : "accent"}`}
                  />
                ))
              ) : (
                <p className="text-center py-6 text-muted-foreground">No users registered yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
