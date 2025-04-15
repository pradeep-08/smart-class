import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, ChartBar, BarChart as BarChartIcon, Users, Download, FileText, PieChart as PieChartIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Sample data for the charts
const attendanceData = [
  { name: 'Math', present: 92, absent: 8 },
  { name: 'Physics', present: 88, absent: 12 },
  { name: 'Chemistry', present: 85, absent: 15 },
  { name: 'Biology', present: 90, absent: 10 },
  { name: 'Computer Science', present: 95, absent: 5 },
];

const resourceUtilizationData = [
  { name: 'Projectors', usage: 85 },
  { name: 'Smart Boards', usage: 70 },
  { name: 'Tablets', usage: 60 },
  { name: 'Laptops', usage: 90 },
  { name: 'Desktops', usage: 65 },
];

const monthlyPerformanceData = [
  { name: 'Jan', score: 75 },
  { name: 'Feb', score: 68 },
  { name: 'Mar', score: 72 },
  { name: 'Apr', score: 80 },
  { name: 'May', score: 82 },
  { name: 'Jun', score: 77 },
  { name: 'Jul', score: 85 },
  { name: 'Aug', score: 75 },
  { name: 'Sep', score: 78 },
  { name: 'Oct', score: 82 },
  { name: 'Nov', score: 88 },
  { name: 'Dec', score: 85 },
];

const engagementData = [
  { name: 'Active Participation', value: 55 },
  { name: 'Passive Participation', value: 30 },
  { name: 'Disengaged', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Reports = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher';
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <DashboardLayout title="Reports & Analytics">
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            {(isTeacher || isAdmin) && <TabsTrigger value="performance">Performance</TabsTrigger>}
            {(isTeacher || isAdmin) && <TabsTrigger value="custom">Custom Reports</TabsTrigger>}
          </TabsList>
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Calendar className="h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChartIcon className="h-5 w-5" />
                  <span>Attendance Overview</span>
                </CardTitle>
                <CardDescription>
                  Attendance rates across different subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={attendanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="present" stackId="a" fill="#0D47A1" />
                      <Bar dataKey="absent" stackId="a" fill="#F44336" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartBar className="h-5 w-5" />
                  <span>Resource Utilization</span>
                </CardTitle>
                <CardDescription>
                  Usage rates for different classroom resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={resourceUtilizationData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="usage" fill="#4CAF50" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChartIcon className="h-5 w-5" />
                  <span>Performance Trends</span>
                </CardTitle>
                <CardDescription>
                  Monthly performance scores throughout the year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyPerformanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#1E88E5"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  <span>Student Engagement</span>
                </CardTitle>
                <CardDescription>
                  Distribution of student engagement levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={engagementData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {engagementData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="attendance">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Attendance Overview</CardTitle>
                <CardDescription>
                  Detailed attendance data for all classes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={attendanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="present" name="Present %" fill="#0D47A1" />
                      <Bar dataKey="absent" name="Absent %" fill="#F44336" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Average Attendance Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <div className="text-5xl font-bold text-scms-blue-600">90%</div>
                  </div>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Across all classes
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Top Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-xl font-semibold">Computer Science</div>
                    <div className="text-4xl font-bold text-scms-green-500">95%</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Lowest Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-xl font-semibold">Chemistry</div>
                    <div className="text-4xl font-bold text-scms-red-500">85%</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="resources">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
                <CardDescription>
                  Usage rates for different classroom resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={resourceUtilizationData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="usage" name="Usage %" fill="#4CAF50" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Most Utilized Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Laptops</div>
                      <div className="flex items-center">
                        <span className="font-bold mr-2">90%</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2.5">
                          <div className="bg-scms-blue-600 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Projectors</div>
                      <div className="flex items-center">
                        <span className="font-bold mr-2">85%</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2.5">
                          <div className="bg-scms-blue-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Smart Boards</div>
                      <div className="flex items-center">
                        <span className="font-bold mr-2">70%</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2.5">
                          <div className="bg-scms-blue-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Resource Maintenance Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <div className="h-60 w-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Operational', value: 85 },
                              { name: 'Under Maintenance', value: 10 },
                              { name: 'Need Repair', value: 5 },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill="#4CAF50" />
                            <Cell fill="#FFC107" />
                            <Cell fill="#F44336" />
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {(isTeacher || isAdmin) && (
          <TabsContent value="performance">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>
                    Monthly performance scores throughout the year
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyPerformanceData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="score"
                          name="Average Score"
                          stroke="#1E88E5"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Average Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center">
                      <div className="text-5xl font-bold text-scms-blue-600">78%</div>
                    </div>
                    <p className="text-sm text-gray-500 text-center mt-2">
                      Across all subjects
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Highest Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-xl font-semibold">November</div>
                      <div className="text-4xl font-bold text-scms-green-500">88%</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Lowest Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-xl font-semibold">February</div>
                      <div className="text-4xl font-bold text-scms-orange-500">68%</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        )}
        
        {(isTeacher || isAdmin) && (
          <TabsContent value="custom">
            <Card>
              <CardHeader>
                <CardTitle>Custom Reports</CardTitle>
                <CardDescription>
                  Generate detailed reports based on your requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Users className="h-5 w-5 mr-2" />
                        <span>Student Progress Report</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Generate detailed reports on individual student progress
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <BarChartIcon className="h-5 w-5 mr-2" />
                        <span>Class Performance Analysis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Analyze class performance across different subjects
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Calendar className="h-5 w-5 mr-2" />
                        <span>Attendance Summary</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Summarize attendance data for specific time periods
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </DashboardLayout>
  );
};

export default Reports;
