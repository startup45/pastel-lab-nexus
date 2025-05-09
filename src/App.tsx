
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Tests from "./pages/Tests";
import Reports from "./pages/Reports";
import Search from "./pages/Search";
import DataBackup from "./pages/DataBackup";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patients" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Patients />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tests" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'labTechnician']}>
                  <DashboardLayout>
                    <Tests />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Reports />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/search" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'labTechnician']}>
                  <DashboardLayout>
                    <Search />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/backup" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <DataBackup />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <Settings />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
