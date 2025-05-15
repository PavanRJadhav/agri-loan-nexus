
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

interface ReviewSubmitStepProps {
  formData: any;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({
  formData,
  onSubmit,
  isSubmitting
}) => {
  return (
    <div className="space-y-6">
      {/* Farm Details */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Farm Details</h3>
            <span className="text-green-600 flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete
            </span>
          </div>
          <Separator className="mb-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Farm Name</Label>
              <p className="font-medium">{formData.farmDetails?.farmName || "Not provided"}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Farm Location</Label>
              <p className="font-medium">{formData.farmDetails?.farmLocation || "Not provided"}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Farm Size</Label>
              <p className="font-medium">
                {formData.farmDetails?.farmSize} {formData.farmDetails?.sizeUnit || "acres"}
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Farm Type</Label>
              <p className="font-medium">{formData.farmDetails?.farmType || "Not provided"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Financial Details */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Financial Details</h3>
            <span className="text-green-600 flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete
            </span>
          </div>
          <Separator className="mb-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Annual Income</Label>
              <p className="font-medium">₹{parseFloat(formData.financialDetails?.annualIncome).toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Income Source</Label>
              <p className="font-medium">{formData.financialDetails?.incomeSource || "Not provided"}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Existing Loans</Label>
              <p className="font-medium">{formData.financialDetails?.existingLoans === "yes" ? "Yes" : "No"}</p>
            </div>
            {formData.financialDetails?.existingLoans === "yes" && (
              <div>
                <Label className="text-sm text-muted-foreground">Outstanding Loan Amount</Label>
                <p className="font-medium">₹{parseFloat(formData.financialDetails?.loanAmount).toLocaleString()}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Banking Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Banking Information</h3>
            <span className="text-green-600 flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete
            </span>
          </div>
          <Separator className="mb-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Bank Name</Label>
              <p className="font-medium">{formData.bankingInfo?.bankName || "Not provided"}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Account Type</Label>
              <p className="font-medium">{formData.bankingInfo?.accountType || "Not provided"}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Account Holder</Label>
              <p className="font-medium">{formData.bankingInfo?.accountHolderName || "Not provided"}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Account Number</Label>
              <p className="font-medium">XXXX{formData.bankingInfo?.accountNumber.slice(-4) || "XXXX"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Documents */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Uploaded Documents</h3>
            <span className="text-green-600 flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete
            </span>
          </div>
          <Separator className="mb-4" />
          
          <ul className="space-y-2">
            {formData.documents?.map((doc: any, index: number) => (
              <li key={index} className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                {doc.name}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      {/* Loan Details */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Loan Details</h3>
            <span className="text-green-600 flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete
            </span>
          </div>
          <Separator className="mb-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Lender</Label>
              <p className="font-medium">{formData.selectedLender?.name || "Not selected"}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Interest Rate</Label>
              <p className="font-medium">{formData.selectedLender?.interestRate || "N/A"}%</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Loan Type</Label>
              <p className="font-medium">{formData.loanType || "Standard Agricultural Loan"}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Loan Amount</Label>
              <p className="font-medium">₹{parseFloat(formData.amount || "0").toLocaleString()}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <Label className="text-sm text-muted-foreground">Loan Purpose</Label>
            <p className="font-medium">{formData.purpose || "Not specified"}</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Confirmation and Submit */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-2 bg-yellow-50 p-3 rounded-md mb-4">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p>
                <strong>Important:</strong> By submitting this application, you confirm that all information provided is 
                accurate to the best of your knowledge. A processing fee of ₹500 will be deducted from your account balance upon submission.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={onSubmit} disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewSubmitStep;
