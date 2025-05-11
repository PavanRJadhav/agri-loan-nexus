import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Building } from "lucide-react";
import { LendingPartnerType } from "@/pages/LendingPartnersPage";

const LenderSelection: React.FC = () => {
  const { user, updateUserData } = useAuth();
  const navigate = useNavigate();

  const handleLenderSelection = (lender: LendingPartnerType) => {
    updateUserData({ preferredLender: lender });
    navigate("/dashboard");
  };

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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Select Your Preferred Lender</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lenders.map((lender) => (
          <Card key={lender.id}>
            <CardHeader>
              <CardTitle>{lender.name}</CardTitle>
              <CardDescription>{lender.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Interest Rate: {lender.interestRate}%</p>
              <p>Loan Amount: ₹{lender.minAmount} - ₹{lender.maxAmount}</p>
              <Button onClick={() => handleLenderSelection(lender)}>
                <Building className="mr-2 h-4 w-4" />
                Select Lender
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LenderSelection;
