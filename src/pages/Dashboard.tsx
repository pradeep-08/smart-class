import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Calendar, Users, Book, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sample data for charts
const attendanceData = [
  { name: 'Mon', value: 92 },
  { name: 'Tue', value: 88 },
  { name: 'Wed', value: 95 },
  { name: 'Thu', value: 90 },
  { name: 'Fri', value: 85 },
];

const resourcesData = [
  { name: 'Laptops', value: 30 },
  { name: 'Projectors', value: 20 },
  { name: 'Tablets', value: 40 },
  { name: 'VR Headsets', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const performanceData = [
  { month: 'Jan', score: 65 },
  { month: 'Feb', score: 70 },
  { month: 'Mar', score: 68 },
  { month: 'Apr', score: 75 },
  { month: 'May', score: 80 },
  { month: 'Jun', score: 78 },
];

// Sample upcoming classes
const upcomingClasses = [
  { id: 1, subject: 'Mathematics', time: '09:00 AM', room: 'Room 101', teacher: 'Dr. Smith' },
  { id: 2, subject: 'Physics', time: '11:00 AM', room: 'Room 203', teacher: 'Prof. Johnson' },
  { id: 3, subject: 'Computer Science', time: '01:30 PM', room: 'Lab 3', teacher: 'Ms. Wilson' },
];

// Sample notifications
const notifications = [
  { id: 1, message: 'Assignment deadline extended for Physics', time: '1 hour ago', type: 'info' },
  { id: 2, message: 'New resources added for Mathematics', time: '3 hours ago', type: 'success' },
  { id: 3, message: 'Your attendance report is available', time: '5 hours ago', type: 'warning' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    attendance: { value: 92, change: 2, positive: true },
    resources: { value: 24, change: 5, positive: true },
    performance: { value: 78, change: 3, positive: true },
    classes: { value: 12, change: 1, positive: false }
  });

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid gap-6">
        {/* Welcome message */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Average Attendance" 
            value={`${stats.attendance.value}%`}
            change={`${stats.attendance.change}%`}
            positive={stats.attendance.positive}
            icon={Users}
            bgColor="bg-scms-blue-100"
            iconColor="text-scms-blue-500"
          />
          <StatCard 
            title="Resources Used" 
            value={stats.resources.value.toString()}
            change={`${stats.resources.change}`}
            positive={stats.resources.positive}
            icon={Book}
            bgColor="bg-scms-green-100"
            iconColor="text-scms-green-500"
          />
          <StatCard 
            title="Performance Score" 
            value={`${stats.performance.value}/100`}
            change={`${stats.performance.change}%`}
            positive={stats.performance.positive}
            icon={ArrowUpRight}
            bgColor="bg-scms-orange-100"
            iconColor="text-scms-orange-500"
          />
          <StatCard 
            title="Weekly Classes" 
            value={stats.classes.value.toString()}
            change={`${stats.classes.change}`}
            positive={stats.classes.positive}
            icon={Calendar}
            bgColor="bg-scms-red-100"
            iconColor="text-scms-red-500"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Attendance</CardTitle>
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
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#1E88E5" barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Resource Allocation</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={resourcesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {resourcesData.map((entry, index) => (
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

        {/* Upcoming Classes and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Upcoming Classes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingClasses.map((cls) => (
                  <div key={cls.id} className="flex items-center space-x-4 p-3 rounded-md bg-gray-50">
                    <div className="bg-scms-blue-100 p-3 rounded-md text-scms-blue-600">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{cls.subject}</h4>
                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 space-y-1 sm:space-y-0 sm:space-x-4">
                        <span>{cls.time}</span>
                        <span>{cls.room}</span>
                        <span>{cls.teacher}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex p-3 rounded-md bg-gray-50">
                    <div className={cn(
                      "w-1 rounded-full mr-3",
                      notification.type === 'info' ? 'bg-scms-blue-500' :
                      notification.type === 'success' ? 'bg-scms-green-500' :
                      notification.type === 'warning' ? 'bg-scms-orange-500' : 
                      'bg-scms-red-500'
                    )}/>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  positive, 
  icon: Icon,
  bgColor,
  iconColor
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className={cn("p-2 rounded-full", bgColor)}>
            <Icon className={cn("h-4 w-4", iconColor)} />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <h3 className="text-2xl font-bold">{value}</h3>
          <div className={cn(
            "flex items-center text-xs font-medium",
            positive ? "text-scms-green-700" : "text-scms-red-700"
          )}>
            {positive ? (
              <ArrowUpRight className="mr-1 h-3 w-3" />
            ) : (
              <ArrowDownRight className="mr-1 h-3 w-3" />
            )}
            <span>{change}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
