
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { CreditCard, FileText, Tractor, Sprout, Droplets, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";

const loanTypes = [
  {
    id: "crop_loan",
    name: "Crop Loan",
    description: "Short-term loan for seasonal agricultural operations",
    icon: Sprout,
    maxAmount: 500000,
  },
  {
    id: "equipment_loan",
    name: "Equipment Loan",
    description: "Medium-term loan for purchasing agricultural machinery",
    icon: Tractor,
    maxAmount: 2000000,
  },
  {
    id: "kcc_loan",
    name: "Kisan Credit Card Loan",
    description: "Revolving credit for production and contingency expenses",
    icon: CreditCard,
    maxAmount: 300000,
  },
  {
    id: "irrigation_loan",
    name: "Irrigation Loan",
    description: "For installation of irrigation systems and water conservation",
    icon: Droplets,
    maxAmount: 1000000,
  },
  {
    id: "land_development",
    name: "Land Development Loan",
    description: "For land improvement and development activities",
    icon: FileText,
    maxAmount: 1500000,
  }
];

const formSchema = z.object({
  loanType: z.string({
    required_error: "Please select a loan type",
  }),
  amount: z.number({
    required_error: "Please specify a loan amount",
    invalid_type_error: "Amount must be a number",
  }).min(5000, {
    message: "Amount must be at least ₹5,000",
  }).max(2000000, {
    message: "Amount cannot exceed ₹20,00,000",
  }),
  purpose: z.string({
    required_error: "Please describe the purpose of the loan",
  }).min(10, {
    message: "Purpose description must be at least 10 characters",
  }).max(500, {
    message: "Purpose description cannot exceed 500 characters",
  }),
  tenure: z.number({
    required_error: "Please select a loan tenure",
  }).min(3, {
    message: "Tenure must be at least 3 months",
  }).max(60, {
    message: "Tenure cannot exceed 60 months",
  }),
  collateralDescription: z.string().optional(),
  hasCollateral: z.boolean().default(false),
  termsAccepted: z.boolean().refine(value => value === true, {
    message: "You must accept the terms and conditions",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const LoanApplicationForm: React.FC = () => {
  const { user, addLoanApplication, addTransaction } = useAuth();
  const [maxEligibleAmount, setMaxEligibleAmount] = useState<number | null>(null);

  // Effect to check credit score and set max eligible amount
  useEffect(() => {
    if (user?.creditScore?.maxEligibleAmount) {
      setMaxEligibleAmount(user.creditScore.maxEligibleAmount);
    }
  }, [user?.creditScore]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 50000,
      tenure: 12,
      hasCollateral: false,
      termsAccepted: false,
    },
  });
  
  const selectedLoanType = form.watch("loanType");
  const hasCollateral = form.watch("hasCollateral");
  const currentAmount = form.watch("amount");
  
  const selectedLoan = loanTypes.find(loan => loan.id === selectedLoanType);
  
  // Calculate loan type max amount based on credit score
  const getAdjustedMaxAmount = () => {
    if (!selectedLoan) return 2000000;
    
    // If credit score exists, use the lower of credit score max amount or loan type max amount
    if (maxEligibleAmount !== null) {
      return Math.min(maxEligibleAmount, selectedLoan.maxAmount);
    }
    
    return selectedLoan.maxAmount;
  };
  
  const adjustedMaxAmount = getAdjustedMaxAmount();
  
  // Check if amount exceeds adjusted max
  const isAmountExceedingLimit = currentAmount > adjustedMaxAmount;
  
  // Calculate approval likelihood based on credit score
  const getApprovalLikelihood = () => {
    if (!user?.creditScore) return null;
    
    if (currentAmount > user.creditScore.maxEligibleAmount) {
      return "Low";
    }
    
    return user.creditScore.loanApprovalLikelihood;
  };
  
  const approvalLikelihood = getApprovalLikelihood();
  
  const onSubmit = async (data: FormValues) => {
    try {
      console.log("Submitting loan application:", data);
      
      // Validate against credit score
      if (user?.creditScore && data.amount > user.creditScore.maxEligibleAmount) {
        toast.error("Loan amount exceeds your eligible limit", {
          description: `Based on your credit score, you can apply for up to ₹${user.creditScore.maxEligibleAmount.toLocaleString()}.`,
        });
        return;
      }
      
      // In a real app, we would send this data to an API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add loan to user's loans
      const loanTypeName = selectedLoan?.name || data.loanType;
      
      addLoanApplication({
        type: loanTypeName,
        amount: data.amount,
        purpose: data.purpose
      });
      
      // Record a transaction for application fee
      addTransaction({
        amount: 500, // Application fee
        type: "payment",
        description: `Application fee for ${loanTypeName}`
      });
      
      toast.success("Loan application submitted successfully!", {
        description: `Your ${selectedLoan?.name} application has been received.`,
      });
      
      form.reset({
        amount: 50000,
        tenure: 12,
        hasCollateral: false,
        termsAccepted: false,
      });
    } catch (error) {
      toast.error("Failed to submit application", {
        description: "Please try again later.",
      });
      console.error("Error submitting loan application:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {user?.creditScore ? (
          <Alert className={
            approvalLikelihood === 'High' ? 'bg-green-50 border-green-200 text-green-800' :
            approvalLikelihood === 'Medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
            'bg-red-50 border-red-200 text-red-800'
          }>
            <AlertTitle className="flex items-center gap-2">
              Credit Score: {user.creditScore.score}
              {approvalLikelihood === 'High' ? ' - Excellent!' : 
               approvalLikelihood === 'Medium' ? ' - Good' : 
               ' - Needs Improvement'}
            </AlertTitle>
            <AlertDescription>
              Based on your credit score, you can apply for loans up to 
              <span className="font-bold"> ₹{user.creditScore.maxEligibleAmount.toLocaleString()}</span>.
              Your approval likelihood is <span className="font-bold">{user.creditScore.loanApprovalLikelihood}</span>.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertTitle className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Improve your loan approval chances
            </AlertTitle>
            <AlertDescription>
              Getting your credit score can increase your loan approval chances and potentially 
              increase your borrowing limit.
              <Button variant="link" asChild className="p-0 h-auto font-normal">
                <Link to="/credit-score"> Check your credit score now</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Loan Details</h2>
            
            <FormField
              control={form.control}
              name="loanType"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel>Loan Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a loan type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loanTypes.map((loan) => (
                        <SelectItem key={loan.id} value={loan.id}>
                          <div className="flex items-center gap-2">
                            <loan.icon className="h-4 w-4" />
                            <span>{loan.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {selectedLoan?.description || "Select a loan type to see its description"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel>Loan Amount (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      className={isAmountExceedingLimit ? "border-red-500 focus:ring-red-500" : ""}
                    />
                  </FormControl>
                  <FormDescription className={isAmountExceedingLimit ? "text-red-500" : ""}>
                    {selectedLoan 
                      ? `Maximum eligible amount: ₹${adjustedMaxAmount.toLocaleString()}`
                      : "Select a loan type to see maximum amount"}
                    {isAmountExceedingLimit && " - Amount exceeds your eligible limit!"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tenure"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel>Loan Tenure (Months): {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={3}
                      max={60}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={(values) => field.onChange(values[0])}
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>3 months</span>
                    <span>60 months</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Additional Information</h2>
            
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel>Purpose of Loan</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe how you plan to use this loan"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Be specific about how the funds will be utilized
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hasCollateral"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-6">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I have collateral to offer for this loan
                    </FormLabel>
                    <FormDescription>
                      Collateral may help you get a better interest rate
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            {hasCollateral && (
              <FormField
                control={form.control}
                name="collateralDescription"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel>Collateral Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the collateral you're offering (e.g., land documents, equipment)"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the terms and conditions
                    </FormLabel>
                    <FormDescription>
                      By submitting this application, you consent to credit verification and agree to our loan terms
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            size="lg"
            disabled={isAmountExceedingLimit}
          >
            Submit Application
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoanApplicationForm;
