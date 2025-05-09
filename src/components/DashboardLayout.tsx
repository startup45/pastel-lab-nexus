
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
import { toast } from "sonner";

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
        'hover:bg-white/20',
        active ? 'bg-white/25 text-white font-medium' : 'text-sidebar-foreground/80'
      )}
    >
      <div className={cn(
        'flex items-center justify-center',
        active ? 'text-white' : 'text-sidebar-foreground/80'
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

  const handleLogout = () => {
    logout();
    toast.success("You've been successfully logged out");
  };

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
          'bg-sidebar flex flex-col transition-all duration-300 ease-in-out',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className={cn(
          'h-16 flex items-center border-b border-sidebar-border',
          collapsed ? 'justify-center px-2' : 'justify-between px-4'
        )}>
          {!collapsed && (
            <div className="text-lg font-bold text-white flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              <span>Lab Manager</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-white hover:bg-white/20"
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
          'border-t border-sidebar-border p-4',
          collapsed ? 'flex justify-center' : ''
        )}>
          {collapsed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-primary text-white">
                  {getUserInitials()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{user?.role}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                  <LogOut className="mr-2" size={16} />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-9 w-9 bg-primary text-white border-2 border-white/20">
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div className="ml-2">
                  <div className="text-sm font-medium text-white">{user?.name}</div>
                  <div className="text-xs text-sidebar-foreground/70 capitalize">{user?.role}</div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon-sm"
                onClick={handleLogout}
                className="text-red-300 hover:bg-red-500/20 hover:text-red-200"
                title="Logout"
              >
                <LogOut size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border bg-card flex items-center px-6 shadow-sm">
          <div className="text-lg font-semibold">
            {navItems.find(item => item.to === location.pathname)?.label || 'Dashboard'}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
