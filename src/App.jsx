import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import FloatingActionButton from './components/FloatingActionButton';
import NotificationService from './services/NotificationService';
import Dashboard from './components/Dashboard';
import Journal from './components/Journal';
import CrisisLog from './components/CrisisLog';
import EmergencyKit from './components/EmergencyKit';
import Analyticss from './components/Analytics';
import Motivation from './components/Motivation';
import MedicalReports from './components/MedicalReports';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import OnboardingWelcome from './components/OnboardingWelcome';
import { HealthDataProvider, useHealthData } from './context/HealthDataContext';
import Footer from './components/Footer';
import AIChat from './components/AIChat';
import GuidePage from './components/Guide';
import Settings from './components/Settings';

import { Analytics } from "@vercel/analytics/react"
import notificationService from './services/NotificationService';


const Home = () => {
  const { getDisplayName } = useHealthData();
  const displayName = getDisplayName();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">
      <p className="text-lg text-blue-600 mb-8 font-medium">
        Welcome to your health journey, {displayName}!
      </p>
      <Link to="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">
        Start Health Tracking
      </Link>
    </div>
  );
};

const AppContent = () => {
  const { hasCompletedOnboarding } = useHealthData();

  if (!hasCompletedOnboarding) {
    return <OnboardingWelcome />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/crisis-log" element={<CrisisLog />} />
          <Route path="/analytics" element={<Analyticss />} />
          <Route path="/motivation" element={<Motivation />} />
          <Route path="/medical-reports" element={<MedicalReports />} />
          <Route path="/emergency-kit" element={<EmergencyKit />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <AIChat />
      <Footer />
      <PWAInstallPrompt />
      <Analytics />
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 2000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

function App() {
  // Initialize notification service when app starts
  useEffect(() => {
    notificationService.restoreReminders();
  }, []);

  return (
    <HealthDataProvider>
      <AppContent />
    </HealthDataProvider>
  );
}

export default App;
