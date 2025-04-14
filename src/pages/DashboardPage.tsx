
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, CalendarDays, CreditCard, Users, ArrowUp, ArrowDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  // Content differs by role
  const renderFarmerDashboard = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h2>
          <p className="text-muted-foreground">
            Here's an overview of your loan applications and credit status.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Loan Amount</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹25,000</div>
              <p className="text-xs text-muted-foreground">
                +20% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                1 approved, 1 pending
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credit Score</CardTitle>
              <ArrowUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">720</div>
              <p className="text-xs text-green-600">
                Improved by 15 points
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15 May</div>
              <p className="text-xs text-muted-foreground">
                ₹2,000 due
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>
                Your recent loan applications and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium">Crop Season Loan</p>
                    <p className="text-sm text-muted-foreground">Applied on 1 May 2023</p>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Approved
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium">Equipment Purchase</p>
                    <p className="text-sm text-muted-foreground">Applied on 12 April 2023</p>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium">Irrigation System</p>
                    <p className="text-sm text-muted-foreground">Applied on 3 March 2023</p>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      Rejected
                    </span>
                  </div>
                </div>
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
              <div className="bg-gradient-to-r from-agriloan-primary to-agriloan-secondary text-white rounded-md p-4">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="font-medium">Kisan Credit Card</p>
                  </div>
                  <CreditCard className="h-6 w-6" />
                </div>
                <p className="text-sm mb-1">Card Number</p>
                <p className="font-mono mb-4">**** **** **** 4589</p>
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm">Card Holder</p>
                    <p>{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm">Valid Until</p>
                    <p>12/25</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Available Credit</span>
                  <span className="font-medium">₹37,500</span>
                </div>
                <div className="flex justify-between">
                  <span>Credit Limit</span>
                  <span className="font-medium">₹50,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-agriloan-primary h-2.5 rounded-full w-3/4"></div>
                </div>
                <p className="text-xs text-right text-muted-foreground">75% Available</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  const renderAdminDashboard = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor and manage all loan applications and users.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">256</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">138</div>
              <p className="text-xs text-muted-foreground">
                +5 new today
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
              <ArrowUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">72%</div>
              <p className="text-xs text-green-600">
                +4% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Processing</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2 days</div>
              <p className="text-xs text-green-600">
                -0.5 days from last month
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Loan Applications</CardTitle>
              <CardDescription>
                Latest loan applications requiring review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">Application #{10240 + i}</p>
                      <p className="text-sm text-muted-foreground">Submitted {i} day{i > 1 ? 's' : ''} ago</p>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        i === 1 ? "bg-yellow-100 text-yellow-800" : 
                        i === 2 ? "bg-green-100 text-green-800" : 
                        i === 3 ? "bg-blue-100 text-blue-800" : 
                        "bg-purple-100 text-purple-800"
                      }`}>
                        {i === 1 ? "New" : 
                         i === 2 ? "In Review" : 
                         i === 3 ? "Verified" : 
                         "Approved"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>
                Recent user registrations and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-agriloan-primary flex items-center justify-center text-white">
                      JD
                    </div>
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-xs text-muted-foreground">Farmer</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">Registered 2h ago</span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-agriloan-secondary flex items-center justify-center text-white">
                      MS
                    </div>
                    <div>
                      <p className="font-medium">Maria Singh</p>
                      <p className="text-xs text-muted-foreground">Verifier</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">Logged in 30m ago</span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-agriloan-accent flex items-center justify-center text-white">
                      RK
                    </div>
                    <div>
                      <p className="font-medium">Raj Kumar</p>
                      <p className="text-xs text-muted-foreground">Farmer</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">Applied 1h ago</span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-agriloan-primary flex items-center justify-center text-white">
                      AP
                    </div>
                    <div>
                      <p className="font-medium">Anika Patel</p>
                      <p className="text-xs text-muted-foreground">Farmer</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">Updated profile 4h ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  const renderVerifierDashboard = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Verifier Dashboard</h2>
          <p className="text-muted-foreground">
            Verify applications and manage lending partners.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                3 urgent (>48h)
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Today</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                6 approved, 2 rejected
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Time</CardTitle>
              <ArrowDown className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.8 hrs</div>
              <p className="text-xs text-green-600">
                -20 mins from yesterday
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                All regions covered
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Applications Needing Verification</CardTitle>
              <CardDescription>
                Review and verify these applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-agriloan-primary flex items-center justify-center text-white">
                          {String.fromCharCode(64 + i)}D
                        </div>
                        <div>
                          <p className="font-medium">Application #{10240 + i}</p>
                          <p className="text-sm text-muted-foreground">
                            {["Crop Loan", "Equipment Purchase", "Irrigation System", "Seed Purchase"][i-1]}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 mx-4">
                      <p className="text-sm font-medium">Status</p>
                      <p className="text-sm text-muted-foreground">Awaiting verification</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Amount</p>
                      <p className="text-sm text-muted-foreground">₹{[15000, 25000, 50000, 8000][i-1].toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button className="bg-agriloan-primary hover:bg-agriloan-secondary" size="sm">
                        Verify
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  // Render dashboard based on user role
  return (
    <div>
      {user?.role === "farmer" && renderFarmerDashboard()}
      {user?.role === "admin" && renderAdminDashboard()}
      {user?.role === "verifier" && renderVerifierDashboard()}
    </div>
  );
};

export default DashboardPage;
