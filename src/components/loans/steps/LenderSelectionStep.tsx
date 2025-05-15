
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check, Info, Percent, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface LenderSelectionStepProps {
  onComplete: (data: any) => void;
  initialData?: any;
  preferredLender?: any;
}

interface Lender {
  id: string;
  name: string;
  interestRate: number;
  processingTime: string;
  minAmount: number;
  maxAmount: number;
  recommended: boolean;
  features: string[];
}

const LenderSelectionStep: React.FC<LenderSelectionStepProps> = ({ 
  onComplete, 
  initialData,
  preferredLender 
}) => {
  const { user, updateUserData } = useAuth();
  
  const [selectedLenderId, setSelectedLenderId] = useState<string>(
    initialData?.id || preferredLender?.id || ""
  );
  
  const [lenders, setLenders] = useState<Lender[]>([
    {
      id: "lender-1",
      name: "Kisan Agricultural Bank",
      interestRate: 7.5,
      processingTime: "3-5 days",
      minAmount: 10000,
      maxAmount: 500000,
      recommended: true,
      features: ["No Prepayment Penalty", "Flexible Repayment Options", "Doorstep Service"]
    },
    {
      id: "lender-2",
      name: "Rural Development Finance",
      interestRate: 8.25,
      processingTime: "2-4 days",
      minAmount: 15000,
      maxAmount: 750000,
      recommended: false,
      features: ["Low Processing Fee", "Longer Tenure Options", "Quick Approval"]
    },
    {
      id: "lender-3",
      name: "Grameen Cooperative Bank",
      interestRate: 6.9,
      processingTime: "5-7 days",
      minAmount: 5000,
      maxAmount: 300000,
      recommended: false,
      features: ["Lowest Interest Rate", "Special Rates for Women Farmers", "Minimal Documentation"]
    },
    {
      id: "lender-4",
      name: "AgroFinance Limited",
      interestRate: 9.0,
      processingTime: "1-2 days",
      minAmount: 25000,
      maxAmount: 1000000,
      recommended: false,
      features: ["Fastest Processing", "Highest Loan Limit", "No Guarantor Required"]
    }
  ]);
  
  useEffect(() => {
    // Pre-select preferredLender from user data if available
    if (preferredLender && preferredLender.id) {
      setSelectedLenderId(preferredLender.id);
    }
  }, [preferredLender]);
  
  const handleLenderSelection = (lenderId: string) => {
    setSelectedLenderId(lenderId);
  };
  
  const getSelectedLender = () => {
    return lenders.find(lender => lender.id === selectedLenderId);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLenderId) {
      toast.error("Please select a lender to continue");
      return;
    }
    
    const selectedLender = getSelectedLender();
    
    if (selectedLender) {
      // Update user's preferred lender in context
      updateUserData({ preferredLender: selectedLender });
      
      // Continue to next step
      onComplete({ selectedLender });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <RadioGroup value={selectedLenderId} onValueChange={handleLenderSelection}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {lenders.map((lender) => (
            <Card 
              key={lender.id} 
              className={`cursor-pointer border-2 transition-all ${
                selectedLenderId === lender.id ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleLenderSelection(lender.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={lender.id} id={lender.id} className="mt-0.5" />
                    <Label htmlFor={lender.id} className="text-lg font-medium cursor-pointer">
                      {lender.name}
                    </Label>
                  </div>
                  {lender.recommended && (
                    <Badge className="bg-green-500">Recommended</Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Percent className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Interest: <strong>{lender.interestRate}%</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Processing: <strong>{lender.processingTime}</strong></span>
                  </div>
                </div>
                
                <div className="mt-4 text-sm">
                  <span>Loan Range: </span>
                  <strong>₹{lender.minAmount.toLocaleString()} - ₹{lender.maxAmount.toLocaleString()}</strong>
                </div>
                
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {lender.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full">
                        <Check className="h-3 w-3 mr-1 text-green-600" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
                
                {selectedLenderId === lender.id && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </RadioGroup>
      
      {selectedLenderId && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start space-x-2">
          <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p>
              You've selected <strong>{getSelectedLender()?.name}</strong> with {getSelectedLender()?.interestRate}% interest rate.
              Loans are typically processed within {getSelectedLender()?.processingTime}. You can apply for 
              ₹{getSelectedLender()?.minAmount.toLocaleString()} to ₹{getSelectedLender()?.maxAmount.toLocaleString()}.
            </p>
          </div>
        </div>
      )}
      
      <div className="flex justify-end mt-6">
        <Button type="submit" className="flex items-center" disabled={!selectedLenderId}>
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default LenderSelectionStep;
