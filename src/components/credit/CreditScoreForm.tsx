
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditScoreFactors } from "@/utils/creditScoring";

const creditScoreFormSchema = z.object({
  landSize: z.coerce.number().min(0, "Land size cannot be negative"),
  mainCrop: z.string().min(1, "Please select a main crop"),
  cropDiversity: z.coerce.number().min(1, "Must grow at least one crop").max(10, "Value too high"),
  farmingExperience: z.coerce.number().min(0, "Experience cannot be negative"),
  previousLoans: z.coerce.number().min(0, "Cannot be negative"),
  previousLoanAmount: z.coerce.number().optional(),
  previousLoanRepaid: z.boolean().default(false),
  missedPayments: z.coerce.number().min(0, "Cannot be negative"),
  seasonalYield: z.coerce.number().min(0, "Cannot be negative"),
  hasCollateral: z.boolean().default(false),
});

type CreditScoreFormValues = z.infer<typeof creditScoreFormSchema>;

interface CreditScoreFormProps {
  onSubmit: (data: CreditScoreFactors) => void;
  isLoading?: boolean;
}

const CreditScoreForm: React.FC<CreditScoreFormProps> = ({ onSubmit, isLoading = false }) => {
  const form = useForm<CreditScoreFormValues>({
    resolver: zodResolver(creditScoreFormSchema),
    defaultValues: {
      landSize: 0,
      cropDiversity: 1,
      farmingExperience: 0,
      previousLoans: 0,
      missedPayments: 0,
      seasonalYield: 0,
      previousLoanRepaid: false,
      hasCollateral: false,
    },
  });

  const handleSubmit = (data: CreditScoreFormValues) => {
    // Convert form data to the format required by the credit scoring algorithm
    const creditFactors: CreditScoreFactors = {
      landSize: data.landSize,
      cropHistory: Array(data.cropDiversity).fill(data.mainCrop),
      seasonalData: [
        {
          season: "current",
          crop: data.mainCrop,
          yield: data.seasonalYield
        }
      ],
      creditHistory: {
        previousLoans: data.previousLoans,
        onTimePayments: data.previousLoans - data.missedPayments,
        missedPayments: data.missedPayments
      },
      aadhaarVerified: true, // Assuming the user is already verified
      previousLoanAmount: data.previousLoanAmount,
      previousLoanRepaid: data.previousLoans > 0 ? data.previousLoanRepaid : undefined,
      farmingExperience: data.farmingExperience
    };

    onSubmit(creditFactors);
    toast.success("Credit data submitted for analysis");
  };

  const hasPreviousLoans = form.watch("previousLoans") > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Assessment Form</CardTitle>
        <CardDescription>
          Provide accurate information to calculate your AgriCredit Score
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Farming Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Farming Details</h3>
                
                <FormField
                  control={form.control}
                  name="landSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Land Size (Acres)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Total agricultural land you own or lease
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="mainCrop"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Crop</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select main crop" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="rice">Rice</SelectItem>
                          <SelectItem value="wheat">Wheat</SelectItem>
                          <SelectItem value="cotton">Cotton</SelectItem>
                          <SelectItem value="sugarcane">Sugarcane</SelectItem>
                          <SelectItem value="pulses">Pulses</SelectItem>
                          <SelectItem value="vegetables">Vegetables</SelectItem>
                          <SelectItem value="fruits">Fruits</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cropDiversity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crop Diversity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          placeholder="Number of different crops grown"
                        />
                      </FormControl>
                      <FormDescription>
                        Number of different crops you typically grow
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="farmingExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Farming Experience (Years)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="seasonalYield"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average Yield (Quintals/Acre)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Average yield per acre in your last harvest
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Financial and Credit History Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Credit History</h3>
                
                <FormField
                  control={form.control}
                  name="previousLoans"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous Agricultural Loans</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          placeholder="Number of previous loans"
                        />
                      </FormControl>
                      <FormDescription>
                        Total number of agricultural loans taken previously
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {hasPreviousLoans && (
                  <>
                    <FormField
                      control={form.control}
                      name="previousLoanAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Most Recent Loan Amount (₹)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="Amount of your most recent loan"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="previousLoanRepaid"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Previous Loan Fully Repaid
                            </FormLabel>
                            <FormDescription>
                              Have you fully repaid your most recent loan?
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="missedPayments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Missed Payments</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="Number of missed payments"
                            />
                          </FormControl>
                          <FormDescription>
                            Number of payments missed across all previous loans
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                <FormField
                  control={form.control}
                  name="hasCollateral"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Collateral Available
                        </FormLabel>
                        <FormDescription>
                          Do you have collateral to offer for loan security?
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Processing..." : "Calculate Credit Score"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreditScoreForm;
