
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download, FileText, Search, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";

type Report = {
  id: string;
  patientId: string;
  patientName: string;
  tests: string;
  date: string;
  status: string;
  results?: string;
};

const initialReportsData: Report[] = [
  { id: 'R-2024-127', patientId: 'P-2024-0127', patientName: 'James Wilson', tests: 'Complete Blood Count, Liver Function', date: '2024-05-08', status: 'Completed' },
  { id: 'R-2024-126', patientId: 'P-2024-0126', patientName: 'Sarah Miller', tests: 'Lipid Profile', date: '2024-05-08', status: 'Pending' },
  { id: 'R-2024-125', patientId: 'P-2024-0125', patientName: 'Robert Johnson', tests: 'Kidney Function, Electrolytes', date: '2024-05-07', status: 'Processing' },
  { id: 'R-2024-124', patientId: 'P-2024-0124', patientName: 'Maria Garcia', tests: 'Thyroid Function', date: '2024-05-07', status: 'Completed' },
  { id: 'R-2024-123', patientId: 'P-2024-0123', patientName: 'David Brown', tests: 'Blood Glucose', date: '2024-05-06', status: 'Completed' },
];

const Reports: React.FC = () => {
  const [reportsData, setReportsData] = useState<Report[]>(initialReportsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    patientId: '',
    patientName: '',
    tests: '',
    results: ''
  });

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredReports = reportsData.filter(report => 
    report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setIsViewDialogOpen(true);
  };

  const handleDownloadPDF = (reportId: string) => {
    toast.success(`Downloading report ${reportId} as PDF...`);
    // In a real app, this would trigger PDF generation
  };

  const handleCreateReport = () => {
    setIsCreateDialogOpen(true);
  };

  const handleSaveNewReport = () => {
    const newReportObject: Report = {
      id: `R-2024-${Math.floor(Math.random() * 1000)}`,
      patientId: newReport.patientId,
      patientName: newReport.patientName,
      tests: newReport.tests,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      results: newReport.results
    };

    setReportsData([newReportObject, ...reportsData]);
    setIsCreateDialogOpen(false);
    toast.success("New report created successfully!");
    setNewReport({
      patientId: '',
      patientName: '',
      tests: '',
      results: ''
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Test Reports</h1>
        <Button className="bg-lab-primary hover:bg-lab-primary/90" onClick={handleCreateReport}>
          <Plus className="mr-2 h-4 w-4" /> Create Report
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearch}
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
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
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
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewReport(report)}
                          >
                            <FileText className="mr-1 h-4 w-4" /> View
                          </Button>
                          {report.status === 'Completed' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDownloadPDF(report.id)}
                            >
                              <Download className="mr-1 h-4 w-4" /> PDF
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      No reports found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Report Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>
              View complete information for report {selectedReport?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold">Report ID</p>
                  <p>{selectedReport.id}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Status</p>
                  <p>{getStatusBadge(selectedReport.status)}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Patient ID</p>
                  <p>{selectedReport.patientId}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Patient Name</p>
                  <p>{selectedReport.patientName}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-semibold">Test(s)</p>
                  <p>{selectedReport.tests}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-semibold">Results</p>
                  <p>{selectedReport.results || "No results recorded yet"}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Date</p>
                  <p>{selectedReport.date}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            {selectedReport?.status === 'Completed' && (
              <Button 
                variant="lab" 
                onClick={() => handleDownloadPDF(selectedReport.id)}
              >
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Report Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Report</DialogTitle>
            <DialogDescription>
              Enter the details for the new laboratory report
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label htmlFor="patientId" className="text-sm font-medium">
                Patient ID
              </label>
              <Input 
                id="patientId" 
                value={newReport.patientId}
                onChange={(e) => setNewReport({...newReport, patientId: e.target.value})}
                placeholder="P-YYYY-XXXX"
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="patientName" className="text-sm font-medium">
                Patient Name
              </label>
              <Input 
                id="patientName" 
                value={newReport.patientName}
                onChange={(e) => setNewReport({...newReport, patientName: e.target.value})}
                placeholder="Full name"
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="tests" className="text-sm font-medium">
                Tests
              </label>
              <Input 
                id="tests" 
                value={newReport.tests}
                onChange={(e) => setNewReport({...newReport, tests: e.target.value})}
                placeholder="e.g. Complete Blood Count, Lipid Profile"
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="results" className="text-sm font-medium">
                Test Results
              </label>
              <Textarea 
                id="results" 
                value={newReport.results}
                onChange={(e) => setNewReport({...newReport, results: e.target.value})}
                placeholder="Enter test results here"
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="lab" 
              onClick={handleSaveNewReport}
              disabled={!newReport.patientId || !newReport.patientName || !newReport.tests}
            >
              <Save className="mr-2 h-4 w-4" /> Save Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
