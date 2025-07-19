import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { HealthDataProvider } from './context/HealthDataContext';
import Footer from './components/Footer';

import { Analytics } from "@vercel/analytics/react"


const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">
    <h1 className="text-4xl font-bold mb-6 text-gray-800">The Warrior's Journal</h1>
    <p className="text-xl text-gray-600 mb-8">Your Digital Health Companion</p>
    <Link to="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">
      Start Your Journey
    </Link>
  </div>
);


function App() {
  return (
    <HealthDataProvider>
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
        <FloatingActionButton />
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
              duration: 3000,
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
    </HealthDataProvider>
  );
}

export default App;

