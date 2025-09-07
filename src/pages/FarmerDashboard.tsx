import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoanApplication, Transaction } from "@/types/loans";
import { Download, RefreshCw, AlertCircle, CheckCircle, Calendar, CreditCard, IndianRupee } from "lucide-react";
import { format } from "date-fns";

const FarmerDashboard: React.FC = () => {
  const { user, addTransaction, updateUserData } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [repaymentAmount, setRepaymentAmount] = useState("");
  const [selectedLoanId, setSelectedLoanId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "upi" | "card">("bank_transfer");
  const [minimumPayment, setMinimumPayment] = useState(0);

  // Get all approved loans that haven't been fully repaid
  const approvedLoans = user?.loans?.filter((loan: LoanApplication) => loan.status === 'approved') || [];
  
  // Calculate remaining balance and payment history for each loan
  const loansWithDetails = approvedLoans.map((loan: LoanApplication) => {
    const payments = user?.transactions?.filter((txn: Transaction) => 
      txn.type === "payment" && 
      txn.description.includes(`Loan repayment for ${loan.id}`)
    ) || [];

    const totalPaid = payments.reduce((sum: number, txn: Transaction) => sum + txn.amount, 0);
    const remainingBalance = Math.max(0, loan.amount - totalPaid);
    const paymentProgress = (totalPaid / loan.amount) * 100;
    const nextPaymentDue = new Date(loan.submittedAt);
    nextPaymentDue.setMonth(nextPaymentDue.getMonth() + 1);

    // Calculate minimum payment (5% of remaining balance or ₹1000, whichever is higher)
    const minPayment = Math.max(remainingBalance * 0.05, 1000);

    return {
      ...loan,
      remainingBalance,
      totalPaid,
      paymentProgress,
      payments,
      nextPaymentDue,
      minimumPayment: minPayment
    };
  });

  // Set default selected loan and minimum payment
  useEffect(() => {
    if (loansWithDetails.length > 0 && !selectedLoanId) {
      const firstLoan = loansWithDetails[0];
      setSelectedLoanId(firstLoan.id);
      setMinimumPayment(firstLoan.minimumPayment);
    }
  }, [loansWithDetails, selectedLoanId]);

  // Update minimum payment when loan selection changes
  useEffect(() => {
    const selectedLoan = loansWithDetails.find(loan => loan.id === selectedLoanId);
    if (selectedLoan) {
      setMinimumPayment(selectedLoan.minimumPayment);
    }
  }, [selectedLoanId, loansWithDetails]);

  const validateRepaymentAmount = (amount: number, selectedLoan: any) => {
    if (amount < minimumPayment) {
      toast({
        title: "Invalid amount",
        description: `Minimum payment amount is ₹${minimumPayment.toLocaleString()}`,
        variant: "destructive"
      });
      return false;
    }

    if (amount > selectedLoan.remainingBalance) {
      toast({
        title: "Invalid amount",
        description: `Amount cannot exceed remaining balance of ₹${selectedLoan.remainingBalance.toLocaleString()}`,
        variant: "destructive"
      });
      return false;
    }

    if (amount > (user?.financialData?.currentBalance || 0)) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough balance to make this payment",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleRepayment = async () => {
    if (!repaymentAmount || parseFloat(repaymentAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid repayment amount",
        variant: "destructive"
      });
      return;
    }

    if (!selectedLoanId) {
      toast({
        title: "No loan selected",
        description: "Please select a loan to repay",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const amount = parseFloat(repaymentAmount);
      const selectedLoan = loansWithDetails.find(loan => loan.id === selectedLoanId);

      if (!selectedLoan) {
        throw new Error("Selected loan not found");
      }

      // Validate amount
      if (!validateRepaymentAmount(amount, selectedLoan)) {
        setIsProcessing(false);
        return;
      }

      // Process payment
      const newTransaction: Omit<Transaction, "id" | "date"> = {
        amount,
        type: "payment",
        description: `Loan repayment for ${selectedLoanId}`,
        status: "on_time"
      };

      await addTransaction(newTransaction);

      // Update user's balance
      const currentBalance = user?.financialData?.currentBalance || 0;
      await updateUserData({
        financialData: {
          ...user?.financialData,
          currentBalance: currentBalance - amount
        }
      });

      // Update loan status
      const updatedLoans = user?.loans?.map(loan => {
        if (loan.id === selectedLoanId) {
          const totalRepaid = (loan.amountRepaid || 0) + amount;
          const isFullyRepaid = totalRepaid >= loan.amount;

          return {
            ...loan,
            amountRepaid: totalRepaid,
            paymentsMade: (loan.paymentsMade || 0) + 1,
            status: isFullyRepaid ? "repaid" : loan.status,
            lastPaymentDate: new Date().toISOString()
          };
        }
        return loan;
      });

      if (updatedLoans) {
        await updateUserData({ loans: updatedLoans });
      }

      // Generate payment receipt
      const receipt = {
        transactionId: `txn-${Date.now()}`,
        date: new Date().toISOString(),
        amount,
        loanId: selectedLoanId,
        loanType: selectedLoan.type,
        remainingBalance: selectedLoan.remainingBalance - amount,
        status: "completed",
        paymentMethod,
        receiptNumber: `RCPT-${Date.now()}`,
        borrowerDetails: {
          name: user?.name,
          email: user?.email
        }
      };

      // Download receipt
      const blob = new Blob([JSON.stringify(receipt, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment_receipt_${receipt.transactionId}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Show success message
      toast({
        title: "Payment successful",
        description: `Successfully repaid ₹${amount.toLocaleString()} for your loan.`
      });

      // Clear form
      setRepaymentAmount("");

      // Show additional message if loan is fully repaid
      if (selectedLoan.remainingBalance - amount <= 0) {
        toast({
          title: "Congratulations!",
          description: "You have fully repaid this loan.",
          variant: "default"
        });
      }

      // Refresh the page to update the UI
      window.location.reload();

    } catch (error) {
      console.error("Error processing repayment:", error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Farmer Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your loans and repayments
          </p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="repayment">Make Payment</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {loansWithDetails.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {loansWithDetails.map((loan) => (
                <Card key={loan.id}>
                  <CardHeader>
                    <CardTitle>{loan.type}</CardTitle>
                    <CardDescription>
                      Loan ID: {loan.id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Total Amount</span>
                        <span className="font-medium">₹{loan.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Amount Paid</span>
                        <span className="font-medium">₹{loan.totalPaid.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Remaining Balance</span>
                        <span className="font-medium">₹{loan.remainingBalance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Next Payment Due</span>
                        <span className="font-medium flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(loan.nextPaymentDue, 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Minimum Payment</span>
                        <span className="font-medium">₹{loan.minimumPayment.toLocaleString()}</span>
                      </div>
                      <Progress value={loan.paymentProgress} className="h-2" />
                      <div className="text-sm text-muted-foreground text-center">
                        {loan.paymentProgress.toFixed(1)}% repaid
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No active loans found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="repayment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Make a Payment</CardTitle>
              <CardDescription>
                Select a loan and enter the amount you wish to repay
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loansWithDetails.length > 0 ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="loan-select" className="text-sm font-medium block mb-1">
                      Select Loan
                    </label>
                    <Select
                      value={selectedLoanId}
                      onValueChange={setSelectedLoanId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a loan" />
                      </SelectTrigger>
                      <SelectContent>
                        {loansWithDetails.map((loan) => (
                          <SelectItem key={loan.id} value={loan.id}>
                            {loan.type} - ₹{loan.remainingBalance.toLocaleString()} remaining
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedLoanId && (
                    <>
                      <div>
                        <label htmlFor="amount" className="text-sm font-medium block mb-1">
                          Repayment Amount (₹)
                        </label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="amount"
                            type="number"
                            placeholder="Enter amount to repay"
                            value={repaymentAmount}
                            onChange={(e) => setRepaymentAmount(e.target.value)}
                            className="pl-8"
                          />
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Minimum payment: ₹{minimumPayment.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Maximum: ₹{loansWithDetails.find(loan => loan.id === selectedLoanId)?.remainingBalance.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="payment-method" className="text-sm font-medium block mb-1">
                          Payment Method
                        </label>
                        <Select
                          value={paymentMethod}
                          onValueChange={(value: "bank_transfer" | "upi" | "card") => setPaymentMethod(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bank_transfer">
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                Bank Transfer
                              </div>
                            </SelectItem>
                            <SelectItem value="upi">
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                UPI
                              </div>
                            </SelectItem>
                            <SelectItem value="card">
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                Credit/Debit Card
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        className="w-full"
                        onClick={handleRepayment}
                        disabled={isProcessing || !repaymentAmount}
                      >
                        {isProcessing ? "Processing..." : "Make Payment"}
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  No active loans available for repayment
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {loansWithDetails.length > 0 ? (
            <div className="space-y-4">
              {loansWithDetails.map((loan) => (
                <Card key={loan.id}>
                  <CardHeader>
                    <CardTitle>{loan.type}</CardTitle>
                    <CardDescription>
                      Payment history for loan ID: {loan.id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loan.payments.length > 0 ? (
                      <div className="space-y-4">
                        {loan.payments.map((payment, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>
                              <p className="font-medium">₹{payment.amount.toLocaleString()}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(payment.date), 'MMM dd, yyyy')}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {payment.status === "on_time" ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                              )}
                              <span className="text-sm">{payment.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">
                        No payment history available
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No loan history available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FarmerDashboard; 