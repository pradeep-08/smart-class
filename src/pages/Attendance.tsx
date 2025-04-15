
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Check, X, Clock, Filter, Download, Search } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

type Status = 'present' | 'absent' | 'late' | 'excused';

interface AttendanceRecord {
  id: string;
  studentId: string;
  name: string;
  date: string;
  class: string;
  timeIn: string;
  status: Status;
  note?: string;
}

const getStatusColor = (status: Status) => {
  switch (status) {
    case 'present':
      return 'bg-scms-green-100 text-scms-green-700';
    case 'absent':
      return 'bg-scms-red-100 text-scms-red-700';
    case 'late':
      return 'bg-scms-orange-100 text-scms-orange-700';
    case 'excused':
      return 'bg-scms-blue-100 text-scms-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// This would come from an API in a real application
const generateMockAttendance = (): AttendanceRecord[] => {
  const classes = ['Mathematics', 'Physics', 'Biology', 'Computer Science', 'History'];
  const statuses: Status[] = ['present', 'absent', 'late', 'excused'];
  const students = [
    { id: 'ST001', name: 'John Doe' },
    { id: 'ST002', name: 'Jane Smith' },
    { id: 'ST003', name: 'Robert Johnson' },
    { id: 'ST004', name: 'Emily Williams' },
    { id: 'ST005', name: 'Michael Brown' },
    { id: 'ST006', name: 'Sarah Davis' },
    { id: 'ST007', name: 'David Miller' },
    { id: 'ST008', name: 'Jennifer Wilson' },
  ];

  const records: AttendanceRecord[] = [];

  // Generate records for the last 5 days
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = format(date, 'yyyy-MM-dd');

    classes.forEach(className => {
      students.forEach(student => {
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const timeIn = randomStatus === 'absent' ? '' : 
                      randomStatus === 'late' ? `${Math.floor(Math.random() * 3) + 9}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} AM` :
                      `8:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} AM`;
        
        records.push({
          id: `${dateStr}-${className}-${student.id}`,
          studentId: student.id,
          name: student.name,
          date: dateStr,
          class: className,
          timeIn,
          status: randomStatus,
          note: randomStatus === 'excused' ? 'Medical appointment' : undefined,
        });
      });
    });
  }

  return records;
};

const attendanceRecords = generateMockAttendance();

const MyAttendanceTable = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { user } = useAuth();

  // Filter records for current student
  const studentRecords = attendanceRecords.filter(
    record => user?.role === 'student' && record.name === user.name
  );

  const columns: ColumnDef<AttendanceRecord>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        const value = row.getValue('date') as string;
        return format(new Date(value), 'MMM dd, yyyy');
      },
    },
    {
      accessorKey: 'class',
      header: 'Class',
    },
    {
      accessorKey: 'timeIn',
      header: 'Time In',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as Status;
        return (
          <div className={cn("px-2 py-1 rounded text-xs font-medium flex items-center w-fit", getStatusColor(status))}>
            {status === 'present' && <Check className="mr-1 h-3 w-3" />}
            {status === 'absent' && <X className="mr-1 h-3 w-3" />}
            {status === 'late' && <Clock className="mr-1 h-3 w-3" />}
            {status === 'excused' && <CalendarIcon className="mr-1 h-3 w-3" />}
            <span className="capitalize">{status}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'note',
      header: 'Note',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
      
      <DataTable 
        columns={columns} 
        data={studentRecords} 
      />
    </div>
  );
};

const ClassAttendanceTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('Mathematics');
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Filter by date and class
  const dateStr = date ? format(date, 'yyyy-MM-dd') : '';
  const filteredRecords = attendanceRecords.filter(
    record => record.date === dateStr && record.class === selectedClass &&
    record.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const classOptions = [...new Set(attendanceRecords.map(record => record.class))];

  const columns: ColumnDef<AttendanceRecord>[] = [
    {
      accessorKey: 'studentId',
      header: 'Student ID',
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'timeIn',
      header: 'Time In',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as Status;
        return (
          <div className={cn("px-2 py-1 rounded text-xs font-medium flex items-center w-fit", getStatusColor(status))}>
            {status === 'present' && <Check className="mr-1 h-3 w-3" />}
            {status === 'absent' && <X className="mr-1 h-3 w-3" />}
            {status === 'late' && <Clock className="mr-1 h-3 w-3" />}
            {status === 'excused' && <CalendarIcon className="mr-1 h-3 w-3" />}
            <span className="capitalize">{status}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'note',
      header: 'Note',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <div className="flex flex-wrap gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <select 
            className="h-10 w-[200px] rounded-md border border-input bg-background px-3 py-2"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search students..."
              className="pl-8 w-full md:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <DataTable 
        columns={columns} 
        data={filteredRecords} 
      />
    </div>
  );
};

const Attendance = () => {
  const { user } = useAuth();
  
  const isStudent = user?.role === 'student';
  const defaultTab = isStudent ? 'my-attendance' : 'class-attendance';

  return (
    <DashboardLayout title="Attendance">
      <Tabs defaultValue={defaultTab} className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            {isStudent && <TabsTrigger value="my-attendance">My Attendance</TabsTrigger>}
            {!isStudent && <TabsTrigger value="class-attendance">Class Attendance</TabsTrigger>}
            {!isStudent && <TabsTrigger value="attendance-insights">Insights</TabsTrigger>}
          </TabsList>
          {!isStudent && (
            <Button className="bg-scms-blue-600 hover:bg-scms-blue-700">
              <Check className="mr-2 h-4 w-4" />
              Mark Attendance
            </Button>
          )}
        </div>
        
        {isStudent && (
          <TabsContent value="my-attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Attendance Record</CardTitle>
              </CardHeader>
              <CardContent>
                <MyAttendanceTable />
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {!isStudent && (
          <TabsContent value="class-attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Class Attendance Record</CardTitle>
              </CardHeader>
              <CardContent>
                <ClassAttendanceTable />
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {!isStudent && (
          <TabsContent value="attendance-insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Attendance analytics and insights will be shown here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </DashboardLayout>
  );
};

export default Attendance;
