
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Users, ArrowUp, CalendarDays } from "lucide-react";
import StatCard from "./StatCard";
import ApplicationItem from "./ApplicationItem";
import UserActivityItem from "./UserActivityItem";
import { useAuth, User, LoanApplication } from "@/contexts/AuthContext";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // This would be replaced with actual data in a real application
  const mockUsers: User[] = [
    {
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
      role: "farmer",
    },
    {
      id: "user-2",
      name: "Maria Singh",
      email: "maria@example.com",
      role: "verifier",
    },
    {
      id: "user-3",
      name: "Raj Kumar",
      email: "raj@example.com",
      role: "farmer",
    },
    {
      id: "user-4",
      name: "Anika Patel",
      email: "anika@example.com",
      role: "farmer",
    }
  ];
  
  const mockApplications: LoanApplication[] = [
    {
      id: "app-1",
      type: "Crop Loan",
      amount: 15000,
      purpose: "Seasonal crop financing",
      status: "pending",
      submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    },
    {
      id: "app-2",
      type: "Equipment Purchase",
      amount: 25000,
      purpose: "Tractor purchase",
      status: "approved",
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    },
    {
      id: "app-3",
      type: "Irrigation System",
      amount: 50000,
      purpose: "Modern irrigation installation",
      status: "pending",
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
    },
    {
      id: "app-4",
      type: "Seed Purchase",
      amount: 8000,
      purpose: "High-yield seed variety",
      status: "rejected",
      submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() // 4 days ago
    }
  ];

  // Calculate approval rate
  const approvedApplications = mockApplications.filter(app => app.status === "approved").length;
  const approvalRate = Math.round((approvedApplications / mockApplications.length) * 100);

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
          value={mockApplications.length.toString()}
          description="+12% from last month"
          icon={CreditCard}
        />
        
        <StatCard
          title="Total Users"
          value={mockUsers.length.toString()}
          description="+5 new today"
          icon={Users}
        />
        
        <StatCard
          title="Approval Rate"
          value={`${approvalRate}%`}
          description="+4% from last month"
          icon={ArrowUp}
          descriptionColor="text-green-600"
        />
        
        <StatCard
          title="Average Processing"
          value={`${avgProcessingDays} days`}
          description="-0.5 days from last month"
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
              {mockApplications.map((app, i) => {
                let statusColor = "";
                if (app.status === "pending") statusColor = "bg-yellow-100 text-yellow-800";
                else if (app.status === "approved") statusColor = "bg-green-100 text-green-800";
                else if (app.status === "rejected") statusColor = "bg-red-100 text-red-800";
                
                const daysAgo = Math.floor((Date.now() - new Date(app.submittedAt).getTime()) / (24 * 60 * 60 * 1000));
                
                return (
                  <ApplicationItem
                    key={app.id}
                    id={parseInt(app.id.replace("app-", ""))}
                    title={`Application #${app.id.replace("app-", "")}`}
                    date={`Submitted ${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`}
                    status={app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    statusColor={statusColor}
                    amount={`₹${app.amount.toLocaleString()}`}
                    type={app.type}
                  />
                );
              })}
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
              {mockUsers.map((user, i) => (
                <UserActivityItem
                  key={user.id}
                  initials={user.name.split(" ").map(n => n[0]).join("")}
                  name={user.name}
                  role={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  activity={i === 0 ? "Registered 2h ago" : 
                           i === 1 ? "Logged in 30m ago" : 
                           i === 2 ? "Applied for loan 1h ago" : 
                           "Updated profile 4h ago"}
                  bgColor={`bg-agriloan-${i % 2 === 0 ? "primary" : "secondary"}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
