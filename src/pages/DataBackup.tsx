
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Download, Upload, FileIcon, Calendar, RefreshCcw, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DataBackup: React.FC = () => {
  const { user, checkPermission } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [restoreComplete, setRestoreComplete] = useState(false);

  const isAdmin = checkPermission(['admin']);

  // Mock backup history
  const backupHistory = [
    { id: 'backup-20240508', date: '2024-05-08 09:30 AM', type: 'Auto', user: 'System', size: '12.4 MB', records: 1284 },
    { id: 'backup-20240507', date: '2024-05-07 10:15 AM', type: 'Manual', user: 'Admin User', size: '12.3 MB', records: 1276 },
    { id: 'backup-20240506', date: '2024-05-06 09:45 AM', type: 'Auto', user: 'System', size: '12.1 MB', records: 1265 },
    { id: 'backup-20240505', date: '2024-05-05 09:30 AM', type: 'Auto', user: 'System', size: '12.0 MB', records: 1258 },
    { id: 'backup-20240504', date: '2024-05-04 09:30 AM', type: 'Manual', user: 'Admin User', size: '11.9 MB', records: 1249 },
  ];

  const handleExport = (format: string) => {
    if (!isAdmin) return;
    
    setIsExporting(true);
    // Simulate export operation
    setTimeout(() => {
      setIsExporting(false);
      alert(`Data exported as ${format} successfully!`);
    }, 1500);
  };

  const handleRestore = () => {
    if (!isAdmin) return;
    
    setIsRestoring(true);
    setShowRestoreDialog(false);
    
    // Simulate restore operation
    setTimeout(() => {
      setIsRestoring(false);
      setRestoreComplete(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setRestoreComplete(false);
      }, 3000);
    }, 2000);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            Only administrators can access the data backup and restore functionality.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Data Backup & Restore</h1>
        <p className="text-muted-foreground">Safeguard your laboratory data with regular backups.</p>
      </div>
      
      {isRestoring && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <Card className="w-[350px] shadow-lg">
            <CardContent className="pt-6 flex flex-col items-center justify-center">
              <div className="animate-spin mb-4">
                <RefreshCcw className="h-8 w-8 text-lab-primary" />
              </div>
              <CardTitle className="text-xl mb-2">Restoring Data</CardTitle>
              <CardDescription>Please do not close the browser window.</CardDescription>
            </CardContent>
          </Card>
        </div>
      )}
      
      {restoreComplete && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Data has been restored successfully!
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-10 w-10 rounded-full bg-lab-primary flex items-center justify-center">
                <Download className="h-5 w-5 text-white" />
              </div>
              <CardTitle>Export Data</CardTitle>
            </div>
            <CardDescription>
              Export all patient, test, and report data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                onClick={() => handleExport('CSV')}
                className="w-full justify-start bg-green-600 hover:bg-green-700" 
                disabled={isExporting}
              >
                <FileIcon className="mr-2 h-4 w-4" /> Export as CSV
              </Button>
              <Button 
                onClick={() => handleExport('Excel')}
                className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                disabled={isExporting}
              >
                <FileIcon className="mr-2 h-4 w-4" /> Export as Excel
              </Button>
              <Button 
                onClick={() => handleExport('PDF')}
                className="w-full justify-start bg-red-600 hover:bg-red-700"
                disabled={isExporting}
              >
                <FileIcon className="mr-2 h-4 w-4" /> Export as PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-10 w-10 rounded-full bg-lab-accent flex items-center justify-center">
                <Upload className="h-5 w-5 text-white" />
              </div>
              <CardTitle>Restore Data</CardTitle>
            </div>
            <CardDescription>
              Restore from a previous backup.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowRestoreDialog(true)}
              className="w-full justify-start bg-lab-accent hover:bg-lab-accent/90"
              disabled={isRestoring}
            >
              <Database className="mr-2 h-4 w-4" /> Select Backup to Restore
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-10 w-10 rounded-full bg-lab-secondary flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <CardTitle>Schedule Backups</CardTitle>
            </div>
            <CardDescription>
              Configure automatic backup schedule.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <div className="flex justify-between items-center">
                <span>Daily backups</span>
                <span className="text-green-600 font-medium">Enabled</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Weekly full backup</span>
                <span className="text-green-600 font-medium">Every Sunday</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Monthly archive</span>
                <span className="text-green-600 font-medium">1st of month</span>
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  Configure Schedule
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Backup History</CardTitle>
          <CardDescription>Recent backups of your laboratory data</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="auto">Auto</TabsTrigger>
              <TabsTrigger value="manual">Manual</TabsTrigger>
            </TabsList>
            
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Backup ID</th>
                    <th className="px-4 py-3">Date & Time</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Created By</th>
                    <th className="px-4 py-3">Size</th>
                    <th className="px-4 py-3">Records</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {backupHistory.map((backup) => (
                    <tr key={backup.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{backup.id}</td>
                      <td className="px-4 py-3">{backup.date}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${backup.type === 'Auto' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {backup.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">{backup.user}</td>
                      <td className="px-4 py-3">{backup.size}</td>
                      <td className="px-4 py-3">{backup.records}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">Download</Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowRestoreDialog(true)}
                          >
                            Restore
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Restore Data</DialogTitle>
            <DialogDescription>
              Restoring data will overwrite your current database. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                All current data will be replaced with the selected backup.
                Make sure to export your current data before proceeding.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleRestore}
            >
              Confirm Restore
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataBackup;
