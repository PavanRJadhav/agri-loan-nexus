
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, BarChart, ArrowDown, Users } from "lucide-react";
import StatCard from "./StatCard";
import ApplicationItem from "./ApplicationItem";

const VerifierDashboard: React.FC = () => {
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
          value="12"
          description="3 urgent (>48h)"
          icon={CreditCard}
        />
        
        <StatCard
          title="Verified Today"
          value="8"
          description="6 approved, 2 rejected"
          icon={BarChart}
        />
        
        <StatCard
          title="Average Time"
          value="1.8 hrs"
          description="-20 mins from yesterday"
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
              {[
                { type: "Crop Loan", amount: "₹15,000" },
                { type: "Equipment Purchase", amount: "₹25,000" },
                { type: "Irrigation System", amount: "₹50,000" },
                { type: "Seed Purchase", amount: "₹8,000" }
              ].map((item, i) => (
                <ApplicationItem
                  key={i}
                  id={10240 + i + 1}
                  title={`Application #${10240 + i + 1}`}
                  date=""
                  status="Awaiting verification"
                  statusColor=""
                  showActions={true}
                  amount={item.amount}
                  type={item.type}
                  applicantInitial={`${String.fromCharCode(65 + i)}D`}
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
