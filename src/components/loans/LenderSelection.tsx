
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { type LendingPartner } from "@/pages/LendingPartnersPage";

const LenderSelection: React.FC = () => {
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

  // Filter active partners only
  const activePartners = partners.filter(partner => partner.status === "active");

  const handleSelectLender = (partner: LendingPartner) => {
    if (!user) return;
    
    // Update preferred lender in user data
    updateUserData({
      preferredLender: {
        id: partner.id,
        name: partner.name,
        interestRate: partner.interestRate
      }
    });
    
    toast.success("Preferred lender updated", {
      description: `You have selected ${partner.name} as your preferred lender.`
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Select Preferred Lender</h2>
        <p className="text-muted-foreground mb-4">
          Choose a lending partner for your agricultural loan needs
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {activePartners.map((partner) => (
          <Card key={partner.id} className={user?.preferredLender?.id === partner.id ? "border-2 border-green-500" : ""}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{partner.name}</CardTitle>
                {user?.preferredLender?.id === partner.id && (
                  <Badge className="bg-green-500">Selected</Badge>
                )}
              </div>
              <CardDescription>{partner.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Percent className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-lg font-semibold">{partner.interestRate}% Interest Rate</span>
                </div>
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Available in: {partner.regions.join(", ")}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Loan range: ₹{partner.minLoanAmount.toLocaleString()} - ₹{partner.maxLoanAmount.toLocaleString()}
                </div>
                <Button 
                  className="w-full"
                  variant={user?.preferredLender?.id === partner.id ? "outline" : "default"}
                  onClick={() => handleSelectLender(partner)}
                >
                  {user?.preferredLender?.id === partner.id ? "Current Selection" : "Select as Lender"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LenderSelection;
