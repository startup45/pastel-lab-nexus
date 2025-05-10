
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download, FileText, Search, Save, Printer, RotateCcw } from 'lucide-react';
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
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';

type Report = {
  id: string;
  patientId: string;
  patientName: string;
  tests: string;
  date: string;
  status: string;
  results?: string;
  age?: string;
  sex?: string;
  reviewedDate?: string;
  testResults?: {
    bloodCount?: {
      hemoglobin?: number;
      wbc?: number;
      platelet?: number;
    };
    lipidProfile?: {
      totalCholesterol?: number;
      triglycerides?: number;
      hdl?: number;
      ldl?: number;
    };
  };
};

const initialReportsData: Report[] = [
  { id: 'R-2024-127', patientId: 'P-2024-0127', patientName: 'James Wilson', tests: 'Complete Blood Count, Lipid Profile', date: '2024-05-08', status: 'Completed' },
  { id: 'R-2024-126', patientId: 'P-2024-0126', patientName: 'Sarah Miller', tests: 'Lipid Profile', date: '2024-05-08', status: 'Pending' },
  { id: 'R-2024-125', patientId: 'P-2024-0125', patientName: 'Robert Johnson', tests: 'Kidney Function, Electrolytes', date: '2024-05-07', status: 'Processing' },
  { id: 'R-2024-124', patientId: 'P-2024-0124', patientName: 'Maria Garcia', tests: 'Thyroid Function', date: '2024-05-07', status: 'Completed' },
  { id: 'R-2024-123', patientId: 'P-2024-0123', patientName: 'David Brown', tests: 'Blood Glucose', date: '2024-05-06', status: 'Completed' },
];

// Available test types
const TEST_TYPES = [
  'Complete Blood Count',
  'Lipid Profile',
  'Kidney Function',
  'Electrolytes',
  'Thyroid Function',
  'Blood Glucose',
  'Liver Function'
];

const Reports: React.FC = () => {
  const [reportsData, setReportsData] = useState<Report[]>(initialReportsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  const form = useForm<Report>({
    defaultValues: {
      patientId: '',
      patientName: '',
      age: '',
      sex: '',
      tests: '',
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      reviewedDate: '',
      testResults: {
        bloodCount: {
          hemoglobin: undefined,
          wbc: undefined,
          platelet: undefined
        },
        lipidProfile: {
          totalCholesterol: undefined,
          triglycerides: undefined,
          hdl: undefined,
          ldl: undefined
        }
      }
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'Processing':
        return <Badge className="bg-blue-500">Processing</Badge>;
      case 'Finalized':
        return <Badge className="bg-purple-500">Finalized</Badge>;
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
    setIsEditMode(false);
    form.reset({
      ...report,
      testResults: report.testResults || {
        bloodCount: {
          hemoglobin: undefined,
          wbc: undefined,
          platelet: undefined
        },
        lipidProfile: {
          totalCholesterol: undefined,
          triglycerides: undefined,
          hdl: undefined,
          ldl: undefined
        }
      }
    });
    setSelectedTests(report.tests.split(', '));
    setIsViewDialogOpen(true);
  };

  const handleEditReport = () => {
    setIsEditMode(true);
  };

  const handleDownloadPDF = () => {
    // If we're in the view/edit dialog, use the current report ID
    const reportId = selectedReport?.id || "new-report";
    toast.success(`Downloading report ${reportId} as PDF...`);
    // In a real app, this would trigger PDF generation
  };

  const handleReportRowDownload = (reportId: string) => {
    toast.success(`Downloading report ${reportId} as PDF...`);
    // In a real app, this would trigger PDF generation
  };

  const handleCreateReport = () => {
    form.reset({
      patientId: `P-2024-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      patientName: '',
      age: '',
      sex: '',
      tests: '',
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      reviewedDate: '',
      results: '',
      testResults: {
        bloodCount: {
          hemoglobin: undefined,
          wbc: undefined,
          platelet: undefined
        },
        lipidProfile: {
          totalCholesterol: undefined,
          triglycerides: undefined,
          hdl: undefined,
          ldl: undefined
        }
      }
    });
    setSelectedReport(null);
    setIsEditMode(true);
    setSelectedTests([]);
    setIsCreateDialogOpen(true);
  };

  const handlePrintReport = () => {
    toast.success("Preparing report for printing...");
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast.error("Unable to open print window. Please check your popup settings.");
      return;
    }
    
    // Get content to print
    const contentToPrint = printRef.current;
    
    if (!contentToPrint) {
      toast.error("Could not find report content to print");
      return;
    }
    
    // Write to the new window
    printWindow.document.write(`
      <html>
        <head>
          <title>Medical Report ${selectedReport?.id || "New Report"}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 100%;
            }
            h1, h2, h3, h4 {
              margin-top: 20px;
              margin-bottom: 10px;
              color: #333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
            }
            table, th, td {
              border: 1px solid #ddd;
            }
            th, td {
              padding: 8px 12px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .section {
              margin-bottom: 20px;
              break-inside: avoid;
            }
            @media print {
              .section {
                page-break-inside: avoid;
              }
            }
            .flag-high {
              color: #e53e3e;
              font-weight: bold;
            }
            .flag-low {
              color: #dd6b20;
              font-weight: bold;
            }
            .flag-normal {
              color: #38a169;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Medical Laboratory Report</h1>
            <div>
              <p>Report ID: ${selectedReport?.id || "New Report"}</p>
              <p>Date: ${selectedReport?.date || new Date().toISOString().split('T')[0]}</p>
            </div>
          </div>
          
          <div class="section">
            <h2>Patient Information</h2>
            <table>
              <tr>
                <td><strong>Patient Name:</strong></td>
                <td>${form.getValues().patientName || "Not specified"}</td>
                <td><strong>Patient ID:</strong></td>
                <td>${form.getValues().patientId || "Not specified"}</td>
              </tr>
              <tr>
                <td><strong>Age:</strong></td>
                <td>${form.getValues().age || "Not specified"}</td>
                <td><strong>Sex:</strong></td>
                <td>${form.getValues().sex || "Not specified"}</td>
              </tr>
              <tr>
                <td><strong>Status:</strong></td>
                <td>${form.getValues().status}</td>
                <td><strong>Tests:</strong></td>
                <td>${selectedTests.join(', ')}</td>
              </tr>
            </table>
          </div>
          
          ${selectedTests.includes('Complete Blood Count') ? `
            <div class="section">
              <h2>Complete Blood Count</h2>
              <table>
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Result</th>
                    <th>Unit</th>
                    <th>Reference Range</th>
                    <th>Flag</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Hemoglobin</td>
                    <td>${form.getValues()?.testResults?.bloodCount?.hemoglobin || "Not tested"}</td>
                    <td>g/dL</td>
                    <td>M: 13.5 - 17.5, F: 12 - 15.5</td>
                    <td class="${getFlagColor(getHemoglobinFlag(form.getValues()?.testResults?.bloodCount?.hemoglobin, form.getValues().sex)).replace('text-', 'flag-')}">${getHemoglobinFlag(form.getValues()?.testResults?.bloodCount?.hemoglobin, form.getValues().sex)}</td>
                  </tr>
                  <tr>
                    <td>White Blood Cell</td>
                    <td>${form.getValues()?.testResults?.bloodCount?.wbc || "Not tested"}</td>
                    <td>cells/µL</td>
                    <td>4500 - 11000</td>
                    <td class="${getFlagColor(getWbcFlag(form.getValues()?.testResults?.bloodCount?.wbc)).replace('text-', 'flag-')}">${getWbcFlag(form.getValues()?.testResults?.bloodCount?.wbc)}</td>
                  </tr>
                  <tr>
                    <td>Platelet Count</td>
                    <td>${form.getValues()?.testResults?.bloodCount?.platelet || "Not tested"}</td>
                    <td>cells/µL</td>
                    <td>150000 - 450000</td>
                    <td class="${getFlagColor(getPlateletFlag(form.getValues()?.testResults?.bloodCount?.platelet)).replace('text-', 'flag-')}">${getPlateletFlag(form.getValues()?.testResults?.bloodCount?.platelet)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ` : ''}
          
          ${selectedTests.includes('Lipid Profile') ? `
            <div class="section">
              <h2>Lipid Profile</h2>
              <table>
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Result</th>
                    <th>Unit</th>
                    <th>Reference Range</th>
                    <th>Flag</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Total Cholesterol</td>
                    <td>${form.getValues()?.testResults?.lipidProfile?.totalCholesterol || "Not tested"}</td>
                    <td>mg/dL</td>
                    <td>125 - 200</td>
                    <td class="${getFlagColor(getTotalCholesterolFlag(form.getValues()?.testResults?.lipidProfile?.totalCholesterol)).replace('text-', 'flag-')}">${getTotalCholesterolFlag(form.getValues()?.testResults?.lipidProfile?.totalCholesterol)}</td>
                  </tr>
                  <tr>
                    <td>Triglycerides</td>
                    <td>${form.getValues()?.testResults?.lipidProfile?.triglycerides || "Not tested"}</td>
                    <td>mg/dL</td>
                    <td>40 - 150</td>
                    <td class="${getFlagColor(getTriglyceridesFlag(form.getValues()?.testResults?.lipidProfile?.triglycerides)).replace('text-', 'flag-')}">${getTriglyceridesFlag(form.getValues()?.testResults?.lipidProfile?.triglycerides)}</td>
                  </tr>
                  <tr>
                    <td>HDL Cholesterol</td>
                    <td>${form.getValues()?.testResults?.lipidProfile?.hdl || "Not tested"}</td>
                    <td>mg/dL</td>
                    <td>M: 35 - 65, F: 35 - 80</td>
                    <td class="${getFlagColor(getHdlFlag(form.getValues()?.testResults?.lipidProfile?.hdl, form.getValues().sex)).replace('text-', 'flag-')}">${getHdlFlag(form.getValues()?.testResults?.lipidProfile?.hdl, form.getValues().sex)}</td>
                  </tr>
                  <tr>
                    <td>LDL Cholesterol</td>
                    <td>${form.getValues()?.testResults?.lipidProfile?.ldl || "Not tested"}</td>
                    <td>mg/dL</td>
                    <td>0 - 130</td>
                    <td class="${getFlagColor(getLdlFlag(form.getValues()?.testResults?.lipidProfile?.ldl)).replace('text-', 'flag-')}">${getLdlFlag(form.getValues()?.testResults?.lipidProfile?.ldl)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ` : ''}
          
          <div class="section">
            <h2>Interpretation</h2>
            <p>${generateInterpretation().split('\n\n').join('</p><p>') || "No interpretation available"}</p>
          </div>
          
          ${form.getValues().results ? `
            <div class="section">
              <h2>Additional Notes</h2>
              <p>${form.getValues().results}</p>
            </div>
          ` : ''}
          
          <div class="section">
            <p><strong>Report generated on:</strong> ${new Date().toLocaleString()}</p>
            ${form.getValues().reviewedDate ? `<p><strong>Reviewed on:</strong> ${form.getValues().reviewedDate}</p>` : ''}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Give the browser a moment to load the content
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleResetForm = () => {
    if (selectedReport) {
      form.reset({
        ...selectedReport,
        testResults: selectedReport.testResults || {
          bloodCount: {
            hemoglobin: undefined,
            wbc: undefined,
            platelet: undefined
          },
          lipidProfile: {
            totalCholesterol: undefined,
            triglycerides: undefined,
            hdl: undefined,
            ldl: undefined
          }
        }
      });
    } else {
      form.reset({
        patientId: `P-2024-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        patientName: '',
        age: '',
        sex: '',
        tests: '',
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        reviewedDate: '',
        results: ''
      });
    }
    setSelectedTests([]);
    toast.info("Form has been reset");
  };

  const handleToggleTest = (test: string) => {
    if (selectedTests.includes(test)) {
      setSelectedTests(selectedTests.filter(t => t !== test));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const handleSaveReport = () => {
    const formData = form.getValues();
    const updatedReport: Report = {
      ...formData,
      id: selectedReport ? selectedReport.id : `R-2024-${Math.floor(Math.random() * 1000)}`,
      tests: selectedTests.join(', '),
      date: formData.date || new Date().toISOString().split('T')[0]
    };

    if (selectedReport) {
      // Update existing report
      setReportsData(reportsData.map(report => 
        report.id === selectedReport.id ? updatedReport : report
      ));
      toast.success("Report updated successfully!");
      setIsViewDialogOpen(false);
    } else {
      // Create new report
      setReportsData([updatedReport, ...reportsData]);
      toast.success("New report created successfully!");
      setIsCreateDialogOpen(false);
    }
  };

  const getHemoglobinFlag = (value?: number, sex?: string) => {
    if (!value) return "-";
    if (sex === 'Male') {
      return value < 13.5 ? "Low" : value > 17.5 ? "High" : "Normal";
    } else {
      return value < 12 ? "Low" : value > 15.5 ? "High" : "Normal";
    }
  };

  const getWbcFlag = (value?: number) => {
    if (!value) return "-";
    return value < 4500 ? "Low" : value > 11000 ? "High" : "Normal";
  };

  const getPlateletFlag = (value?: number) => {
    if (!value) return "-";
    return value < 150000 ? "Low" : value > 450000 ? "High" : "Normal";
  };

  const getTotalCholesterolFlag = (value?: number) => {
    if (!value) return "-";
    return value < 125 ? "Low" : value > 200 ? "High" : "Normal";
  };

  const getTriglyceridesFlag = (value?: number) => {
    if (!value) return "-";
    return value < 40 ? "Low" : value > 150 ? "High" : "Normal";
  };

  const getHdlFlag = (value?: number, sex?: string) => {
    if (!value) return "-";
    if (sex === 'Male') {
      return value < 35 ? "Low" : value > 65 ? "High" : "Normal";
    } else {
      return value < 35 ? "Low" : value > 80 ? "High" : "Normal";
    }
  };

  const getLdlFlag = (value?: number) => {
    if (!value) return "-";
    return value > 130 ? "High" : "Normal";
  };

  const getFlagColor = (flag: string) => {
    switch(flag) {
      case 'High': return "text-red-500 font-bold";
      case 'Low': return "text-orange-500 font-bold";
      case 'Normal': return "text-green-500";
      default: return "";
    }
  };

  const generateInterpretation = () => {
    const formData = form.getValues();
    const { testResults } = formData;
    const interpretations: string[] = [];

    if (testResults?.lipidProfile?.totalCholesterol && testResults.lipidProfile.totalCholesterol > 200) {
      interpretations.push("Total Cholesterol: Elevated cholesterol levels may indicate increased risk for cardiovascular disease.");
    }

    if (testResults?.lipidProfile?.ldl && testResults.lipidProfile.ldl > 130) {
      interpretations.push("LDL Cholesterol: Elevated LDL levels may require dietary changes or medication.");
    }

    if (testResults?.bloodCount?.hemoglobin) {
      const hemoglobinFlag = getHemoglobinFlag(testResults.bloodCount.hemoglobin, formData.sex);
      if (hemoglobinFlag === "Low") {
        interpretations.push("Hemoglobin: Low hemoglobin levels may indicate anemia or blood loss.");
      } else if (hemoglobinFlag === "High") {
        interpretations.push("Hemoglobin: Elevated hemoglobin may be associated with lung disease, heart disease, or dehydration.");
      }
    }

    return interpretations.join("\n\n") || "All test results are within normal range.";
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
                              onClick={() => handleReportRowDownload(report.id)}
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

      {/* Unified Report Dialog (View/Edit/Create) */}
      <Dialog 
        open={isViewDialogOpen || isCreateDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setIsViewDialogOpen(false);
            setIsCreateDialogOpen(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-4xl h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreateDialogOpen ? "Create New Medical Report" : 
               isEditMode ? `Edit Report ${selectedReport?.id}` : 
               `Report Details - ${selectedReport?.id}`}
            </DialogTitle>
            <DialogDescription>
              {isCreateDialogOpen ? "Enter complete information for the new laboratory report" : 
               isEditMode ? "Update the laboratory report information" :
               `View complete information for ${selectedReport?.patientName}'s report`}
            </DialogDescription>
          </DialogHeader>

          <div ref={printRef}>
            <Form {...form}>
              <div className="space-y-6">
                {/* Patient & Report Information Section */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-4">Patient & Report Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      name="patientName"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Patient Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              disabled={!isEditMode && !isCreateDialogOpen}
                              placeholder="Full name"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="patientId"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Patient ID</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              disabled={!isCreateDialogOpen}
                              placeholder="P-YYYY-XXXX"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        name="age"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number"
                                min="0"
                                max="120"
                                disabled={!isEditMode && !isCreateDialogOpen}
                                placeholder="Age"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="sex"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sex</FormLabel>
                            <FormControl>
                              <Select
                                disabled={!isEditMode && !isCreateDialogOpen}
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select sex" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Male">Male</SelectItem>
                                  <SelectItem value="Female">Female</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      name="date"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date Created</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="date"
                              disabled={!isEditMode && !isCreateDialogOpen}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="status"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <Select
                              disabled={!isEditMode && !isCreateDialogOpen}
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Processing">Processing</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Finalized">Finalized</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="reviewedDate"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reviewed Date (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="date"
                              disabled={!isEditMode && !isCreateDialogOpen}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Tests Selection */}
                  <div className="mt-4">
                    <FormLabel>Tests Ordered</FormLabel>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                      {TEST_TYPES.map(test => (
                        <div key={test} className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={`test-${test}`}
                            checked={selectedTests.includes(test)}
                            onChange={() => handleToggleTest(test)}
                            disabled={!isEditMode && !isCreateDialogOpen}
                            className="mr-2 h-4 w-4"
                          />
                          <label htmlFor={`test-${test}`} className="text-sm">{test}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Test Results Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Test Results</h3>

                  {/* Complete Blood Count */}
                  {(selectedTests.includes('Complete Blood Count') || 
                    (selectedReport?.tests && selectedReport.tests.includes('Complete Blood Count'))) && (
                    <div>
                      <h4 className="font-medium mb-2">🩸 Complete Blood Count</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Parameter</TableHead>
                            <TableHead>Result</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Reference Range</TableHead>
                            <TableHead>Flag</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Hemoglobin</TableCell>
                            <TableCell>
                              <Input 
                                type="number" 
                                step="0.1"
                                disabled={!isEditMode && !isCreateDialogOpen}
                                {...form.register(`testResults.bloodCount.hemoglobin` as const, { 
                                  valueAsNumber: true 
                                })}
                              />
                            </TableCell>
                            <TableCell>g/dL</TableCell>
                            <TableCell>M: 13.5 - 17.5, F: 12 - 15.5</TableCell>
                            <TableCell className={getFlagColor(
                              getHemoglobinFlag(
                                form.getValues()?.testResults?.bloodCount?.hemoglobin, 
                                form.getValues().sex
                              )
                            )}>
                              {getHemoglobinFlag(
                                form.getValues()?.testResults?.bloodCount?.hemoglobin, 
                                form.getValues().sex
                              )}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>White Blood Cell</TableCell>
                            <TableCell>
                              <Input 
                                type="number" 
                                disabled={!isEditMode && !isCreateDialogOpen}
                                {...form.register(`testResults.bloodCount.wbc` as const, { 
                                  valueAsNumber: true 
                                })}
                              />
                            </TableCell>
                            <TableCell>cells/µL</TableCell>
                            <TableCell>4500 - 11000</TableCell>
                            <TableCell className={getFlagColor(
                              getWbcFlag(form.getValues()?.testResults?.bloodCount?.wbc)
                            )}>
                              {getWbcFlag(form.getValues()?.testResults?.bloodCount?.wbc)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Platelet Count</TableCell>
                            <TableCell>
                              <Input 
                                type="number" 
                                disabled={!isEditMode && !isCreateDialogOpen}
                                {...form.register(`testResults.bloodCount.platelet` as const, { 
                                  valueAsNumber: true 
                                })}
                              />
                            </TableCell>
                            <TableCell>cells/µL</TableCell>
                            <TableCell>150000 - 450000</TableCell>
                            <TableCell className={getFlagColor(
                              getPlateletFlag(form.getValues()?.testResults?.bloodCount?.platelet)
                            )}>
                              {getPlateletFlag(form.getValues()?.testResults?.bloodCount?.platelet)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* Lipid Profile */}
                  {(selectedTests.includes('Lipid Profile') || 
                    (selectedReport?.tests && selectedReport.tests.includes('Lipid Profile'))) && (
                    <div>
                      <h4 className="font-medium mb-2">💉 Lipid Profile</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Parameter</TableHead>
                            <TableHead>Result</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Reference Range</TableHead>
                            <TableHead>Flag</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Total Cholesterol</TableCell>
                            <TableCell>
                              <Input 
                                type="number" 
                                disabled={!isEditMode && !isCreateDialogOpen}
                                {...form.register(`testResults.lipidProfile.totalCholesterol` as const, { 
                                  valueAsNumber: true 
                                })}
                              />
                            </TableCell>
                            <TableCell>mg/dL</TableCell>
                            <TableCell>125 - 200</TableCell>
                            <TableCell className={getFlagColor(
                              getTotalCholesterolFlag(form.getValues()?.testResults?.lipidProfile?.totalCholesterol)
                            )}>
                              {getTotalCholesterolFlag(form.getValues()?.testResults?.lipidProfile?.totalCholesterol)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Triglycerides</TableCell>
                            <TableCell>
                              <Input 
                                type="number" 
                                disabled={!isEditMode && !isCreateDialogOpen}
                                {...form.register(`testResults.lipidProfile.triglycerides` as const, { 
                                  valueAsNumber: true 
                                })}
                              />
                            </TableCell>
                            <TableCell>mg/dL</TableCell>
                            <TableCell>40 - 150</TableCell>
                            <TableCell className={getFlagColor(
                              getTriglyceridesFlag(form.getValues()?.testResults?.lipidProfile?.triglycerides)
                            )}>
                              {getTriglyceridesFlag(form.getValues()?.testResults?.lipidProfile?.triglycerides)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>HDL Cholesterol</TableCell>
                            <TableCell>
                              <Input 
                                type="number" 
                                disabled={!isEditMode && !isCreateDialogOpen}
                                {...form.register(`testResults.lipidProfile.hdl` as const, { 
                                  valueAsNumber: true 
                                })}
                              />
                            </TableCell>
                            <TableCell>mg/dL</TableCell>
                            <TableCell>M: 35 - 65, F: 35 - 80</TableCell>
                            <TableCell className={getFlagColor(
                              getHdlFlag(
                                form.getValues()?.testResults?.lipidProfile?.hdl, 
                                form.getValues().sex
                              )
                            )}>
                              {getHdlFlag(
                                form.getValues()?.testResults?.lipidProfile?.hdl, 
                                form.getValues().sex
                              )}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>LDL Cholesterol</TableCell>
                            <TableCell>
                              <Input 
                                type="number" 
                                disabled={!isEditMode && !isCreateDialogOpen}
                                {...form.register(`testResults.lipidProfile.ldl` as const, { 
                                  valueAsNumber: true 
                                })}
                              />
                            </TableCell>
                            <TableCell>mg/dL</TableCell>
                            <TableCell>0 - 130</TableCell>
                            <TableCell className={getFlagColor(
                              getLdlFlag(form.getValues()?.testResults?.lipidProfile?.ldl)
                            )}>
                              {getLdlFlag(form.getValues()?.testResults?.lipidProfile?.ldl)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* Additional Notes */}
                  <div>
                    <FormField
                      name="results"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Notes</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              disabled={!isEditMode && !isCreateDialogOpen}
                              placeholder="Enter any additional notes or comments about the test results"
                              className="min-h-[120px]"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </Form>
          </div>

          <DialogFooter className="flex flex-wrap gap-2 mt-6">
            {isEditMode || isCreateDialogOpen ? (
              <>
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={handleResetForm}
                  className="flex-1 sm:flex-none"
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
                <Button 
                  variant="default" 
                  type="button"
                  onClick={handleSaveReport}
                  className="flex-1 sm:flex-none bg-lab-primary hover:bg-lab-primary/90"
                >
                  <Save className="mr-2 h-4 w-4" /> Save Report
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleEditReport} 
                  className="flex-1 sm:flex-none"
                >
                  Edit Report
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handlePrintReport}
                  className="flex-1 sm:flex-none"
                >
                  <Printer className="mr-2 h-4 w-4" /> Print
                </Button>
                <Button 
                  variant="default" 
                  onClick={handleDownloadPDF}
                  className="flex-1 sm:flex-none bg-lab-primary hover:bg-lab-primary/90"
                >
                  <Download className="mr-2 h-4 w-4" /> Download PDF
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
