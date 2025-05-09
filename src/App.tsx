
import React, { lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import { Toaster } from "sonner";

// Lazy load pages
const Index = lazy(() => import('./pages/Index'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Patients = lazy(() => import('./pages/Patients'));
const Tests = lazy(() => import('./pages/Tests'));
const Reports = lazy(() => import('./pages/Reports'));
const Search = lazy(() => import('./pages/Search'));
const DataBackup = lazy(() => import('./pages/DataBackup'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));

const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center bg-background">
    <div className="animate-pulse text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/patients" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Patients />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/tests" element={
            <ProtectedRoute allowedRoles={['admin', 'labTechnician']}>
              <DashboardLayout>
                <Tests />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/reports" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Reports />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/search" element={
            <ProtectedRoute allowedRoles={['admin', 'labTechnician']}>
              <DashboardLayout>
                <Search />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/backup" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <DataBackup />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Toaster 
        position="top-right"
        expand={true}
        richColors
        closeButton
        toastOptions={{
          duration: 5000,
        }}
      />
    </AuthProvider>
  );
}

export default App;
