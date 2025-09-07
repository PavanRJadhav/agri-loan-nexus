import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoanApplication, Transaction, TransactionType, TransactionStatus } from "@/types/loans";
import { format } from "date-fns";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ArrowLeft } from "lucide-react";
import { IndianRupee } from "lucide-react";

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const ApplyLoanPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, addTransaction, updateUserData } = useAuth();
  const { toast } = useToast();
  const [selectedLoanType, setSelectedLoanType] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("");
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generatePDFReport = (transaction: any, type: 'payment' | 'loan') => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text('Agri Loan Nexus', 105, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.text('Loan Application Receipt', 105, 30, { align: 'center' });
    
    // Add transaction details
    doc.setFontSize(12);
    const details = [
      ['Transaction ID', transaction.transactionId],
      ['Date', format(new Date(transaction.date), 'MMM dd, yyyy')],
      ['Amount', `₹${transaction.amount.toLocaleString()}`],
      ['Type', 'Loan Application Fee'],
      ['Status', transaction.status],
      ['Loan ID', transaction.loanId],
      ['Loan Type', transaction.loanType],
      ['Application Fee', `₹${transaction.applicationFee.toLocaleString()}`],
    ];

    // Add borrower details
    doc.setFontSize(14);
    doc.text('Borrower Details', 20, 50);
    doc.setFontSize(12);
    doc.text(`Name: ${transaction.borrowerDetails.name}`, 20, 60);
    doc.text(`Email: ${transaction.borrowerDetails.email}`, 20, 70);

    // Add transaction details table
    doc.autoTable({
      startY: 80,
      head: [['Field', 'Value']],
      body: details,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 5 },
    });

    // Add footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.text('This is a computer-generated document. No signature is required.', 105, pageHeight - 20, { align: 'center' });
    
    return doc;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create new loan application
      const loanId = `loan-${Date.now()}`;
      const newLoan: LoanApplication = {
        id: loanId,
        type: selectedLoanType,
        amount: parseFloat(amount),
        purpose,
        status: "pending",
        submittedAt: new Date().toISOString(),
        documents: uploadedDocuments,
        amountRepaid: 0,
        paymentsMade: 0
      };

      // Add application fee transaction
      const applicationFee = 500;
      const transactionId = `txn-${Date.now()}`;
      const newTransaction: Omit<Transaction, "id" | "date"> = {
        amount: applicationFee,
        type: "expense" as TransactionType,
        description: `Application fee for ${selectedLoanType} loan`,
        status: "completed" as TransactionStatus
      };

      // Update user's balance
      const currentBalance = user?.financialData?.currentBalance || 0;
      if (currentBalance < applicationFee) {
        toast({
          title: "Insufficient balance",
          description: "You need ₹500 in your account to apply for a loan",
          variant: "destructive",
          duration: 3000
        });
        return;
      }

      // Add transaction and update balance
      await addTransaction(newTransaction);
      await updateUserData({
        financialData: {
          ...user?.financialData,
          currentBalance: currentBalance - applicationFee
        }
      });

      // Add loan application
      const updatedLoans = [...(user?.loans || []), newLoan];
      await updateUserData({ loans: updatedLoans });

      // Generate receipt
      const receipt = {
        transactionId,
        date: new Date().toISOString(),
        amount: applicationFee,
        loanId,
        loanType: selectedLoanType,
        status: "completed",
        applicationFee,
        borrowerDetails: {
          name: user?.name,
          email: user?.email
        }
      };

      // Generate and download PDF
      const doc = generatePDFReport(receipt, 'loan');
      doc.save(`loan_application_${transactionId}.pdf`);

      // Show success message
      toast({
        title: "Application submitted",
        description: "Your loan application has been submitted successfully.",
        duration: 3000
      });

      // Navigate to dashboard
      navigate('/dashboard');

    } catch (error) {
      console.error('Error submitting loan application:', error);
      toast({
        title: "Application failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Apply for a Loan</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Loan Application</CardTitle>
            <CardDescription>
              Fill in the details to apply for a loan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="loan-type" className="text-sm font-medium block mb-1">
                  Loan Type
                </label>
                <Select
                  value={selectedLoanType}
                  onValueChange={setSelectedLoanType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select loan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crop">Crop Loan</SelectItem>
                    <SelectItem value="equipment">Equipment Loan</SelectItem>
                    <SelectItem value="irrigation">Irrigation Loan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="amount" className="text-sm font-medium block mb-1">
                  Loan Amount (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter loan amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="purpose" className="text-sm font-medium block mb-1">
                  Purpose
                </label>
                <Input
                  id="purpose"
                  placeholder="Enter loan purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Required Documents
                </label>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Please upload the following documents:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>Identity Proof (Aadhaar Card)</li>
                    <li>Land Ownership Documents</li>
                    <li>Bank Statements (Last 6 months)</li>
                    <li>Income Proof</li>
                  </ul>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !selectedLoanType || !amount || !purpose}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplyLoanPage; 