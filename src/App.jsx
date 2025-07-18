import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
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
              <Route path="/dashboard" element={<Dashboard />} /> {/* Use the actual Dashboard component */}
              <Route path="/journal" element={<Journal />} />
              <Route path="/crisis-log" element={<CrisisLog />} />
              <Route path="/analytics" element={<Analyticss />} />
              <Route path="/motivation" element={<Motivation />} />
              <Route path="/medical-reports" element={<MedicalReports />} /> {/* Add route for Medical Reports */}
              <Route path="/emergency-kit" element={<EmergencyKit />} /> {/* Add route for full Emergency Kit */}
            </Routes>
          </main>
          <FloatingActionButton />
          <Footer />
          <PWAInstallPrompt />
        </div>
      </HealthDataProvider>
  );
}

export default App;
