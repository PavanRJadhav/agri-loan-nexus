
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { CreditScoreFactors } from "@/utils/creditScoring";

interface CreditScoreFormProps {
  onSubmit: (data: CreditScoreFactors) => void;
  isLoading?: boolean;
}

const CreditScoreForm: React.FC<CreditScoreFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    loanAmount: 5000,
    incomeSource: "farming",
    farmSize: "small" as "small" | "medium" | "large",
    experience: "novice" as "novice" | "experienced" | "expert",
    repaymentHistory: 75,
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleSliderChange = (value: number[]) => {
    setFormData({ ...formData, repaymentHistory: value[0] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      loanAmount: parseFloat(formData.loanAmount.toString()),
      incomeSource: formData.incomeSource,
      farmSize: formData.farmSize,
      experience: formData.experience,
      repaymentHistory: formData.repaymentHistory,
    });

    toast({
      title: "Credit score calculated!",
      description: "Your credit score has been successfully calculated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculate Your Credit Score</CardTitle>
        <CardDescription>
          Fill out the form below to get an estimate of your credit score.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
            <Input
              type="number"
              id="loanAmount"
              placeholder="Enter loan amount"
              value={formData.loanAmount}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="incomeSource">Primary Income Source</Label>
            <Input
              type="text"
              id="incomeSource"
              placeholder="Enter income source"
              value={formData.incomeSource}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="farmSize">Farm Size</Label>
            <Select 
              onValueChange={(value) => handleSelectChange("farmSize", value)}
              disabled={isLoading}
              defaultValue={formData.farmSize}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select farm size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience">Farming Experience</Label>
            <Select 
              onValueChange={(value) => handleSelectChange("experience", value)}
              disabled={isLoading}
              defaultValue={formData.experience}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="novice">Novice</SelectItem>
                <SelectItem value="experienced">Experienced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="repaymentHistory">Repayment History (%)</Label>
            <Slider
              defaultValue={[formData.repaymentHistory]}
              max={100}
              step={1}
              onValueChange={handleSliderChange}
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              {formData.repaymentHistory}% of previous loans repaid on time.
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Calculating..." : "Calculate Credit Score"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreditScoreForm;
