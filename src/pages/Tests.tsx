
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TestTube, Search, Edit, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Test {
  id: number;
  name: string;
  unit: string;
  normalRange: {
    male: string;
    female: string;
  };
}

interface TestGroup {
  id: number;
  name: string;
  tests: Test[];
}

const initialTestGroups = [
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
  const [testGroups, setTestGroups] = useState<TestGroup[]>(initialTestGroups);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddTestOpen, setIsAddTestOpen] = useState(false);
  const [isAddToGroupOpen, setIsAddToGroupOpen] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState<number | null>(null);
  const [isEditTestOpen, setIsEditTestOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState<Test | null>(null);
  const [newTest, setNewTest] = useState<Partial<Test>>({
    name: '',
    unit: '',
    normalRange: {
      male: '',
      female: ''
    }
  });

  const filteredGroups = testGroups.filter((group) => {
    if (!searchTerm) return true;
    
    if (group.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return true;
    }
    
    return group.tests.some((test) => 
      test.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddTest = () => {
    if (!newTest.name || !newTest.unit) {
      toast.error("Test name and unit are required");
      return;
    }

    if (currentGroupId === null) {
      toast.error("Please select a test group");
      return;
    }

    const newTestId = Math.max(...testGroups.flatMap(group => group.tests.map(test => test.id))) + 1;
    
    const updatedGroups = testGroups.map(group => {
      if (group.id === currentGroupId) {
        return {
          ...group,
          tests: [
            ...group.tests,
            {
              id: newTestId,
              name: newTest.name || '',
              unit: newTest.unit || '',
              normalRange: {
                male: newTest.normalRange?.male || '',
                female: newTest.normalRange?.female || ''
              }
            }
          ]
        };
      }
      return group;
    });

    setTestGroups(updatedGroups);
    setNewTest({
      name: '',
      unit: '',
      normalRange: {
        male: '',
        female: ''
      }
    });
    setIsAddToGroupOpen(false);
    toast.success("Test added successfully");
  };

  const handleEditTest = (test: Test, groupId: number) => {
    setCurrentTest(test);
    setCurrentGroupId(groupId);
    setNewTest({
      name: test.name,
      unit: test.unit,
      normalRange: {
        male: test.normalRange.male,
        female: test.normalRange.female
      }
    });
    setIsEditTestOpen(true);
  };

  const handleUpdateTest = () => {
    if (!newTest.name || !newTest.unit || !currentTest || currentGroupId === null) {
      toast.error("Missing required information");
      return;
    }

    const updatedGroups = testGroups.map(group => {
      if (group.id === currentGroupId) {
        return {
          ...group,
          tests: group.tests.map(test => {
            if (test.id === currentTest.id) {
              return {
                ...test,
                name: newTest.name || test.name,
                unit: newTest.unit || test.unit,
                normalRange: {
                  male: newTest.normalRange?.male || test.normalRange.male,
                  female: newTest.normalRange?.female || test.normalRange.female
                }
              };
            }
            return test;
          })
        };
      }
      return group;
    });

    setTestGroups(updatedGroups);
    setIsEditTestOpen(false);
    setCurrentTest(null);
    toast.success("Test updated successfully");
  };

  const handleDeleteTest = (testId: number, groupId: number) => {
    const updatedGroups = testGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          tests: group.tests.filter(test => test.id !== testId)
        };
      }
      return group;
    });

    setTestGroups(updatedGroups);
    toast.success("Test deleted successfully");
  };

  const handleAddToGroup = (groupId: number) => {
    setCurrentGroupId(groupId);
    setNewTest({
      name: '',
      unit: '',
      normalRange: {
        male: '',
        female: ''
      }
    });
    setIsAddToGroupOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (normalRange.male, normalRange.female)
      const [parent, child] = name.split('.');
      setNewTest(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as object,
          [child]: value
        }
      }));
    } else {
      // Handle top-level properties
      setNewTest(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Lab Tests</h1>
        {canEditTests && (
          <Button 
            className="bg-lab-primary hover:bg-lab-primary/90"
            onClick={() => setIsAddTestOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Test Group
          </Button>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tests..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      <div className="space-y-6">
        {filteredGroups.map((group) => (
          <Card key={group.id} className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <TestTube className="mr-2 h-5 w-5 text-lab-primary" />
                  {group.name}
                </CardTitle>
                {canEditTests && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleAddToGroup(group.id)}
                  >
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
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditTest(test, group.id)}
                              >
                                <Edit className="h-4 w-4 mr-1" /> Edit
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500"
                                onClick={() => handleDeleteTest(test.id, group.id)}
                              >
                                <Trash className="h-4 w-4 mr-1" /> Delete
                              </Button>
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

      {/* Add Test Group Dialog */}
      <Dialog open={isAddTestOpen} onOpenChange={setIsAddTestOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Test Group</DialogTitle>
            <DialogDescription>
              Create a new group of tests for the laboratory.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                placeholder="e.g., Kidney Function Tests"
                value={newTest.name}
                onChange={(e) => setNewTest(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddTestOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (!newTest.name) {
                  toast.error("Group name is required");
                  return;
                }
                
                const newGroupId = Math.max(...testGroups.map(g => g.id)) + 1;
                setTestGroups([...testGroups, {
                  id: newGroupId,
                  name: newTest.name,
                  tests: []
                }]);
                setNewTest({ name: '', unit: '', normalRange: { male: '', female: '' } });
                setIsAddTestOpen(false);
                toast.success("Test group added successfully");
              }}
              className="bg-lab-primary hover:bg-lab-primary/90"
            >
              Add Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Test to Group Dialog */}
      <Dialog open={isAddToGroupOpen} onOpenChange={setIsAddToGroupOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Test to Group</DialogTitle>
            <DialogDescription>
              Add a new test to the selected group.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="testName">Test Name*</Label>
              <Input
                id="testName"
                name="name"
                placeholder="e.g., Blood Glucose"
                value={newTest.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit*</Label>
              <Input
                id="unit"
                name="unit"
                placeholder="e.g., mg/dL"
                value={newTest.unit}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="normalRangeMale">Normal Range (Male)</Label>
                <Input
                  id="normalRangeMale"
                  name="normalRange.male"
                  placeholder="e.g., 70-110"
                  value={newTest.normalRange?.male}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="normalRangeFemale">Normal Range (Female)</Label>
                <Input
                  id="normalRangeFemale"
                  name="normalRange.female"
                  placeholder="e.g., 70-110"
                  value={newTest.normalRange?.female}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddToGroupOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddTest}
              className="bg-lab-primary hover:bg-lab-primary/90"
            >
              Add Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Test Dialog */}
      <Dialog open={isEditTestOpen} onOpenChange={setIsEditTestOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Test</DialogTitle>
            <DialogDescription>
              Update the test information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editTestName">Test Name*</Label>
              <Input
                id="editTestName"
                name="name"
                value={newTest.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editUnit">Unit*</Label>
              <Input
                id="editUnit"
                name="unit"
                value={newTest.unit}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editNormalRangeMale">Normal Range (Male)</Label>
                <Input
                  id="editNormalRangeMale"
                  name="normalRange.male"
                  value={newTest.normalRange?.male}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editNormalRangeFemale">Normal Range (Female)</Label>
                <Input
                  id="editNormalRangeFemale"
                  name="normalRange.female"
                  value={newTest.normalRange?.female}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditTestOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateTest}
              className="bg-lab-primary hover:bg-lab-primary/90"
            >
              Update Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tests;
