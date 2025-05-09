
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download, FileText, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const reportsData = [
  { id: 'R-2024-127', patientId: 'P-2024-0127', patientName: 'James Wilson', tests: 'Complete Blood Count, Liver Function', date: '2024-05-08', status: 'Completed' },
  { id: 'R-2024-126', patientId: 'P-2024-0126', patientName: 'Sarah Miller', tests: 'Lipid Profile', date: '2024-05-08', status: 'Pending' },
  { id: 'R-2024-125', patientId: 'P-2024-0125', patientName: 'Robert Johnson', tests: 'Kidney Function, Electrolytes', date: '2024-05-07', status: 'Processing' },
  { id: 'R-2024-124', patientId: 'P-2024-0124', patientName: 'Maria Garcia', tests: 'Thyroid Function', date: '2024-05-07', status: 'Completed' },
  { id: 'R-2024-123', patientId: 'P-2024-0123', patientName: 'David Brown', tests: 'Blood Glucose', date: '2024-05-06', status: 'Completed' },
];

const Reports: React.FC = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'Processing':
        return <Badge className="bg-blue-500">Processing</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Test Reports</h1>
        <Button className="bg-lab-primary hover:bg-lab-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Create Report
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            className="pl-9"
          />
        </div>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Test Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Report ID</th>
                  <th className="px-4 py-3">Patient ID</th>
                  <th className="px-4 py-3">Patient Name</th>
                  <th className="px-4 py-3">Tests</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reportsData.map((report) => (
                  <tr key={report.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{report.id}</td>
                    <td className="px-4 py-3">{report.patientId}</td>
                    <td className="px-4 py-3">{report.patientName}</td>
                    <td className="px-4 py-3">{report.tests}</td>
                    <td className="px-4 py-3">{report.date}</td>
                    <td className="px-4 py-3">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <FileText className="mr-1 h-4 w-4" /> View
                        </Button>
                        {report.status === 'Completed' && (
                          <Button variant="ghost" size="sm">
                            <Download className="mr-1 h-4 w-4" /> PDF
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
