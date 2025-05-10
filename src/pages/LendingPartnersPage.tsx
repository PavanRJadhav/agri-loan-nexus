
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Phone, Mail, Globe, Percent } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export interface LendingPartner {
  id: string;
  name: string;
  description: string;
  contact: string;
  phone: string;
  website: string;
  regions: string[];
  status: "active" | "pending";
  interestRate: number;
  minLoanAmount: number;
  maxLoanAmount: number;
}

const LendingPartnersPage: React.FC = () => {
  const { user, updateUserData } = useAuth();
  
  const partners: LendingPartner[] = [
    {
      id: "agri-finance",
      name: "AgriFinance Corp",
      description: "Specializes in medium to large agricultural loans",
      contact: "contact@agrifinance.com",
      phone: "+91 98765 43210",
      website: "agrifinance.com",
      regions: ["North", "East"],
      status: "active",
      interestRate: 8.5,
      minLoanAmount: 50000,
      maxLoanAmount: 2000000
    },
    {
      id: "rural-credit",
      name: "Rural Credit Union",
      description: "Focused on small farmers and micro-loans",
      contact: "support@ruralcredit.org",
      phone: "+91 98765 43211",
      website: "ruralcredit.org",
      regions: ["South", "West"],
      status: "active",
      interestRate: 7.2,
      minLoanAmount: 10000,
      maxLoanAmount: 500000
    },
    {
      id: "harvest-fin",
      name: "Harvest Financial",
      description: "Specializing in equipment financing and crop loans",
      contact: "info@harvestfin.com",
      phone: "+91 98765 43212",
      website: "harvestfin.com",
      regions: ["Central", "North-East"],
      status: "active",
      interestRate: 9.0,
      minLoanAmount: 25000,
      maxLoanAmount: 1500000
    },
    {
      id: "green-growth",
      name: "Green Growth Investments",
      description: "Focus on sustainable farming practices and eco-loans",
      contact: "partnerships@greengrowth.co",
      phone: "+91 98765 43213",
      website: "greengrowth.co",
      regions: ["All Regions"],
      status: "pending",
      interestRate: 6.8,
      minLoanAmount: 15000,
      maxLoanAmount: 1000000
    },
    {
      id: "farm-future",
      name: "Farm Future Finance",
      description: "New generation agricultural credit and insurance",
      contact: "hello@farmfuture.in",
      phone: "+91 98765 43214",
      website: "farmfuture.in",
      regions: ["South", "Central"],
      status: "active",
      interestRate: 7.5,
      minLoanAmount: 20000,
      maxLoanAmount: 800000
    }
  ];

  // Function for verifiers to toggle partner status
  const togglePartnerStatus = (partnerId: string) => {
    // In a real app, this would update a database
    console.log(`Toggled status for partner: ${partnerId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Lending Partners</h2>
        <p className="text-muted-foreground">
          Manage and coordinate with our financial lending partners.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {partners.map((partner) => (
          <Card key={partner.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{partner.name}</CardTitle>
                <Badge variant={partner.status === "active" ? "default" : "outline"}>
                  {partner.status === "active" ? "Active" : "Pending"}
                </Badge>
              </div>
              <CardDescription>
                {partner.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Percent className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Interest Rate: <span className="font-semibold">{partner.interestRate}%</span></span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{partner.contact}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{partner.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{partner.website}</span>
                </div>
                <div className="flex items-center text-sm pt-2">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Regions: {partner.regions.join(", ")}</span>
                </div>
                
                <div className="flex items-center text-sm pt-2">
                  <span className="text-xs text-muted-foreground">Loan Range: ₹{partner.minLoanAmount.toLocaleString()} - ₹{partner.maxLoanAmount.toLocaleString()}</span>
                </div>
                
                {user?.role === "verifier" && (
                  <div className="pt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => togglePartnerStatus(partner.id)}
                    >
                      {partner.status === "active" ? "Set Pending" : "Activate Partner"}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LendingPartnersPage;
export { type LendingPartner };
