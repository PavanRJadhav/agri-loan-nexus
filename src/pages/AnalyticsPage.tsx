
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { useAuth, User, LoanApplication } from "@/contexts/AuthContext";

const AnalyticsPage: React.FC = () => {
  const [loanTypeData, setLoanTypeData] = useState<{ name: string; value: number }[]>([]);
  const [monthlyApplicationsData, setMonthlyApplicationsData] = useState<{ name: string; applications: number }[]>([]);
  const [approvalRateData, setApprovalRateData] = useState<{ name: string; rate: number }[]>([]);
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  useEffect(() => {
    const collectAnalyticsData = () => {
      // Get all users and their loans from localStorage
      const users: User[] = [];
      const allLoans: LoanApplication[] = [];
      
      // Loop through localStorage to find all users
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("agriloan_userdata_")) {
          try {
            const userData = JSON.parse(localStorage.getItem(key) || "{}");
            
            if (userData.name && userData.loans && Array.isArray(userData.loans)) {
              allLoans.push(...userData.loans);
            }
          } catch (error) {
            console.error("Error parsing user data:", error);
          }
        }
      }
      
      // Process loan types data
      const loanTypeCounts: Record<string, number> = {};
      allLoans.forEach(loan => {
        const type = loan.type;
        loanTypeCounts[type] = (loanTypeCounts[type] || 0) + 1;
      });
      
      const loanTypeDataTemp = Object.entries(loanTypeCounts).map(([name, value]) => ({
        name,
        value
      }));
      setLoanTypeData(loanTypeDataTemp);
      
      // Process monthly applications data
      const monthlyData: Record<string, number> = {};
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      allLoans.forEach(loan => {
        const date = new Date(loan.submittedAt);
        const monthName = monthNames[date.getMonth()];
        monthlyData[monthName] = (monthlyData[monthName] || 0) + 1;
      });
      
      const monthlyApplicationsDataTemp = Object.entries(monthlyData).map(([name, applications]) => ({
        name,
        applications
      }));
      setMonthlyApplicationsData(monthlyApplicationsDataTemp.length > 0 ? monthlyApplicationsDataTemp : [
        { name: monthNames[new Date().getMonth()], applications: 0 }
      ]);
      
      // Process approval rate data
      const monthlyApprovalData: Record<string, { total: number; approved: number }> = {};
      
      allLoans.forEach(loan => {
        const date = new Date(loan.submittedAt);
        const monthName = monthNames[date.getMonth()];
        
        if (!monthlyApprovalData[monthName]) {
          monthlyApprovalData[monthName] = { total: 0, approved: 0 };
        }
        
        monthlyApprovalData[monthName].total += 1;
        if (loan.status === "approved") {
          monthlyApprovalData[monthName].approved += 1;
        }
      });
      
      const approvalRateDataTemp = Object.entries(monthlyApprovalData).map(([name, data]) => ({
        name,
        rate: data.total > 0 ? Math.round((data.approved / data.total) * 100) : 0
      }));
      
      setApprovalRateData(approvalRateDataTemp.length > 0 ? approvalRateDataTemp : [
        { name: monthNames[new Date().getMonth()], rate: 0 }
      ]);
    };
    
    collectAnalyticsData();
  }, []);

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
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={loanTypeData.length > 0 ? loanTypeData : [{ name: "No Data", value: 1 }]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {loanTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Applications</CardTitle>
            <CardDescription>Number of applications per month</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={monthlyApplicationsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Approval Rate Trend</CardTitle>
            <CardDescription>Monthly loan approval rate percentage</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={approvalRateData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rate" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
