
import React, { lazy, Suspense } from 'react';
import { useNavigation } from './contexts/NavigationContext';
import { useAuth } from './contexts/AuthContext';
import DashboardLayout from './components/DashboardLayout';
import { Toaster } from "sonner";

// Lazy load pages
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Patients = lazy(() => import('./pages/Patients'));
const Tests = lazy(() => import('./pages/Tests'));
const Reports = lazy(() => import('./pages/Reports'));
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
  const { currentPage } = useNavigation();
  const { isAuthenticated, checkPermission } = useAuth();

  // Function to check if user is allowed to access the page
  const canAccessPage = (page, roles = ['admin', 'labTechnician', 'receptionist']) => {
    if (page === 'login' || page === 'unauthorized') return true;
    return isAuthenticated && checkPermission(roles);
  };

  const renderPage = () => {
    // Redirect to login if not authenticated (except for login page)
    if (!isAuthenticated && currentPage !== 'login') {
      return <Login />;
    }

    switch (currentPage) {
      case 'login':
        return <Login />;
      case 'dashboard':
        return canAccessPage('dashboard') ? (
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        ) : <Unauthorized />;
      case 'patients':
        return canAccessPage('patients') ? (
          <DashboardLayout>
            <Patients />
          </DashboardLayout>
        ) : <Unauthorized />;
      case 'tests':
        return canAccessPage('tests', ['admin', 'labTechnician']) ? (
          <DashboardLayout>
            <Tests />
          </DashboardLayout>
        ) : <Unauthorized />;
      case 'reports':
        return canAccessPage('reports') ? (
          <DashboardLayout>
            <Reports />
          </DashboardLayout>
        ) : <Unauthorized />;
      case 'backup':
        return canAccessPage('backup', ['admin']) ? (
          <DashboardLayout>
            <DataBackup />
          </DashboardLayout>
        ) : <Unauthorized />;
      case 'settings':
        return canAccessPage('settings', ['admin']) ? (
          <DashboardLayout>
            <Settings />
          </DashboardLayout>
        ) : <Unauthorized />;
      case 'unauthorized':
        return <Unauthorized />;
      default:
        return <NotFound />;
    }
  };

  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        {renderPage()}
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
    </>
  );
}

export default App;
