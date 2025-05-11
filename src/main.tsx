
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { NavigationProvider } from './contexts/NavigationContext'

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <NavigationProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </NavigationProvider>
  </AuthProvider>
);
