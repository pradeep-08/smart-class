import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Plus, BookOpen, Monitor, Projector, Laptop, Tablet, Calendar, CheckCircle2, AlertCircle, Clock, Filter, Download } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type ResourceStatus = 'available' | 'in-use' | 'maintenance' | 'reserved';

interface Resource {
  id: string;
  name: string;
  type: string;
  location: string;
  status: ResourceStatus;
  lastUsed?: string;
  maintenance?: string;
}

interface Reservation {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceType: string;
  reservedBy: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
}

const getStatusColor = (status: ResourceStatus) => {
  switch (status) {
    case 'available':
      return 'bg-scms-green-100 text-scms-green-700';
    case 'in-use':
      return 'bg-scms-blue-100 text-scms-blue-700';
    case 'maintenance':
      return 'bg-scms-red-100 text-scms-red-700';
    case 'reserved':
      return 'bg-scms-orange-100 text-scms-orange-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getReservationStatusColor = (status: Reservation['status']) => {
  switch (status) {
    case 'upcoming':
      return 'bg-scms-blue-100 text-scms-blue-700';
    case 'active':
      return 'bg-scms-green-100 text-scms-green-700';
    case 'completed':
      return 'bg-gray-100 text-gray-700';
    case 'cancelled':
      return 'bg-scms-red-100 text-scms-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// Mock resources data
const resources: Resource[] = [
  { id: 'RES001', name: 'Projector P1000', type: 'Projector', location: 'Room 101', status: 'available', lastUsed: '2025-04-10' },
  { id: 'RES002', name: 'Smart Board SB-400', type: 'Smart Board', location: 'Room 203', status: 'in-use', lastUsed: '2025-04-15' },
  { id: 'RES003', name: 'iPad Pro 12.9"', type: 'Tablet', location: 'Lab 3', status: 'maintenance', maintenance: '2025-04-20' },
  { id: 'RES004', name: 'Lenovo ThinkPad', type: 'Laptop', location: 'Library', status: 'available', lastUsed: '2025-04-08' },
  { id: 'RES005', name: 'HP Desktop', type: 'Computer', location: 'Computer Lab', status: 'available', lastUsed: '2025-04-12' },
  { id: 'RES006', name: 'EPSON Projector', type: 'Projector', location: 'Room 105', status: 'reserved', lastUsed: '2025-04-14' },
  { id: 'RES007', name: 'Samsung Galaxy Tab', type: 'Tablet', location: 'Media Room', status: 'available', lastUsed: '2025-04-09' },
  { id: 'RES008', name: 'Wacom Drawing Tablet', type: 'Tablet', location: 'Art Studio', status: 'in-use', lastUsed: '2025-04-15' },
];

// Mock reservations data
const reservations: Reservation[] = [
  { 
    id: 'RSV001', 
    resourceId: 'RES001', 
    resourceName: 'Projector P1000', 
    resourceType: 'Projector',
    reservedBy: 'Jane Smith',
    startTime: '2025-04-16T09:00:00',
    endTime: '2025-04-16T11:00:00',
    purpose: 'Physics Presentation',
    status: 'upcoming'
  },
  { 
    id: 'RSV002', 
    resourceId: 'RES006', 
    resourceName: 'EPSON Projector', 
    resourceType: 'Projector',
    reservedBy: 'Robert Johnson',
    startTime: '2025-04-15T13:00:00',
    endTime: '2025-04-15T15:00:00',
    purpose: 'Team Meeting',
    status: 'active'
  },
  { 
    id: 'RSV003', 
    resourceId: 'RES004', 
    resourceName: 'Lenovo ThinkPad', 
    resourceType: 'Laptop',
    reservedBy: 'Michael Brown',
    startTime: '2025-04-14T10:00:00',
    endTime: '2025-04-14T12:00:00',
    purpose: 'Software Testing',
    status: 'completed'
  },
  { 
    id: 'RSV004', 
    resourceId: 'RES007', 
    resourceName: 'Samsung Galaxy Tab', 
    resourceType: 'Tablet',
    reservedBy: 'Emily Williams',
    startTime: '2025-04-17T14:00:00',
    endTime: '2025-04-17T16:00:00',
    purpose: 'Art Project',
    status: 'upcoming'
  },
];

const ResourcesTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const filteredResources = resources.filter(resource => 
    (searchTerm === '' || 
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedType === null || resource.type === selectedType)
  );
  
  const resourceTypes = Array.from(new Set(resources.map(r => r.type)));

  const columns: ColumnDef<Resource>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('type') as string;
        const icon = 
          type === 'Projector' ? <Projector className="h-4 w-4 mr-1" /> :
          type === 'Smart Board' ? <Monitor className="h-4 w-4 mr-1" /> :
          type === 'Tablet' ? <Tablet className="h-4 w-4 mr-1" /> :
          type === 'Laptop' ? <Laptop className="h-4 w-4 mr-1" /> :
          <BookOpen className="h-4 w-4 mr-1" />;
        
        return (
          <div className="flex items-center">
            {icon}
            <span>{type}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'location',
      header: 'Location',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as ResourceStatus;
        const icon = 
          status === 'available' ? <CheckCircle2 className="h-4 w-4 mr-1" /> :
          status === 'in-use' ? <Clock className="h-4 w-4 mr-1" /> :
          status === 'maintenance' ? <AlertCircle className="h-4 w-4 mr-1" /> :
          <Calendar className="h-4 w-4 mr-1" />;
        
        return (
          <div className={cn("px-2 py-1 rounded text-xs font-medium flex items-center w-fit", getStatusColor(status))}>
            {icon}
            <span className="capitalize">{status.replace('-', ' ')}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const resource = row.original;
        return (
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">Reserve</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reserve {resource.name}</DialogTitle>
                  <DialogDescription>
                    Fill in the details to reserve this resource.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="date" className="text-right">Date</label>
                    <Input id="date" className="col-span-3" type="date" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="startTime" className="text-right">Start Time</label>
                    <Input id="startTime" className="col-span-3" type="time" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="endTime" className="text-right">End Time</label>
                    <Input id="endTime" className="col-span-3" type="time" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="purpose" className="text-right">Purpose</label>
                    <Input id="purpose" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" className="bg-scms-blue-600 hover:bg-scms-blue-700">Submit Reservation</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm">Details</Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className={selectedType === null ? 'bg-scms-blue-100' : ''}
            onClick={() => setSelectedType(null)}
          >
            All
          </Button>
          {resourceTypes.map(type => (
            <Button 
              key={type} 
              variant="outline"
              className={selectedType === type ? 'bg-scms-blue-100' : ''}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </Button>
          ))}
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search resources..."
              className="pl-8 w-full md:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <DataTable 
        columns={columns} 
        data={filteredResources} 
      />
    </div>
  );
};

const ReservationsTable = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter reservations by user if student/teacher
  const userReservations = user?.role === 'admin' 
    ? reservations
    : reservations.filter(r => r.reservedBy === user?.name);
  
  const filteredReservations = userReservations.filter(reservation => 
    searchTerm === '' || 
    reservation.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: ColumnDef<Reservation>[] = [
    {
      accessorKey: 'resourceName',
      header: 'Resource',
    },
    {
      accessorKey: 'resourceType',
      header: 'Type',
    },
    {
      accessorKey: 'startTime',
      header: 'Start Time',
      cell: ({ row }) => {
        const value = row.getValue('startTime') as string;
        return format(new Date(value), 'MMM dd, yyyy h:mm a');
      },
    },
    {
      accessorKey: 'endTime',
      header: 'End Time',
      cell: ({ row }) => {
        const value = row.getValue('endTime') as string;
        return format(new Date(value), 'MMM dd, yyyy h:mm a');
      },
    },
    {
      accessorKey: 'purpose',
      header: 'Purpose',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as Reservation['status'];
        return (
          <div className={cn("px-2 py-1 rounded text-xs font-medium w-fit", getReservationStatusColor(status))}>
            <span className="capitalize">{status}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const reservation = row.original;
        const canCancel = reservation.status === 'upcoming';
        
        return (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Details</Button>
            {canCancel && (
              <Button variant="outline" size="sm" className="text-scms-red-500 border-scms-red-500 hover:bg-scms-red-100">
                Cancel
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 md:flex-initial">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search reservations..."
            className="pl-8 w-full md:w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
      
      <DataTable 
        columns={columns} 
        data={filteredReservations} 
      />
    </div>
  );
};

const ResourceCards = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const filteredResources = resources.filter(resource => 
    (searchTerm === '' || 
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedType === null || resource.type === selectedType)
  );
  
  const resourceTypes = Array.from(new Set(resources.map(r => r.type)));

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className={selectedType === null ? 'bg-scms-blue-100' : ''}
            onClick={() => setSelectedType(null)}
          >
            All
          </Button>
          {resourceTypes.map(type => (
            <Button 
              key={type} 
              variant="outline"
              className={selectedType === type ? 'bg-scms-blue-100' : ''}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </Button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search resources..."
            className="pl-8 w-full md:w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map(resource => (
          <Card key={resource.id} className="overflow-hidden">
            <div className={cn(
              "h-2",
              resource.status === 'available' ? 'bg-scms-green-500' :
              resource.status === 'in-use' ? 'bg-scms-blue-500' :
              resource.status === 'maintenance' ? 'bg-scms-red-500' :
              'bg-scms-orange-500'
            )} />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{resource.name}</CardTitle>
                  <CardDescription>{resource.id}</CardDescription>
                </div>
                <Badge variant="outline" className={cn(
                  "capitalize",
                  resource.status === 'available' ? 'border-scms-green-500 text-scms-green-700' :
                  resource.status === 'in-use' ? 'border-scms-blue-500 text-scms-blue-700' :
                  resource.status === 'maintenance' ? 'border-scms-red-500 text-scms-red-700' :
                  'border-scms-orange-500 text-scms-orange-700'
                )}>
                  {resource.status.replace('-', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Type:</span>
                  <span>{resource.type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Location:</span>
                  <span>{resource.location}</span>
                </div>
                {resource.lastUsed && (
                  <div className="flex items-center space-x-2 col-span-2">
                    <span className="font-medium">Last Used:</span>
                    <span>{format(new Date(resource.lastUsed), 'MMM dd, yyyy')}</span>
                  </div>
                )}
                {resource.maintenance && (
                  <div className="flex items-center space-x-2 col-span-2">
                    <span className="font-medium">Maintenance Until:</span>
                    <span>{format(new Date(resource.maintenance), 'MMM dd, yyyy')}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="flex space-x-2 w-full">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex-1" disabled={resource.status !== 'available'}>Reserve</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reserve {resource.name}</DialogTitle>
                      <DialogDescription>
                        Fill in the details to reserve this resource.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="date" className="text-right">Date</label>
                        <Input id="date" className="col-span-3" type="date" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="startTime" className="text-right">Start Time</label>
                        <Input id="startTime" className="col-span-3" type="time" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="endTime" className="text-right">End Time</label>
                        <Input id="endTime" className="col-span-3" type="time" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="purpose" className="text-right">Purpose</label>
                        <Input id="purpose" className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit" className="bg-scms-blue-600 hover:bg-scms-blue-700">Submit Reservation</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" className="flex-1">Details</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const Resources = () => {
  const { user } = useAuth();
  
  return (
    <DashboardLayout title="Resources">
      <Tabs defaultValue="cards" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="cards">Card View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="reservations">My Reservations</TabsTrigger>
          </TabsList>
          {user?.role === 'admin' && (
            <Button className="bg-scms-blue-600 hover:bg-scms-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Resource
            </Button>
          )}
        </div>
        
        <TabsContent value="cards">
          <ResourceCards />
        </TabsContent>
        
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Available Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResourcesTable />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reservations">
          <Card>
            <CardHeader>
              <CardTitle>My Reservations</CardTitle>
            </CardHeader>
            <CardContent>
              <ReservationsTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Resources;
