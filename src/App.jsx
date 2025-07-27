import { Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import FloatingActionButton from './components/FloatingActionButton';
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

import { Analytics } from "@vercel/analytics/react"

const Home = () => {
  const { getDisplayName } = useHealthData();
  const displayName = getDisplayName();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">
      {/* <h1 className="text-4xl font-bold mb-6 text-gray-800">The Warrior's Journal</h1>
      <h2 className="text-2xl text-gray-700 mb-4">Sickle Cell Disease Management & Health Tracking</h2>
      <p className="text-xl text-gray-600 mb-4 text-center max-w-2xl">Your comprehensive digital health companion for managing sickle cell disease, tracking pain crises, and monitoring health patterns</p> */}
      <p className="text-lg text-blue-600 mb-8 font-medium">
        Welcome to your health journey, {displayName}!
      </p>
      <Link to="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">
        Start Health Tracking
      </Link>
      
      {/* SEO Content Section */}
      {/* <div className="mt-12 max-w-4xl text-center space-y-6">
        <h3 className="text-2xl font-semibold text-gray-800">Comprehensive Sickle Cell Disease Management</h3>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-blue-600 mb-2">Crisis Tracking</h4>
            <p className="text-gray-600">Log and monitor pain crises, identify triggers, and track patterns to better manage your sickle cell disease.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-blue-600 mb-2">Health Journal</h4>
            <p className="text-gray-600">Daily health tracking including pain levels, medications, hydration, and symptoms for comprehensive care.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-blue-600 mb-2">Emergency Tools</h4>
            <p className="text-gray-600">Quick access to emergency contacts, crisis action plans, and medical information when you need it most.</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

const AppContent = () => {
  const { hasCompletedOnboarding } = useHealthData();

  if (!hasCompletedOnboarding) {
    return <OnboardingWelcome />;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/crisis-log" element={<CrisisLog />} />
          <Route path="/analytics" element={<Analyticss />} />
          <Route path="/motivation" element={<Motivation />} />
          <Route path="/medical-reports" element={<MedicalReports />} />
          <Route path="/emergency-kit" element={<EmergencyKit />} />
        </Routes>
      </main>
      {/* <FloatingActionButton /> */}
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
  return (
    <HealthDataProvider>
      <AppContent />
    </HealthDataProvider>
  );
}

export default App;


