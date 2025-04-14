
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, MapPin, Phone, Mail, Home, Award } from "lucide-react";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
          <p className="text-muted-foreground">
            View and manage your personal information.
          </p>
        </div>
        <Button className="mt-2 md:mt-0">Edit Profile</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-2">
                <AvatarFallback className="bg-agriloan-primary text-white text-2xl">
                  {user?.name ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-center">{user?.name || "User"}</CardTitle>
              <CardDescription className="text-center capitalize">{user?.role || "Farmer"}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Bengaluru, Karnataka</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{user?.email || "user@example.com"}</span>
              </div>
              <div className="flex items-center">
                <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Kumar Organic Farms</span>
              </div>
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full">My Documents</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="loans">My Loans</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Farmer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Farm Size</p>
                      <p className="font-medium">5.5 Acres</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Farming Since</p>
                      <p className="font-medium">2010</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Primary Crops</p>
                      <p className="font-medium">Rice, Wheat, Vegetables</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Irrigation Type</p>
                      <p className="font-medium">Drip Irrigation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 mr-2 text-green-500" />
                      <div>
                        <p className="font-medium">Organic Farming Certificate</p>
                        <p className="text-sm text-muted-foreground">Issued Jan 2023 • Valid until Jan 2026</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-5 w-5 mr-2 text-green-500" />
                      <div>
                        <p className="font-medium">Sustainable Farming Practices</p>
                        <p className="text-sm text-muted-foreground">Issued Mar 2022 • Valid until Mar 2025</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="loans" className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Loans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Crop Loan</p>
                          <p className="text-sm text-muted-foreground">ID: LOAN-2025-0042</p>
                        </div>
                        <span className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-xs font-medium">Active</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Amount</p>
                          <p className="font-medium">₹50,000</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Due Date</p>
                          <p className="font-medium">Dec 15, 2025</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <p className="font-medium">In good standing</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <FileText className="h-4 w-4" /> View Details
                        </Button>
                        <Button size="sm" className="flex items-center gap-1">
                          Make Payment
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Loan History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b pb-3">
                      <div>
                        <p className="font-medium">Equipment Loan</p>
                        <p className="text-sm text-muted-foreground">Completed Apr 2024</p>
                      </div>
                      <span>₹35,000</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-3">
                      <div>
                        <p className="font-medium">Seasonal Loan</p>
                        <p className="text-sm text-muted-foreground">Completed Oct 2023</p>
                      </div>
                      <span>₹25,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
