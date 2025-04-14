
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Users, ArrowUp, CalendarDays } from "lucide-react";
import StatCard from "./StatCard";
import ApplicationItem from "./ApplicationItem";
import UserActivityItem from "./UserActivityItem";

const AdminDashboard: React.FC = () => {
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
          value="256"
          description="+12% from last month"
          icon={CreditCard}
        />
        
        <StatCard
          title="Total Users"
          value="138"
          description="+5 new today"
          icon={Users}
        />
        
        <StatCard
          title="Approval Rate"
          value="72%"
          description="+4% from last month"
          icon={ArrowUp}
          descriptionColor="text-green-600"
        />
        
        <StatCard
          title="Average Processing"
          value="3.2 days"
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
              {[
                { status: "New", color: "bg-yellow-100 text-yellow-800" },
                { status: "In Review", color: "bg-green-100 text-green-800" },
                { status: "Verified", color: "bg-blue-100 text-blue-800" },
                { status: "Approved", color: "bg-purple-100 text-purple-800" }
              ].map((item, i) => (
                <ApplicationItem
                  key={i}
                  id={10240 + i + 1}
                  title={`Application #${10240 + i + 1}`}
                  date={`Submitted ${i + 1} day${i > 0 ? 's' : ''} ago`}
                  status={item.status}
                  statusColor={item.color}
                />
              ))}
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
              <UserActivityItem
                initials="JD"
                name="John Doe"
                role="Farmer"
                activity="Registered 2h ago"
                bgColor="bg-agriloan-primary"
              />
              
              <UserActivityItem
                initials="MS"
                name="Maria Singh"
                role="Verifier" 
                activity="Logged in 30m ago"
                bgColor="bg-agriloan-secondary"
              />
              
              <UserActivityItem
                initials="RK"
                name="Raj Kumar"
                role="Farmer"
                activity="Applied 1h ago" 
                bgColor="bg-agriloan-accent"
              />
              
              <UserActivityItem
                initials="AP"
                name="Anika Patel"
                role="Farmer"
                activity="Updated profile 4h ago"
                bgColor="bg-agriloan-primary" 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
