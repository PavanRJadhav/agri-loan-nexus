
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, PieChartData } from "recharts";
import { useAuth } from "@/contexts/AuthContext";

const AnalyticsPage: React.FC = () => {
  // Sample data for charts
  const loanTypeData = [
    { name: "Crop Loans", value: 45 },
    { name: "Equipment", value: 30 },
    { name: "Irrigation", value: 15 },
    { name: "Seeds", value: 10 }
  ];

  const monthlyApplicationsData = [
    { name: "Jan", applications: 12 },
    { name: "Feb", applications: 19 },
    { name: "Mar", applications: 15 },
    { name: "Apr", applications: 25 },
    { name: "May", applications: 30 }
  ];

  const approvalRateData = [
    { name: "Jan", rate: 65 },
    { name: "Feb", rate: 68 },
    { name: "Mar", rate: 72 },
    { name: "Apr", rate: 75 },
    { name: "May", rate: 72 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <p className="text-muted-foreground">
          Detailed analytics and statistics for the AgriLoan platform.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Loan Applications by Type</CardTitle>
            <CardDescription>Distribution of loan applications by category</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <PieChart width={400} height={300} data={loanTypeData}>
              <PieChartData dataKey="value" nameKey="name" />
            </PieChart>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Applications</CardTitle>
            <CardDescription>Number of applications per month</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <BarChart 
              width={400} 
              height={300} 
              data={monthlyApplicationsData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="applications" fill="#22c55e" />
            </BarChart>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Approval Rate Trend</CardTitle>
            <CardDescription>Monthly loan approval rate percentage</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <LineChart
              width={850}
              height={300}
              data={approvalRateData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rate" stroke="#8884d8" />
            </LineChart>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
