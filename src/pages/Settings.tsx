import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { BadgeAlert, Bell, CloudLightning, FileText, Lock, Mail, User, UserCog, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Settings = () => {
  const { user, logout } = useAuth();
  
  return (
    <DashboardLayout title="Settings">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 h-auto">
          <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:shadow">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:shadow">
            <Lock className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:shadow">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2 data-[state=active]:shadow">
            <UserCog className="h-4 w-4" />
            <span>Preferences</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 md:items-center">
                <div className="flex-shrink-0">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="text-xl">{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullname">Full Name</Label>
                        <Input id="fullname" value={user?.name} placeholder="Your full name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" value={user?.email} placeholder="Your email address" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" value={user?.role} readOnly className="bg-gray-100" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="id">ID</Label>
                        <Input id="id" value={user?.id} readOnly className="bg-gray-100" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        placeholder="Tell us about yourself"
                        className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-scms-blue-600 hover:bg-scms-blue-700">Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Update your contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Your phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alternative-email">Alternative Email</Label>
                  <Input id="alternative-email" placeholder="Your alternative email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Your address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency-contact">Emergency Contact</Label>
                  <Input id="emergency-contact" placeholder="Emergency contact name & number" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-scms-blue-600 hover:bg-scms-blue-700">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to maintain security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" placeholder="Enter your current password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" placeholder="Enter your new password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" placeholder="Confirm your new password" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-gray-500">
                Last password change: <span className="font-medium">30 days ago</span>
              </div>
              <Button className="bg-scms-blue-600 hover:bg-scms-blue-700">Update Password</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage security settings for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Lock className="h-5 w-5 text-scms-blue-600" />
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Enhance your account security with 2FA</p>
                  </div>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Mail className="h-5 w-5 text-scms-blue-600" />
                  <div>
                    <p className="font-medium">Email Verification</p>
                    <p className="text-sm text-gray-500">Verify your email address</p>
                  </div>
                </div>
                <Badge className="bg-scms-green-100 text-scms-green-700 py-1 px-2 rounded">
                  Verified
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <FileText className="h-5 w-5 text-scms-blue-600" />
                  <div>
                    <p className="font-medium">Login History</p>
                    <p className="text-sm text-gray-500">View your recent login activity</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">View History</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-red-50 text-red-700">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>Danger Zone</span>
              </CardTitle>
              <CardDescription className="text-red-600">
                Destructive actions that cannot be undone
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  The following actions are permanent and cannot be reversed.
                </AlertDescription>
              </Alert>
              
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <h4 className="font-medium">Delete Account</h4>
                  <p className="text-sm text-gray-500">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications from the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-announcements" className="flex-1">
                      Announcements and Updates
                    </Label>
                    <Switch id="email-announcements" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-attendance" className="flex-1">
                      Attendance Reports
                    </Label>
                    <Switch id="email-attendance" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-performance" className="flex-1">
                      Performance Reports
                    </Label>
                    <Switch id="email-performance" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-resource" className="flex-1">
                      Resource Reservations
                    </Label>
                    <Switch id="email-resource" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">In-App Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app-announcements" className="flex-1">
                      Announcements and Updates
                    </Label>
                    <Switch id="app-announcements" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app-attendance" className="flex-1">
                      Attendance Alerts
                    </Label>
                    <Switch id="app-attendance" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app-performance" className="flex-1">
                      Performance Updates
                    </Label>
                    <Switch id="app-performance" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app-resource" className="flex-1">
                      Resource Notifications
                    </Label>
                    <Switch id="app-resource" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app-messages" className="flex-1">
                      Message Notifications
                    </Label>
                    <Switch id="app-messages" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">SMS Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-emergency" className="flex-1">
                      Emergency Alerts
                    </Label>
                    <Switch id="sms-emergency" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-attendance" className="flex-1">
                      Absence Notifications
                    </Label>
                    <Switch id="sms-attendance" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="bg-scms-blue-600 hover:bg-scms-blue-700">Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
              <CardDescription>
                Customize your application experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Interface Settings</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="utc-5">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                          <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                          <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                          <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                          <SelectItem value="utc">UTC</SelectItem>
                          <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col items-center p-2 border rounded-md bg-white cursor-pointer ring-2 ring-scms-blue-200">
                        <div className="w-full h-12 bg-white border rounded-md mb-2"></div>
                        <span className="text-sm">Light</span>
                      </div>
                      <div className="flex flex-col items-center p-2 border rounded-md cursor-pointer">
                        <div className="w-full h-12 bg-gray-900 border rounded-md mb-2"></div>
                        <span className="text-sm">Dark</span>
                      </div>
                      <div className="flex flex-col items-center p-2 border rounded-md cursor-pointer">
                        <div className="w-full h-12 bg-gradient-to-r from-white to-gray-900 border rounded-md mb-2"></div>
                        <span className="text-sm">System</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dashboard Layout</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="compact-view" className="flex-1">
                      Use Compact View
                    </Label>
                    <Switch id="compact-view" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-welcome" className="flex-1">
                      Show Welcome Message
                    </Label>
                    <Switch id="show-welcome" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="expanded-stats" className="flex-1">
                      Show Expanded Statistics
                    </Label>
                    <Switch id="expanded-stats" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Accessibility</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="larger-text" className="flex-1">
                      Larger Text
                    </Label>
                    <Switch id="larger-text" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="high-contrast" className="flex-1">
                      High Contrast
                    </Label>
                    <Switch id="high-contrast" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reduce-motion" className="flex-1">
                      Reduce Motion
                    </Label>
                    <Switch id="reduce-motion" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="bg-scms-blue-600 hover:bg-scms-blue-700">Save Preferences</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>
                Manage your data and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <CloudLightning className="h-5 w-5 text-scms-blue-600" />
                  <div>
                    <p className="font-medium">Data Analytics Sharing</p>
                    <p className="text-sm text-gray-500">Allow your anonymized data to be used for system improvements</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <BadgeAlert className="h-5 w-5 text-scms-blue-600" />
                  <div>
                    <p className="font-medium">Privacy Profile</p>
                    <p className="text-sm text-gray-500">Manage who can see your activity and information</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <FileText className="h-5 w-5 text-scms-blue-600" />
                  <div>
                    <p className="font-medium">Data Export</p>
                    <p className="text-sm text-gray-500">Download a copy of your personal data</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Export Data</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;
