
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Landmark, BanknoteIcon, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Define the LendingPartner type for this component
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
  const { user, updateUserData, sendNotification } = useAuth();
  const [lendingPartners, setLendingPartners] = useState<LendingPartnerType[]>([
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
  ]);

  const handleSelectLender = (lender: LendingPartnerType) => {
    updateUserData({ preferredLender: lender });
    toast.success(`${lender.name} selected as preferred lender`, {
      description: `You have chosen ${lender.name} as your preferred lending partner.`,
    });
    
    // Send lender selected notification
    sendNotification("lender_selected", { name: lender.name });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Lending Partners</h2>
        <p className="text-muted-foreground">
          Choose a lending partner that best fits your financial needs
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lendingPartners.map((lender) => (
          <Card key={lender.id} className="bg-white rounded-lg shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{lender.name}</CardTitle>
              <CardDescription className="text-gray-500">{lender.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Interest Rate:</span> {lender.interestRate}%
                </p>
                <p className="text-sm">
                  <span className="font-medium">Loan Amount:</span> ₹{lender.minAmount.toLocaleString()} - ₹{lender.maxAmount.toLocaleString()}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Processing Time:</span> {lender.processingTime}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Requirements:</span>
                  <ul className="list-disc pl-5">
                    {lender.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </p>
              </div>
              <Button 
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleSelectLender(lender)}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Select This Lender
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {user?.preferredLender && (
        <Card className="bg-white rounded-lg shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Your Preferred Lender</CardTitle>
            <CardDescription className="text-gray-500">
              You have selected {user.preferredLender.name} as your preferred lending partner.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Interest Rate:</span> {user.preferredLender.interestRate}%
              </p>
              <p className="text-sm">
                <span className="font-medium">Description:</span> {user.preferredLender.description}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LendingPartnersPage;
