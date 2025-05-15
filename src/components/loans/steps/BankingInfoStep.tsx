
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight } from 'lucide-react';

interface BankingInfoStepProps {
  onComplete: (data: any) => void;
  initialData?: any;
}

const BankingInfoStep: React.FC<BankingInfoStepProps> = ({ onComplete, initialData = {} }) => {
  const [formData, setFormData] = useState({
    bankName: initialData.bankName || '',
    accountNumber: initialData.accountNumber || '',
    ifscCode: initialData.ifscCode || '',
    accountHolderName: initialData.accountHolderName || '',
    accountType: initialData.accountType || ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }
    
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (!/^\d+$/.test(formData.accountNumber)) {
      newErrors.accountNumber = 'Account number must contain only digits';
    }
    
    if (!formData.ifscCode.trim()) {
      newErrors.ifscCode = 'IFSC code is required';
    } else if (!/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(formData.ifscCode)) {
      newErrors.ifscCode = 'IFSC code must be in the format XXXX0XXXXXX';
    }
    
    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account holder name is required';
    }
    
    if (!formData.accountType) {
      newErrors.accountType = 'Account type is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onComplete({ bankingInfo: formData });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bankName">Bank Name <span className="text-red-500">*</span></Label>
          <Select
            value={formData.bankName}
            onValueChange={(value) => handleSelectChange('bankName', value)}
          >
            <SelectTrigger id="bankName" className={errors.bankName ? "border-red-500" : ""}>
              <SelectValue placeholder="Select your bank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SBI">State Bank of India</SelectItem>
              <SelectItem value="HDFC">HDFC Bank</SelectItem>
              <SelectItem value="ICICI">ICICI Bank</SelectItem>
              <SelectItem value="PNB">Punjab National Bank</SelectItem>
              <SelectItem value="Canara">Canara Bank</SelectItem>
              <SelectItem value="BOI">Bank of India</SelectItem>
              <SelectItem value="BOB">Bank of Baroda</SelectItem>
              <SelectItem value="Axis">Axis Bank</SelectItem>
              <SelectItem value="Kotak">Kotak Mahindra Bank</SelectItem>
              <SelectItem value="other">Other Bank</SelectItem>
            </SelectContent>
          </Select>
          {errors.bankName && <p className="text-sm text-red-500">{errors.bankName}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="accountType">Account Type <span className="text-red-500">*</span></Label>
          <Select
            value={formData.accountType}
            onValueChange={(value) => handleSelectChange('accountType', value)}
          >
            <SelectTrigger id="accountType" className={errors.accountType ? "border-red-500" : ""}>
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="savings">Savings Account</SelectItem>
              <SelectItem value="current">Current Account</SelectItem>
              <SelectItem value="kisan">Kisan Credit Card Account</SelectItem>
              <SelectItem value="joint">Joint Account</SelectItem>
            </SelectContent>
          </Select>
          {errors.accountType && <p className="text-sm text-red-500">{errors.accountType}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="accountHolderName">Account Holder Name <span className="text-red-500">*</span></Label>
        <Input
          id="accountHolderName"
          name="accountHolderName"
          value={formData.accountHolderName}
          onChange={handleChange}
          placeholder="Enter the name on your bank account"
          className={errors.accountHolderName ? "border-red-500" : ""}
        />
        {errors.accountHolderName && <p className="text-sm text-red-500">{errors.accountHolderName}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="accountNumber">Account Number <span className="text-red-500">*</span></Label>
          <Input
            id="accountNumber"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            placeholder="Enter your account number"
            className={errors.accountNumber ? "border-red-500" : ""}
          />
          {errors.accountNumber && <p className="text-sm text-red-500">{errors.accountNumber}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ifscCode">IFSC Code <span className="text-red-500">*</span></Label>
          <Input
            id="ifscCode"
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleChange}
            placeholder="e.g., SBIN0001234"
            className={errors.ifscCode ? "border-red-500" : ""}
          />
          {errors.ifscCode && <p className="text-sm text-red-500">{errors.ifscCode}</p>}
          <p className="text-xs text-muted-foreground">
            You can find the IFSC code on your checkbook or passbook
          </p>
        </div>
      </div>
      
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mt-4">
        <p className="text-sm">
          <strong>Important:</strong> Ensure that your bank account details are correct. The loan amount will be 
          disbursed to this account upon approval. Also, your repayments will be processed from this account.
        </p>
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

export default BankingInfoStep;
