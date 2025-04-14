
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, BarChart, ArrowUp, CalendarDays, FileText, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import StatCard from "./StatCard";
import ApplicationItem from "./ApplicationItem";
import CreditCardDisplay from "./CreditCardDisplay";

interface FarmerDashboardProps {
  userName: string;
}

const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ userName }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {userName}!</h2>
        <p className="text-muted-foreground">
          Here's an overview of your loan applications and credit status.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Loan Amount"
          value="₹25,000"
          description="+20% from last month"
          icon={CreditCard}
        />
        
        <StatCard
          title="Active Applications"
          value="2"
          description="1 approved, 1 pending"
          icon={BarChart}
        />
        
        <StatCard
          title="Credit Score"
          value="720"
          description="Improved by 15 points"
          icon={ArrowUp}
          descriptionColor="text-green-600"
        />
        
        <StatCard
          title="Next Payment"
          value="15 May"
          description="₹2,000 due"
          icon={CalendarDays}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>
                Your recent loan applications and their status
              </CardDescription>
            </div>
            <Button variant="outline" asChild className="ml-auto">
              <Link to="/loan-applications/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Application
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ApplicationItem
                id={1}
                title="Crop Season Loan"
                date="Applied on 1 May 2023"
                status="Approved"
                statusColor="bg-green-100 text-green-800"
              />
              
              <ApplicationItem
                id={2}
                title="Equipment Purchase"
                date="Applied on 12 April 2023" 
                status="Pending"
                statusColor="bg-yellow-100 text-yellow-800"
              />
              
              <ApplicationItem
                id={3}
                title="Irrigation System"
                date="Applied on 3 March 2023"
                status="Rejected"
                statusColor="bg-red-100 text-red-800"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Credit Card Status</CardTitle>
            <CardDescription>
              Your Kisan Credit Card details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreditCardDisplay
              name={userName}
              cardNumber="**** **** **** 4589"
              validUntil="12/25"
              availableCredit="₹37,500"
              creditLimit="₹50,000"
              percentAvailable={75}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Apply for Loans
          </CardTitle>
          <CardDescription>
            Need financial assistance? Apply for various agricultural loans tailored for you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Button className="flex-1" asChild>
              <Link to="/loan-applications/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Loan Application
              </Link>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link to="/loan-applications">
                View All Applications
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerDashboard;
