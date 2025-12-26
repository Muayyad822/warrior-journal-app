import { useState } from 'react';
import { useHealthData } from '../context/HealthDataContext';
import ReminderSettings from './ReminderSettings';
import toast from 'react-hot-toast';
import { User, Bell, Database, Info, Trash2, Save } from 'lucide-react';

function Settings() {
  const { getDisplayName, updateUserName } = useHealthData();
  const [activeTab, setActiveTab] = useState('profile');
  const [nameInput, setNameInput] = useState(getDisplayName());

  const handleSaveName = () => {
    const trimmedName = nameInput.trim();
    if (trimmedName.length > 0 && trimmedName.length < 2) {
      toast.error('Name must be at least 2 characters long');
      return;
    }
    if (trimmedName.length > 50) {
      toast.error('Name must be less than 50 characters');
      return;
    }
    updateUserName(trimmedName);
    toast.success('Profile name updated successfully!');
  };

  const handleClearData = () => {
    if (window.confirm('Are you definitely sure? This will delete ALL your journal entries, logs, and settings. This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data Management', icon: Database },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">App Settings</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="md:w-64 flex-shrink-0">
          <nav className="flex md:flex-col overflow-x-auto md:overflow-visible gap-2 pb-4 md:pb-0 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center whitespace-nowrap px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                      : 'bg-white/40 text-slate-600 hover:bg-white/60 hover:text-slate-800 backdrop-blur-sm'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-card p-6 min-h-[400px]">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Profile Settings</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Display Name</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="glass-input flex-1 px-4 py-2.5"
                    placeholder="Enter your name"
                  />
                  <button
                    onClick={handleSaveName}
                    className="btn-primary flex items-center justify-center px-6 py-2.5"
                  >
                    <Save className="w-4 h-4 mr-2" /> Save
                  </button>
                </div>
                <p className="mt-2 text-sm text-slate-500">This name is used throughout the app to personalize your experience.</p>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">Notification Preferences</h2>
              <div className="-mx-4 sm:-mx-6 -my-4">
                 <ReminderSettings />
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Data Management</h2>
              
              <div className="bg-red-50/50 border border-red-100 rounded-xl p-5 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-red-700 mb-2">Danger Zone</h3>
                <p className="text-red-600/80 text-sm mb-4">
                  This action will permanently delete all your journal entries, crisis logs, settings, and profile data from this device.
                </p>
                <button
                  onClick={handleClearData}
                  className="inline-flex items-center px-4 py-2 border border-red-200 text-sm font-medium rounded-lg text-red-700 bg-red-100/50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Clear All App Data
                </button>
              </div>
              
              <div className="mt-4">
                 <h3 className="text-lg font-bold text-slate-800 mb-2">Export Data</h3>
                 <p className="text-slate-600 text-sm mb-3">You can export your health data to PDF in the Medical Reports section.</p>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">About App</h2>
              <div className="prose text-slate-600">
                <p><strong className="text-slate-800">The Warrior's Journal</strong> v1.0.0</p>
                <p>A specialized health tracking companion for Sickle Cell Warriors.</p>
                <p>
                  Built with ❤️ by <a href="https://abdulmuizjimoh.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline font-medium">Muayyad</a>.
                </p>
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mt-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This application stores all data locally on your device. Clearing your browser cache may remove your data unless PWA persistence is active.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
