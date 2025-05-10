
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProfileDetails from "@/components/profile/ProfileDetails";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCog, Bell, Shield } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="flex justify-center items-center h-[calc(100vh-4rem)]">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
        <p className="text-muted-foreground">
          Manage your account settings and view your personal information
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileDetails />
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Customize how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>SMS</TableHead>
                    <TableHead>In-App</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Loan Updates</TableCell>
                    <TableCell><Switch defaultChecked /></TableCell>
                    <TableCell><Switch defaultChecked /></TableCell>
                    <TableCell><Switch defaultChecked /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Payment Reminders</TableCell>
                    <TableCell><Switch defaultChecked /></TableCell>
                    <TableCell><Switch defaultChecked /></TableCell>
                    <TableCell><Switch defaultChecked /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Marketing</TableCell>
                    <TableCell><Switch /></TableCell>
                    <TableCell><Switch /></TableCell>
                    <TableCell><Switch defaultChecked /></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="flex justify-end">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your password and security options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Password</h3>
                  <p className="text-sm text-muted-foreground">Last changed: Never</p>
                </div>
                <Button variant="outline" className="w-full sm:w-auto">Change Password</Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline" className="w-full sm:w-auto">Enable 2FA</Button>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Active Sessions</h3>
                <Card className="border-dashed">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Current Browser</p>
                        <p className="text-xs text-muted-foreground">Last accessed: Now</p>
                      </div>
                      <Button variant="outline" size="sm">Logout</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <UserCog className="h-5 w-5 mr-2" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions for your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="destructive">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
