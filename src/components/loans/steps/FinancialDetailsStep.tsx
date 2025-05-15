
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface FinancialDetailsStepProps {
  onComplete: (data: any) => void;
  initialData?: any;
}

const FinancialDetailsStep: React.FC<FinancialDetailsStepProps> = ({ onComplete, initialData = {} }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    annualIncome: initialData.annualIncome || '',
    incomeSource: initialData.incomeSource || 'farming',
    otherIncomeSource: initialData.otherIncomeSource || '',
    existingLoans: initialData.existingLoans || 'no',
    loanDetails: initialData.loanDetails || '',
    loanAmount: initialData.loanAmount || '',
    landOwned: initialData.landOwned || 'yes',
    landDocuments: initialData.landDocuments || 'yes'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user selects
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.annualIncome.trim()) {
      newErrors.annualIncome = 'Annual income is required';
    } else if (isNaN(parseFloat(formData.annualIncome))) {
      newErrors.annualIncome = 'Annual income must be a number';
    }
    
    if (formData.incomeSource === 'other' && !formData.otherIncomeSource.trim()) {
      newErrors.otherIncomeSource = 'Please specify your income source';
    }
    
    if (formData.existingLoans === 'yes' && !formData.loanDetails.trim()) {
      newErrors.loanDetails = 'Please provide details about your existing loans';
    }
    
    if (formData.existingLoans === 'yes' && !formData.loanAmount.trim()) {
      newErrors.loanAmount = 'Please provide your total loan amount';
    } else if (formData.existingLoans === 'yes' && isNaN(parseFloat(formData.loanAmount))) {
      newErrors.loanAmount = 'Loan amount must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onComplete({ financialDetails: formData });
    }
  };
  
  // Fetch active loans from user data if available
  const activeLoans = user?.loans?.filter(loan => loan.status === 'approved') || [];
  const totalActiveLoans = activeLoans.reduce((total, loan) => total + loan.amount, 0);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="annualIncome">Annual Income (₹) <span className="text-red-500">*</span></Label>
          <Input
            id="annualIncome"
            name="annualIncome"
            type="number"
            value={formData.annualIncome}
            onChange={handleChange}
            placeholder="Enter your annual income"
            className={errors.annualIncome ? "border-red-500" : ""}
          />
          {errors.annualIncome && <p className="text-sm text-red-500">{errors.annualIncome}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="incomeSource">Primary Income Source <span className="text-red-500">*</span></Label>
          <Select
            value={formData.incomeSource}
            onValueChange={(value) => handleSelectChange('incomeSource', value)}
          >
            <SelectTrigger id="incomeSource">
              <SelectValue placeholder="Select income source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="farming">Farming</SelectItem>
              <SelectItem value="dairy">Dairy/Livestock</SelectItem>
              <SelectItem value="job">Part-time Job</SelectItem>
              <SelectItem value="business">Small Business</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {formData.incomeSource === 'other' && (
        <div className="space-y-2">
          <Label htmlFor="otherIncomeSource">Specify Income Source <span className="text-red-500">*</span></Label>
          <Input
            id="otherIncomeSource"
            name="otherIncomeSource"
            value={formData.otherIncomeSource}
            onChange={handleChange}
            placeholder="Please specify your income source"
            className={errors.otherIncomeSource ? "border-red-500" : ""}
          />
          {errors.otherIncomeSource && <p className="text-sm text-red-500">{errors.otherIncomeSource}</p>}
        </div>
      )}
      
      <div className="space-y-2">
        <Label>Do you have any existing loans? <span className="text-red-500">*</span></Label>
        <RadioGroup
          value={formData.existingLoans}
          onValueChange={(value) => handleSelectChange('existingLoans', value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="loan-yes" />
            <Label htmlFor="loan-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="loan-no" />
            <Label htmlFor="loan-no">No</Label>
          </div>
        </RadioGroup>
      </div>
      
      {activeLoans.length > 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="font-medium">System detected {activeLoans.length} active loan(s) in your account:</p>
          <ul className="list-disc pl-5 mt-2">
            {activeLoans.map((loan, index) => (
              <li key={index}>
                {loan.type}: ₹{loan.amount.toLocaleString()}
              </li>
            ))}
          </ul>
          <p className="mt-2">Total active loans: ₹{totalActiveLoans.toLocaleString()}</p>
        </div>
      )}
      
      {formData.existingLoans === 'yes' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="loanDetails">Loan Details <span className="text-red-500">*</span></Label>
            <Input
              id="loanDetails"
              name="loanDetails"
              value={formData.loanDetails}
              onChange={handleChange}
              placeholder="Describe your existing loans"
              className={errors.loanDetails ? "border-red-500" : ""}
            />
            {errors.loanDetails && <p className="text-sm text-red-500">{errors.loanDetails}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="loanAmount">Total Outstanding Loan Amount (₹) <span className="text-red-500">*</span></Label>
            <Input
              id="loanAmount"
              name="loanAmount"
              type="number"
              value={formData.loanAmount}
              onChange={handleChange}
              placeholder="Enter total outstanding amount"
              className={errors.loanAmount ? "border-red-500" : ""}
            />
            {errors.loanAmount && <p className="text-sm text-red-500">{errors.loanAmount}</p>}
          </div>
        </>
      )}
      
      <div className="space-y-2">
        <Label>Do you own agricultural land? <span className="text-red-500">*</span></Label>
        <RadioGroup
          value={formData.landOwned}
          onValueChange={(value) => handleSelectChange('landOwned', value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="land-yes" />
            <Label htmlFor="land-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="land-no" />
            <Label htmlFor="land-no">No</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label>Do you have land ownership documents? <span className="text-red-500">*</span></Label>
        <RadioGroup
          value={formData.landDocuments}
          onValueChange={(value) => handleSelectChange('landDocuments', value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="docs-yes" />
            <Label htmlFor="docs-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="docs-no" />
            <Label htmlFor="docs-no">No</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button type="submit" className="flex items-center">
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default FinancialDetailsStep;
