import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Bell,
    BookOpen,
    Calendar,
    ChevronRight,
    ClipboardList,
    Home,
    LogOut,
    Menu,
    MessageSquare,
    Settings,
    Users,
    X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from "../fulLogo.png"
interface NavItem {
    name: string;
    path: string;
    icon: React.ElementType;
    roles: string[];
}

const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, roles: ['student', 'teacher', 'admin'] },
    { name: 'Attendance', path: '/attendance', icon: ClipboardList, roles: ['student', 'teacher', 'admin'] },
    { name: 'Resources', path: '/resources', icon: BookOpen, roles: ['student', 'teacher', 'admin'] },
    { name: 'Calendar', path: '/calendar', icon: Calendar, roles: ['student', 'teacher', 'admin'] },
    { name: 'Messaging', path: '/messaging', icon: MessageSquare, roles: ['student', 'teacher', 'admin'] },
    { name: 'Users', path: '/users', icon: Users, roles: ['admin'] },
    { name: 'Reports', path: '/reports', icon: ChevronRight, roles: ['teacher', 'admin'] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['student', 'teacher', 'admin'] },
];

interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title = 'Dashboard' }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
            >
                <div className="flex items-center justify-between h-16 px-4 border-b">
                    <Link to="/dashboard" className="flex items-center">
                        <div className="w-10 h-10 rounded-md bg-scms-blue-600 flex items-center justify-center text-white font-bold">
                            SCN
                        </div>
                        <h1 className="ml-3 text-lg font-bold text-gray-900">Smart Class Nexus</h1>
                    </Link>
                    <button
                        className="p-1 rounded-md lg:hidden hover:bg-gray-100"
                        onClick={toggleSidebar}
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="px-4 py-4">
                    <div className="flex items-center mb-6">
                        <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={user?.avatar} alt={user?.name} />
                            <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">{user?.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                        </div>
                    </div>
                    <nav className="space-y-1">
                        {navItems
                            .filter((item) => item.roles.includes(user?.role || ''))
                            .map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={cn(
                                        'flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors',
                                        location.pathname === item.path
                                            ? 'text-scms-blue-800 bg-scms-blue-100'
                                            : 'text-gray-600 hover:text-scms-blue-600 hover:bg-gray-100'
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            'mr-3 h-5 w-5',
                                            location.pathname === item.path
                                                ? 'text-scms-blue-600'
                                                : 'text-gray-400'
                                        )}
                                    />
                                    {item.name}
                                </Link>
                            ))}
                    </nav>
                </div>
                {/* Powered By Section */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-col items-center justify-center px-4">
                    <span className="text-xs text-gray-400 mb-1 font-semibold">Powered by</span>
                    <img
                        src={Logo}
                        alt="Powered By Logo"
                        className="h-12 object-contain"
                    />
                </div>

            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:pl-64">
                {/* Top navigation */}
                <header className="bg-white shadow-sm">
                    <div className="flex items-center justify-between h-16 px-4">
                        <div className="flex items-center">
                            <button
                                className="p-1 rounded-md lg:hidden hover:bg-gray-100"
                                onClick={toggleSidebar}
                            >
                                <Menu size={24} />
                            </button>
                            <h1 className="ml-4 text-xl font-semibold text-gray-900">{title}</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button variant="outline" size="icon">
                                <Bell size={18} />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                        <Avatar>
                                            <AvatarImage src={user?.avatar} alt={user?.name} />
                                            <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link to="/profile">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to="/settings">Settings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        <span>Logout</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
