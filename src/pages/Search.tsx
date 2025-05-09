
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon, Users, TestTube, FileText } from 'lucide-react';

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = () => {
    if (!searchQuery) return;
    
    setIsSearching(true);
    // Simulate API call delay
    setTimeout(() => {
      // Mock search results based on the active tab
      let results: any[] = [];
      
      if (activeTab === 'all' || activeTab === 'patients') {
        results = [
          { type: 'patient', id: 'P-2024-0124', name: 'Maria Garcia', age: 28, sex: 'Female' },
          { type: 'patient', id: 'P-2024-0120', name: 'Emma Davis', age: 29, sex: 'Female' }
        ];
      }
      
      if (activeTab === 'all' || activeTab === 'tests') {
        results = [...results,
          { type: 'test', id: 'T-001', name: 'Complete Blood Count (CBC)', groupName: 'Hematology' },
          { type: 'test', id: 'T-015', name: 'Blood Glucose Test', groupName: 'Biochemistry' }
        ];
      }
      
      if (activeTab === 'all' || activeTab === 'reports') {
        results = [...results,
          { type: 'report', id: 'R-2024-124', patientName: 'Maria Garcia', date: '2024-05-07', tests: 'Thyroid Function' },
          { type: 'report', id: 'R-2024-118', patientName: 'Emma Davis', date: '2024-05-04', tests: 'Complete Blood Count, Liver Function' }
        ];
      }
      
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Global Search</h1>
        <p className="text-muted-foreground">Search across patients, tests, and reports.</p>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, test type..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={!searchQuery || isSearching}
              className="bg-lab-primary hover:bg-lab-primary/90"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
          
          <div className="mt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="patients">Patients</TabsTrigger>
                <TabsTrigger value="tests">Tests</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="pt-4">
                {renderSearchResults('all')}
              </TabsContent>
              <TabsContent value="patients" className="pt-4">
                {renderSearchResults('patients')}
              </TabsContent>
              <TabsContent value="tests" className="pt-4">
                {renderSearchResults('tests')}
              </TabsContent>
              <TabsContent value="reports" className="pt-4">
                {renderSearchResults('reports')}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  function renderSearchResults(tab: string) {
    if (isSearching) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-center">
            <p className="text-muted-foreground">Searching...</p>
          </div>
        </div>
      );
    }
    
    if (searchResults.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchQuery ? 'No results found. Try a different search term.' : 'Enter a search term to find patients, tests, or reports.'}
          </p>
        </div>
      );
    }

    const filteredResults = tab === 'all' 
      ? searchResults 
      : searchResults.filter(result => result.type === tab.slice(0, -1)); // Remove 's' from end
    
    if (filteredResults.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No results found in this category.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {filteredResults.map((result, index) => (
          <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
            {result.type === 'patient' && (
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Users className="h-4 w-4 text-blue-700" />
                </div>
                <div>
                  <h3 className="font-medium">{result.name}</h3>
                  <div className="text-sm text-muted-foreground">
                    ID: {result.id} • Age: {result.age} • Sex: {result.sex}
                  </div>
                  <div className="mt-2">
                    <Button variant="outline" size="sm" className="mr-2">View Details</Button>
                    <Button variant="outline" size="sm">View Reports</Button>
                  </div>
                </div>
              </div>
            )}
            
            {result.type === 'test' && (
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <TestTube className="h-4 w-4 text-green-700" />
                </div>
                <div>
                  <h3 className="font-medium">{result.name}</h3>
                  <div className="text-sm text-muted-foreground">
                    ID: {result.id} • Group: {result.groupName}
                  </div>
                  <div className="mt-2">
                    <Button variant="outline" size="sm">View Test Details</Button>
                  </div>
                </div>
              </div>
            )}
            
            {result.type === 'report' && (
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <FileText className="h-4 w-4 text-purple-700" />
                </div>
                <div>
                  <h3 className="font-medium">Report {result.id}</h3>
                  <div className="text-sm text-muted-foreground">
                    Patient: {result.patientName} • Date: {result.date} • Tests: {result.tests}
                  </div>
                  <div className="mt-2">
                    <Button variant="outline" size="sm" className="mr-2">View Report</Button>
                    <Button variant="outline" size="sm">Download PDF</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
};

export default Search;
