import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, TrendingUp, AlertCircle, CheckCircle, DollarSign } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState({
    totalLoans: 0,
    totalAmount: 0,
    activeLoans: 0,
    repaidLoans: 0,
    defaultedLoans: 0,
    averageLoanAmount: 0,
    loanDistribution: [],
    monthlyDisbursements: [],
    repaymentRate: 0,
    creditScoreDistribution: [],
    riskMetrics: {
      defaultRate: 0,
      averageCreditScore: 0,
      riskScore: 0,
      highRiskLoans: 0,
      mediumRiskLoans: 0,
      lowRiskLoans: 0
    },
    performanceMetrics: {
      onTimePayments: 0,
      latePayments: 0,
      averageRepaymentTime: 0,
      collectionEfficiency: 0
    },
    regionalDistribution: [],
    loanPurposeDistribution: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = () => {
    // Fetch and process data from localStorage
    const allLoans = [];
    const monthlyData = {};
    const creditScores = [];
    const regionalData = {};
    const purposeData = {};
    let totalAmount = 0;
    let activeCount = 0;
    let repaidCount = 0;
    let defaultedCount = 0;
    let onTimePayments = 0;
    let latePayments = 0;
    let totalRepaymentTime = 0;
    let repaymentCount = 0;

    // Process all user data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('agriloan_userdata_')) {
        const userData = JSON.parse(localStorage.getItem(key) || '{}');
        
        // Track regional distribution
        if (userData.region) {
          regionalData[userData.region] = (regionalData[userData.region] || 0) + 1;
        }

        if (userData.loans) {
          userData.loans.forEach(loan => {
            allLoans.push(loan);
            totalAmount += loan.amount;

            // Track loan purpose
            purposeData[loan.purpose] = (purposeData[loan.purpose] || 0) + 1;

            // Track loan status
            if (loan.status === 'approved') activeCount++;
            if (loan.status === 'repaid') {
              repaidCount++;
              // Calculate repayment time
              if (loan.submittedAt && loan.lastPaymentDate) {
                const submittedDate = new Date(loan.submittedAt);
                const lastPaymentDate = new Date(loan.lastPaymentDate);
                totalRepaymentTime += (lastPaymentDate.getTime() - submittedDate.getTime()) / (1000 * 60 * 60 * 24); // in days
                repaymentCount++;
              }
            }
            if (loan.status === 'defaulted') defaultedCount++;

            // Track monthly disbursements
            const month = new Date(loan.submittedAt).toLocaleString('default', { month: 'short' });
            monthlyData[month] = (monthlyData[month] || 0) + loan.amount;

            // Track credit scores
            if (userData.creditScore) {
              creditScores.push(userData.creditScore);
            }
          });
        }

        // Track payment performance
        if (userData.transactions) {
          userData.transactions.forEach(txn => {
            if (txn.type === 'payment') {
              if (txn.status === 'on_time') onTimePayments++;
              if (txn.status === 'late') latePayments++;
            }
          });
        }
      }
    }

    // Calculate risk metrics
    const highRiskLoans = allLoans.filter(loan => loan.riskScore > 0.7).length;
    const mediumRiskLoans = allLoans.filter(loan => loan.riskScore > 0.3 && loan.riskScore <= 0.7).length;
    const lowRiskLoans = allLoans.filter(loan => loan.riskScore <= 0.3).length;

    // Update analytics state
    setAnalytics({
      totalLoans: allLoans.length,
      totalAmount,
      activeLoans: activeCount,
      repaidLoans: repaidCount,
      defaultedLoans: defaultedCount,
      averageLoanAmount: totalAmount / allLoans.length,
      loanDistribution: Object.entries(purposeData).map(([purpose, count]) => ({ purpose, count })),
      monthlyDisbursements: Object.entries(monthlyData).map(([month, amount]) => ({ month, amount })),
      repaymentRate: (repaidCount / allLoans.length) * 100,
      creditScoreDistribution: creditScores,
      riskMetrics: {
        defaultRate: (defaultedCount / allLoans.length) * 100,
        averageCreditScore: creditScores.reduce((a, b) => a + b, 0) / creditScores.length,
        riskScore: ((defaultedCount / allLoans.length) * 100 + 
          (100 - (creditScores.reduce((a, b) => a + b, 0) / creditScores.length))),
        highRiskLoans,
        mediumRiskLoans,
        lowRiskLoans
      },
      performanceMetrics: {
        onTimePayments,
        latePayments,
        averageRepaymentTime: totalRepaymentTime / repaymentCount,
        collectionEfficiency: (onTimePayments / (onTimePayments + latePayments)) * 100
      },
      regionalDistribution: Object.entries(regionalData).map(([region, count]) => ({ region, count })),
      loanPurposeDistribution: Object.entries(purposeData).map(([purpose, count]) => ({ purpose, count }))
    });
  };

  const downloadReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      analytics,
      summary: {
        totalLoans: analytics.totalLoans,
        totalAmount: analytics.totalAmount,
        activeLoans: analytics.activeLoans,
        repaymentRate: analytics.repaymentRate,
        riskScore: analytics.riskMetrics.riskScore,
        collectionEfficiency: analytics.performanceMetrics.collectionEfficiency
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin_analytics_${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor and analyze loan performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAnalytics}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={downloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="loans">Loans</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalLoans}</div>
                <p className="text-xs text-muted-foreground">
                  Total loan applications processed
                </p>
                <Progress value={(analytics.repaidLoans / analytics.totalLoans) * 100} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{analytics.totalAmount.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Total loan amount disbursed
                </p>
                <Progress value={(analytics.activeLoans / analytics.totalLoans) * 100} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.activeLoans}</div>
                <p className="text-xs text-muted-foreground">
                  Currently active loans
                </p>
                <Progress value={(analytics.activeLoans / analytics.totalLoans) * 100} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.riskMetrics.riskScore.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">
                  Overall portfolio risk
                </p>
                <Progress value={analytics.riskMetrics.riskScore} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="loans" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Loan Purpose Distribution</CardTitle>
                <CardDescription>Distribution of loans by purpose</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.loanPurposeDistribution.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{item.purpose}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.count}</span>
                        <Progress value={(item.count / analytics.totalLoans) * 100} className="w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Monthly Disbursements</CardTitle>
                <CardDescription>Loan amounts disbursed by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.monthlyDisbursements.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{item.month}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">₹{item.amount.toLocaleString()}</span>
                        <Progress value={(item.amount / analytics.totalAmount) * 100} className="w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Performance</CardTitle>
                <CardDescription>Payment behavior analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>On-time Payments</span>
                    <span className="font-medium">{analytics.performanceMetrics.onTimePayments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Late Payments</span>
                    <span className="font-medium">{analytics.performanceMetrics.latePayments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Collection Efficiency</span>
                    <span className="font-medium">{analytics.performanceMetrics.collectionEfficiency.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Repayment Time</span>
                    <span className="font-medium">{analytics.performanceMetrics.averageRepaymentTime.toFixed(1)} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Loan Status Distribution</CardTitle>
                <CardDescription>Current status of all loans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Active Loans</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{analytics.activeLoans}</span>
                      <Progress value={(analytics.activeLoans / analytics.totalLoans) * 100} className="w-24" />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Repaid Loans</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{analytics.repaidLoans}</span>
                      <Progress value={(analytics.repaidLoans / analytics.totalLoans) * 100} className="w-24" />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Defaulted Loans</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{analytics.defaultedLoans}</span>
                      <Progress value={(analytics.defaultedLoans / analytics.totalLoans) * 100} className="w-24" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Distribution of loans by risk level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>High Risk Loans</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{analytics.riskMetrics.highRiskLoans}</span>
                      <Progress value={(analytics.riskMetrics.highRiskLoans / analytics.totalLoans) * 100} className="w-24" />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Medium Risk Loans</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{analytics.riskMetrics.mediumRiskLoans}</span>
                      <Progress value={(analytics.riskMetrics.mediumRiskLoans / analytics.totalLoans) * 100} className="w-24" />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Low Risk Loans</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{analytics.riskMetrics.lowRiskLoans}</span>
                      <Progress value={(analytics.riskMetrics.lowRiskLoans / analytics.totalLoans) * 100} className="w-24" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics</CardTitle>
                <CardDescription>Key risk indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Default Rate</span>
                    <span className="font-medium">{analytics.riskMetrics.defaultRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Credit Score</span>
                    <span className="font-medium">{analytics.riskMetrics.averageCreditScore.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risk Score</span>
                    <span className="font-medium">{analytics.riskMetrics.riskScore.toFixed(1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regional" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
                <CardDescription>Loan distribution by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.regionalDistribution.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{item.region}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.count}</span>
                        <Progress value={(item.count / analytics.totalLoans) * 100} className="w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard; 