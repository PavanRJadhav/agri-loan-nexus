
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Phone, Mail, Globe } from "lucide-react";

const LendingPartnersPage: React.FC = () => {
  const partners = [
    {
      name: "AgriFinance Corp",
      description: "Specializes in medium to large agricultural loans",
      contact: "contact@agrifinance.com",
      phone: "+91 98765 43210",
      website: "agrifinance.com",
      regions: ["North", "East"],
      status: "active"
    },
    {
      name: "Rural Credit Union",
      description: "Focused on small farmers and micro-loans",
      contact: "support@ruralcredit.org",
      phone: "+91 98765 43211",
      website: "ruralcredit.org",
      regions: ["South", "West"],
      status: "active"
    },
    {
      name: "Harvest Financial",
      description: "Specializing in equipment financing and crop loans",
      contact: "info@harvestfin.com",
      phone: "+91 98765 43212",
      website: "harvestfin.com",
      regions: ["Central", "North-East"],
      status: "active"
    },
    {
      name: "Green Growth Investments",
      description: "Focus on sustainable farming practices and eco-loans",
      contact: "partnerships@greengrowth.co",
      phone: "+91 98765 43213",
      website: "greengrowth.co",
      regions: ["All Regions"],
      status: "pending"
    },
    {
      name: "Farm Future Finance",
      description: "New generation agricultural credit and insurance",
      contact: "hello@farmfuture.in",
      phone: "+91 98765 43214",
      website: "farmfuture.in",
      regions: ["South", "Central"],
      status: "active"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Lending Partners</h2>
        <p className="text-muted-foreground">
          Manage and coordinate with our financial lending partners.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {partners.map((partner, index) => (
          <Card key={index}>
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LendingPartnersPage;
