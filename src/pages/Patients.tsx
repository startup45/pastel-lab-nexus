
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { Search, Plus, Edit, Trash, FileText } from 'lucide-react';
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

// Sample patients data
const initialPatients = [
  { id: 'P-2024-0127', name: 'James Wilson', age: 45, sex: 'Male', contact: '(555) 123-4567', referredBy: 'Dr. Andrews', collectionDate: '2024-05-08' },
  { id: 'P-2024-0126', name: 'Sarah Miller', age: 32, sex: 'Female', contact: '(555) 234-5678', referredBy: 'Dr. Martinez', collectionDate: '2024-05-08' },
  { id: 'P-2024-0125', name: 'Robert Johnson', age: 51, sex: 'Male', contact: '(555) 345-6789', referredBy: 'Dr. Williams', collectionDate: '2024-05-07' },
  { id: 'P-2024-0124', name: 'Maria Garcia', age: 28, sex: 'Female', contact: '(555) 456-7890', referredBy: 'Dr. Brown', collectionDate: '2024-05-07' },
  { id: 'P-2024-0123', name: 'David Brown', age: 39, sex: 'Male', contact: '(555) 567-8901', referredBy: 'Dr. Taylor', collectionDate: '2024-05-06' },
  { id: 'P-2024-0122', name: 'Lisa Taylor', age: 44, sex: 'Female', contact: '(555) 678-9012', referredBy: 'Dr. Evans', collectionDate: '2024-05-06' },
  { id: 'P-2024-0121', name: 'John Smith', age: 52, sex: 'Male', contact: '(555) 789-0123', referredBy: 'Dr. Rodriguez', collectionDate: '2024-05-05' },
  { id: 'P-2024-0120', name: 'Emma Davis', age: 29, sex: 'Female', contact: '(555) 890-1234', referredBy: 'Dr. Wilson', collectionDate: '2024-05-05' },
];

interface Patient {
  id: string;
  name: string;
  age: number;
  sex: string;
  contact: string;
  referredBy: string;
  collectionDate: string;
}

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
    id: `P-2024-${Math.floor(Math.random() * 9000) + 1000}`,
    name: '',
    age: 0,
    sex: '',
    contact: '',
    referredBy: '',
    collectionDate: new Date().toISOString().split('T')[0],
  });
  const { user, checkPermission } = useAuth();

  const canEditPatients = checkPermission(['admin', 'labTechnician']);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddPatient = () => {
    // Validate required fields
    if (!newPatient.name || !newPatient.age || !newPatient.sex) {
      return;
    }

    const patientToAdd = {
      id: newPatient.id || `P-2024-${Math.floor(Math.random() * 9000) + 1000}`,
      name: newPatient.name || '',
      age: Number(newPatient.age) || 0,
      sex: newPatient.sex || '',
      contact: newPatient.contact || '',
      referredBy: newPatient.referredBy || '',
      collectionDate: newPatient.collectionDate || new Date().toISOString().split('T')[0],
    };

    setPatients([patientToAdd, ...patients]);
    setIsAddModalOpen(false);
    setNewPatient({
      id: `P-2024-${Math.floor(Math.random() * 9000) + 1000}`,
      name: '',
      age: 0,
      sex: '',
      contact: '',
      referredBy: '',
      collectionDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewPatient((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Patients Management</h1>
        {canEditPatients && (
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-lab-primary hover:bg-lab-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Patient
          </Button>
        )}
      </div>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Patient Directory</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Age</th>
                  <th className="px-4 py-3">Sex</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Referred By</th>
                  <th className="px-4 py-3">Collection Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{patient.id}</td>
                      <td className="px-4 py-3">{patient.name}</td>
                      <td className="px-4 py-3">{patient.age}</td>
                      <td className="px-4 py-3">{patient.sex}</td>
                      <td className="px-4 py-3">{patient.contact}</td>
                      <td className="px-4 py-3">{patient.referredBy}</td>
                      <td className="px-4 py-3">{patient.collectionDate}</td>
                      <td className="px-4 py-3 flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <FileText className="h-4 w-4" />
                        </Button>
                        {canEditPatients && (
                          <>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-3 text-center">No patients found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Patient Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>
              Enter the patient details below to register a new patient.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="id">Patient ID</Label>
                <Input
                  id="id"
                  name="id"
                  value={newPatient.id}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="collectionDate">Collection Date</Label>
                <Input
                  id="collectionDate"
                  name="collectionDate"
                  type="date"
                  value={newPatient.collectionDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name*</Label>
                <Input
                  id="name"
                  name="name"
                  value={newPatient.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="age">Age*</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={newPatient.age}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sex">Sex*</Label>
                  <Select
                    value={newPatient.sex?.toString()}
                    onValueChange={(value) => handleSelectChange('sex', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                name="contact"
                value={newPatient.contact}
                onChange={handleInputChange}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="referredBy">Referred By</Label>
              <Input
                id="referredBy"
                name="referredBy"
                value={newPatient.referredBy}
                onChange={handleInputChange}
                placeholder="Doctor's name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPatient} className="bg-lab-primary hover:bg-lab-primary/90">
              Add Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Patients;
