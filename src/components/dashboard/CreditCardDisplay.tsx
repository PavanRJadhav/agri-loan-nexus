
import React from "react";
import { CreditCard } from "lucide-react";

interface CreditCardDisplayProps {
  name: string;
  cardNumber: string;
  validUntil: string;
  availableCredit: string;
  creditLimit: string;
  percentAvailable: number;
}

const CreditCardDisplay: React.FC<CreditCardDisplayProps> = ({
  name,
  cardNumber,
  validUntil,
  availableCredit,
  creditLimit,
  percentAvailable
}) => {
  return (
    <>
      <div className="bg-gradient-to-r from-agriloan-primary to-agriloan-secondary text-white rounded-md p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="font-medium">Kisan Credit Card</p>
          </div>
          <CreditCard className="h-6 w-6" />
        </div>
        <p className="text-sm mb-1">Card Number</p>
        <p className="font-mono mb-4">{cardNumber}</p>
        <div className="flex justify-between">
          <div>
            <p className="text-sm">Card Holder</p>
            <p>{name}</p>
          </div>
          <div>
            <p className="text-sm">Valid Until</p>
            <p>{validUntil}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <span>Available Credit</span>
          <span className="font-medium">{availableCredit}</span>
        </div>
        <div className="flex justify-between">
          <span>Credit Limit</span>
          <span className="font-medium">{creditLimit}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-agriloan-primary h-2.5 rounded-full" 
            style={{ width: `${percentAvailable}%` }}
          ></div>
        </div>
        <p className="text-xs text-right text-muted-foreground">{percentAvailable}% Available</p>
      </div>
    </>
  );
};

export default CreditCardDisplay;
