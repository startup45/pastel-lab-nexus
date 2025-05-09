
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { 
  Users, FileText, TestTube, Search, 
  Database, Settings, LogOut, Menu, X, Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
  allowedRoles?: UserRole[];
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active, collapsed, allowedRoles = ['admin', 'labTechnician', 'receptionist'] }) => {
  const { checkPermission } = useAuth();
  
  if (!checkPermission(allowedRoles)) return null;
  
  return (
    <Link 
      to={to}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-md transition-all',
        'hover:bg-lab-primary hover:bg-opacity-20',
        active ? 'bg-lab-primary text-white' : 'text-lab-text'
      )}
    >
      <div className={cn(
        'flex items-center justify-center',
        active ? 'text-white' : 'text-lab-text'
      )}>
        {icon}
      </div>
      {!collapsed && <span className="font-medium">{label}</span>}
    </Link>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    {
      to: '/dashboard',
      icon: <Home size={20} />,
      label: 'Dashboard',
      allowedRoles: ['admin', 'labTechnician', 'receptionist'] as UserRole[]
    },
    {
      to: '/patients',
      icon: <Users size={20} />,
      label: 'Patients',
      allowedRoles: ['admin', 'labTechnician', 'receptionist'] as UserRole[]
    },
    {
      to: '/tests',
      icon: <TestTube size={20} />,
      label: 'Tests',
      allowedRoles: ['admin', 'labTechnician'] as UserRole[]
    },
    {
      to: '/reports',
      icon: <FileText size={20} />,
      label: 'Reports',
      allowedRoles: ['admin', 'labTechnician', 'receptionist'] as UserRole[]
    },
    {
      to: '/search',
      icon: <Search size={20} />,
      label: 'Global Search',
      allowedRoles: ['admin', 'labTechnician'] as UserRole[]
    },
    {
      to: '/backup',
      icon: <Database size={20} />,
      label: 'Data Backup',
      allowedRoles: ['admin'] as UserRole[]
    },
    {
      to: '/settings',
      icon: <Settings size={20} />,
      label: 'Settings',
      allowedRoles: ['admin'] as UserRole[]
    },
  ];

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div 
        className={cn(
          'bg-lab-card border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className={cn(
          'h-16 flex items-center justify-between px-4 border-b border-gray-200',
          collapsed ? 'justify-center' : 'justify-between'
        )}>
          {!collapsed && (
            <div className="text-lg font-bold text-lab-primary">Lab Manager</div>
          )}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-lab-text"
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto py-4 space-y-2 px-2">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.to}
              collapsed={collapsed}
              allowedRoles={item.allowedRoles}
            />
          ))}
        </div>
        <div className={cn(
          'border-t border-gray-200 p-4',
          collapsed ? 'flex justify-center' : ''
        )}>
          {collapsed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-lab-primary text-white">
                  {getUserInitials()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-xs text-muted-foreground">{user?.role}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-500 cursor-pointer">
                  <LogOut className="mr-2" size={16} />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 bg-lab-primary text-white">
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div className="ml-2">
                  <div className="text-sm font-medium text-lab-text">{user?.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{user?.role}</div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={logout}
                className="text-red-500 hover:bg-red-50"
              >
                <LogOut size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center px-6">
          <div className="text-lg font-semibold text-lab-text">
            {navItems.find(item => item.to === location.pathname)?.label || 'Dashboard'}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-lab-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
