
import React from "react";
import CreditCardDisplay from "@/components/dashboard/CreditCardDisplay";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CreditCardsPage: React.FC = () => {
  // Mock data for credit card - in a real app, this would come from an API
  const creditCardData = {
    name: "Rajesh Kumar",
    cardNumber: "**** **** **** 4582",
    validUntil: "09/28",
    availableCredit: "₹40,000",
    creditLimit: "₹50,000",
    percentAvailable: 80
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Credit Cards</h2>
        <p className="text-muted-foreground">
          View and manage your Kisan Credit Card.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kisan Credit Card</CardTitle>
            <CardDescription>Your agricultural credit line</CardDescription>
          </CardHeader>
          <CardContent>
            <CreditCardDisplay {...creditCardData} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Last 30 days of card activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">Farm Equipment Store</p>
                  <p className="text-sm text-muted-foreground">Apr 10, 2025</p>
                </div>
                <span className="text-red-500 font-medium">-₹5,000</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">Agricultural Supplies</p>
                  <p className="text-sm text-muted-foreground">Apr 5, 2025</p>
                </div>
                <span className="text-red-500 font-medium">-₹3,200</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">Credit Repayment</p>
                  <p className="text-sm text-muted-foreground">Apr 1, 2025</p>
                </div>
                <span className="text-green-500 font-medium">+₹2,000</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreditCardsPage;
