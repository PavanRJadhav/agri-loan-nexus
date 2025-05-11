
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";

export interface LendingPartnerType {
  id: string;
  name: string;
  description: string;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  processingTime: string;
  requirements: string[];
}

const LendingPartnersPage: React.FC = () => {
  const navigate = useNavigate();

  const lenders: LendingPartnerType[] = [
    {
      id: "lender-1",
      name: "Krishi Finance",
      description: "Specializing in loans for small farmers",
      interestRate: 9.5,
      minAmount: 10000,
      maxAmount: 500000,
      processingTime: "5-7 business days",
      requirements: ["Land ownership documents", "Aadhar card", "Bank statement"],
    },
    {
      id: "lender-2",
      name: "Gramin Suvidha",
      description: "Providing accessible credit to rural communities",
      interestRate: 10.2,
      minAmount: 5000,
      maxAmount: 300000,
      processingTime: "7-10 business days",
      requirements: ["Identity proof", "Address proof", "Crop details"],
    },
    {
      id: "lender-3",
      name: "Agri Sampark",
      description: "Empowering farmers with flexible loan options",
      interestRate: 8.9,
      minAmount: 20000,
      maxAmount: 700000,
      processingTime: "3-5 business days",
      requirements: ["Land records", "KYC documents", "Income proof"],
    },
  ];
  
  const handleSelectLender = (lender: LendingPartnerType) => {
    navigate("/lenders");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Lending Partners</h2>
        <p className="text-muted-foreground">
          View and manage all available lending partners.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lenders.map((lender) => (
          <Card key={lender.id}>
            <CardHeader>
              <CardTitle>{lender.name}</CardTitle>
              <CardDescription>{lender.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Interest Rate</h4>
                  <p className="text-sm">{lender.interestRate}%</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Loan Amount Range</h4>
                  <p className="text-sm">₹{lender.minAmount.toLocaleString()} - ₹{lender.maxAmount.toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Processing Time</h4>
                  <p className="text-sm">{lender.processingTime}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Requirements</h4>
                  <ul className="text-sm list-disc pl-5">
                    {lender.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => handleSelectLender(lender)}
                >
                  <Building className="mr-2 h-4 w-4" />
                  Select Partner
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LendingPartnersPage;
