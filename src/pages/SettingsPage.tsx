import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const SettingsPage: React.FC = () => {
  const { user, sendNotification } = useAuth();
  const [notificationSettings, setNotificationSettings] = useState({
    loanUpdates: true,
    paymentReminders: true,
    newFeatures: false,
    marketUpdates: true,
    emailNotifications: true
  });
  
  const handleSaveNotificationPreferences = () => {
    toast.success("Notification preferences saved", {
      description: "Your notification preferences have been updated successfully."
    });
    
    // Send profile updated notification if email notifications are enabled
    if (notificationSettings.emailNotifications) {
      sendNotification("profile_updated", {});
    }
  };
  
  const handleToggleEmailNotifications = (checked: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      emailNotifications: checked
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 md:grid-cols-3 h-auto">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue="Rajesh Kumar" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="rajesh@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+91 9876543210" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmName">Farm Name</Label>
                  <Input id="farmName" defaultValue="Kumar Organic Farms" />
                </div>
              </div>
              <Button className="mt-2">Save Changes</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
              <CardDescription>Update your address details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" defaultValue="123 Village Road" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" defaultValue="Bengaluru" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" defaultValue="Karnataka" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipcode">Postal Code</Label>
                  <Input id="zipcode" defaultValue="560001" />
                </div>
              </div>
              <Button className="mt-2">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                </div>
                <Switch 
                  checked={notificationSettings.emailNotifications} 
                  onCheckedChange={handleToggleEmailNotifications} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Loan Updates</p>
                  <p className="text-sm text-muted-foreground">Receive updates about your loan applications</p>
                </div>
                <Switch 
                  defaultChecked={notificationSettings.loanUpdates} 
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, loanUpdates: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Payment Reminders</p>
                  <p className="text-sm text-muted-foreground">Get notified before payments are due</p>
                </div>
                <Switch 
                  defaultChecked={notificationSettings.paymentReminders} 
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, paymentReminders: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Features</p>
                  <p className="text-sm text-muted-foreground">Learn about new products and features</p>
                </div>
                <Switch 
                  defaultChecked={notificationSettings.newFeatures} 
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, newFeatures: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Market Updates</p>
                  <p className="text-sm text-muted-foreground">Receive updates about market prices</p>
                </div>
                <Switch 
                  defaultChecked={notificationSettings.marketUpdates} 
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, marketUpdates: checked})}
                />
              </div>
              <Button className="mt-2" onClick={handleSaveNotificationPreferences}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Update your password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button className="mt-2">Update Password</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Secure your account with 2FA</p>
                </div>
                <Switch />
              </div>
              <Button variant="outline">Set Up 2FA</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
