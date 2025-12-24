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
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">App Settings</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="md:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
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
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[400px]">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Profile Settings</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                <div className="flex max-w-md gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                  <button
                    onClick={handleSaveName}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" /> Save
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">This name is used throughout the app to personalize your experience.</p>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">Notification Preferences</h2>
              {/* Embed existing component, but maybe we can strip its header if it has one, or just let it be. 
                  ReminderSettings has its own container styling which might nest oddly. 
                  Let's strip the container styling from ReminderSettings via CSS or just accept it.
                  The user asked to "implement it", reusing is safest. */}
              <div className="-m-4 sm:-m-6"> {/* Negative margin hack to offset ReminderSettings padding if needed, or just let it sit */}
                 <ReminderSettings />
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Data Management</h2>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-red-800 mb-2">Danger Zone</h3>
                <p className="text-red-600 text-sm mb-4">
                  This action will permanently delete all your journal entries, crisis logs, settings, and profile data from this device.
                </p>
                <button
                  onClick={handleClearData}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Clear All App Data
                </button>
              </div>
              
              <div className="mt-4">
                 <h3 className="text-lg font-medium text-gray-800 mb-2">Export Data</h3>
                 <p className="text-gray-600 text-sm mb-3">You can export your health data to PDF in the Medical Reports section.</p>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">About App</h2>
              <div className="prose text-gray-600">
                <p><strong>The Warrior's Journal</strong> v1.0.0</p>
                <p>A specialized health tracking companion for Sickle Cell Warriors.</p>
                <p>
                  Built with ❤️ by <a href="https://abdulmuizjimoh.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Muayyad</a>.
                </p>
                <p className="text-sm mt-4">
                  Note: This application stores all data locally on your device. Clearing your browser cache may remove your data unless PWA persistence is active.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
