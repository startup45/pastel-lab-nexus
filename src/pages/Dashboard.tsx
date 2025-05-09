
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, TestTube, FileText, Clock } from 'lucide-react';

const StatCard = ({ title, value, icon, color }: { 
  title: string; 
  value: string; 
  icon: React.ReactNode;
  color: string;
}) => (
  <Card className="shadow-sm">
    <CardContent className="p-6 flex justify-between items-center">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data
  const stats = [
    {
      title: 'Total Patients',
      value: '1,284',
      icon: <Users className="h-6 w-6 text-white" />,
      color: 'bg-lab-primary',
    },
    {
      title: 'Active Tests',
      value: '42',
      icon: <TestTube className="h-6 w-6 text-white" />,
      color: 'bg-lab-secondary',
    },
    {
      title: 'Reports Today',
      value: '18',
      icon: <FileText className="h-6 w-6 text-white" />,
      color: 'bg-lab-accent',
    },
    {
      title: 'Pending Results',
      value: '7',
      icon: <Clock className="h-6 w-6 text-white" />,
      color: 'bg-orange-400',
    },
  ];

  const recentPatients = [
    { id: 'P-2024-0127', name: 'James Wilson', age: 45, date: '2024-05-08', status: 'Completed' },
    { id: 'P-2024-0126', name: 'Sarah Miller', age: 32, date: '2024-05-08', status: 'Pending' },
    { id: 'P-2024-0125', name: 'Robert Johnson', age: 51, date: '2024-05-07', status: 'Processing' },
    { id: 'P-2024-0124', name: 'Maria Garcia', age: 28, date: '2024-05-07', status: 'Completed' },
    { id: 'P-2024-0123', name: 'David Brown', age: 39, date: '2024-05-06', status: 'Completed' },
  ];

  const criticalResults = [
    { patient: 'Emma Wilson', test: 'White Blood Cell Count', value: '16,500', normal: '4,500-11,000', unit: 'cells/mcL' },
    { patient: 'Michael Harris', test: 'Blood Glucose', value: '240', normal: '70-100', unit: 'mg/dL' },
    { patient: 'Jennifer Martinez', test: 'Hemoglobin', value: '8.2', normal: '12-16', unit: 'g/dL' }
  ];

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">Here's what's happening in your lab today.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>Latest patient registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Age</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPatients.map((patient) => (
                    <tr key={patient.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">{patient.id}</td>
                      <td className="px-4 py-2">{patient.name}</td>
                      <td className="px-4 py-2">{patient.age}</td>
                      <td className="px-4 py-2">{patient.date}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(patient.status)}`}>
                          {patient.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Critical Results</CardTitle>
            <CardDescription>Results requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            {criticalResults.map((result, i) => (
              <div key={i} className="mb-3 p-3 bg-lab-critical bg-opacity-20 rounded-md last:mb-0">
                <div className="flex justify-between text-sm font-medium">
                  <span>{result.patient}</span>
                  <span className="bg-lab-critical text-lab-text px-2 py-0.5 rounded-full text-xs">
                    Critical
                  </span>
                </div>
                <div className="mt-1 text-sm">{result.test}</div>
                <div className="flex justify-between mt-1 text-sm">
                  <span className="font-medium">{result.value} {result.unit}</span>
                  <span className="text-muted-foreground">(Normal: {result.normal})</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
