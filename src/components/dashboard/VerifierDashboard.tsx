
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, BarChart, ArrowDown, Users } from "lucide-react";
import StatCard from "./StatCard";
import ApplicationItem from "./ApplicationItem";
import { useAuth } from "@/contexts/AuthContext";

const VerifierDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Sample applications awaiting verification
  const pendingApplications = [
    { id: 10241, type: "Crop Loan", amount: "₹15,000", applicantInitial: "AD", date: "2 days ago" },
    { id: 10242, type: "Equipment Purchase", amount: "₹25,000", applicantInitial: "BD", date: "1 day ago" },
    { id: 10243, type: "Irrigation System", amount: "₹50,000", applicantInitial: "CD", date: "12 hours ago" },
    { id: 10244, type: "Seed Purchase", amount: "₹8,000", applicantInitial: "DD", date: "4 hours ago" }
  ];

  // Calculate pending urgent applications (>48h)
  const urgentCount = 3;
  
  // Statistics for today's verifications
  const verifiedToday = 8;
  const approvedToday = 6;
  const rejectedToday = 2;
  
  // Calculate average verification time
  const avgTime = "1.8 hrs";
  const timeChange = "-20 mins";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Verifier Dashboard</h2>
        <p className="text-muted-foreground">
          Verify applications and manage lending partners.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Verification"
          value={pendingApplications.length.toString()}
          description={`${urgentCount} urgent (>48h)`}
          icon={CreditCard}
        />
        
        <StatCard
          title="Verified Today"
          value={verifiedToday.toString()}
          description={`${approvedToday} approved, ${rejectedToday} rejected`}
          icon={BarChart}
        />
        
        <StatCard
          title="Average Time"
          value={avgTime}
          description={`${timeChange} from yesterday`}
          icon={ArrowDown}
          descriptionColor="text-green-600"
        />
        
        <StatCard
          title="Active Partners"
          value="5"
          description="All regions covered"
          icon={Users}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Applications Needing Verification</CardTitle>
            <CardDescription>
              Review and verify these applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApplications.map((item, i) => (
                <ApplicationItem
                  key={item.id}
                  id={item.id}
                  title={`Application #${item.id}`}
                  date={`Submitted ${item.date}`}
                  status="Awaiting verification"
                  statusColor="bg-yellow-100 text-yellow-800"
                  showActions={true}
                  amount={item.amount}
                  type={item.type}
                  applicantInitial={item.applicantInitial}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifierDashboard;
