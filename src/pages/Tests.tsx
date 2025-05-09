
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TestTube, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

const testGroups = [
  {
    id: 1,
    name: 'Complete Blood Count (CBC)',
    tests: [
      { id: 1, name: 'Hemoglobin (Hb)', unit: 'g/dL', normalRange: { male: '13-17', female: '12-15' } },
      { id: 2, name: 'Red Blood Cells (RBC)', unit: 'million/µL', normalRange: { male: '4.5-5.9', female: '4.0-5.2' } },
      { id: 3, name: 'White Blood Cells (WBC)', unit: '1000/µL', normalRange: { male: '4.5-11.0', female: '4.5-11.0' } },
      { id: 4, name: 'Platelet Count', unit: '1000/µL', normalRange: { male: '150-450', female: '150-450' } }
    ]
  },
  {
    id: 2,
    name: 'Lipid Profile',
    tests: [
      { id: 5, name: 'Total Cholesterol', unit: 'mg/dL', normalRange: { male: '<200', female: '<200' } },
      { id: 6, name: 'HDL Cholesterol', unit: 'mg/dL', normalRange: { male: '>40', female: '>50' } },
      { id: 7, name: 'LDL Cholesterol', unit: 'mg/dL', normalRange: { male: '<100', female: '<100' } },
      { id: 8, name: 'Triglycerides', unit: 'mg/dL', normalRange: { male: '<150', female: '<150' } }
    ]
  },
  {
    id: 3,
    name: 'Liver Function Tests',
    tests: [
      { id: 9, name: 'ALT/SGPT', unit: 'U/L', normalRange: { male: '7-56', female: '7-45' } },
      { id: 10, name: 'AST/SGOT', unit: 'U/L', normalRange: { male: '10-40', female: '10-35' } },
      { id: 11, name: 'Alkaline Phosphatase', unit: 'U/L', normalRange: { male: '44-147', female: '44-147' } },
      { id: 12, name: 'Bilirubin (Total)', unit: 'mg/dL', normalRange: { male: '0.1-1.2', female: '0.1-1.2' } }
    ]
  }
];

const Tests: React.FC = () => {
  const { user, checkPermission } = useAuth();
  const canEditTests = checkPermission(['admin', 'labTechnician']);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Lab Tests</h1>
        {canEditTests && (
          <Button 
            className="bg-lab-primary hover:bg-lab-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Test
          </Button>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tests..."
            className="pl-9"
          />
        </div>
      </div>
      
      <div className="space-y-6">
        {testGroups.map((group) => (
          <Card key={group.id} className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <TestTube className="mr-2 h-5 w-5 text-lab-primary" />
                  {group.name}
                </CardTitle>
                {canEditTests && (
                  <Button variant="outline" size="sm">
                    <Plus className="mr-1 h-3 w-3" /> Add to Group
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-3">Test Name</th>
                      <th className="px-4 py-3">Unit</th>
                      <th className="px-4 py-3">Normal Range (Male)</th>
                      <th className="px-4 py-3">Normal Range (Female)</th>
                      {canEditTests && <th className="px-4 py-3">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {group.tests.map((test) => (
                      <tr key={test.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{test.name}</td>
                        <td className="px-4 py-3">{test.unit}</td>
                        <td className="px-4 py-3">{test.normalRange.male}</td>
                        <td className="px-4 py-3">{test.normalRange.female}</td>
                        {canEditTests && (
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Tests;
