import { Link } from "react-router-dom";
import { useHealthData } from "../context/HealthDataContext";
import notificationService from "../services/NotificationService";
import { AlertTriangle, Bell, Check, X, Pill, Droplets, FileText, Activity, Calendar, BarChart3, Clipboard, Plus } from 'lucide-react';
import WeatherWidget from './WeatherWidget';
import ReportGenerator from './ReportGenerator';

function Dashboard() {
  const { journalEntries, crisisLogs, getDisplayName, addWaterIntake } = useHealthData();
  const displayName = getDisplayName();

  // Get reminder status
  const reminders = notificationService.getAllReminders();
  const activeReminders = reminders.filter(r => r.enabled);
  const notificationsEnabled = notificationService.getPermissionStatus() === 'granted';

  // Calculate today's status
  const today = new Date().toISOString().split("T")[0];
  const todaysEntry = journalEntries.find((entry) => entry.date === today);

  const todaysStatus = {
    painLevel: todaysEntry ? todaysEntry.painLevel : "0",
    mood: todaysEntry ? todaysEntry.mood : "0",
    hydration: todaysEntry ? todaysEntry.hydration : "0",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {displayName}'s Health Management
          </h1>
          <p className="text-lg text-gray-600">
            Welcome back! Monitor your health patterns and manage your health effectively.
          </p>
        </div>
      </div>
      
      
      
      {/* Emergency Kit Section - Always visible */}
      <section className="bg-red-700 text-white rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-xl font-semibold mb-4 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 mr-2" /> Crisis Emergency Kit
        </h2>
        <p className="mb-4">Quick access to emergency contacts and crisis management tools during sickle cell pain episodes.</p>
        <Link
          to="/emergency-kit"
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors inline-block"
        >
          Access Emergency Kit
        </Link>
      </section>

      {/* Weather Widget */}
      <WeatherWidget />
      
      {/* Key Information Section */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Health Tracking Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 p-4 rounded-md flex flex-col justify-center">
            <p className="text-sm text-gray-500">Total Journal Entries</p>
            <p className="text-3xl font-bold text-blue-700">
              {journalEntries.length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-md flex flex-col justify-center">
            <p className="text-sm text-gray-500">Pain Crisis Episodes</p>
            <p className="text-3xl font-bold text-red-700">
              {crisisLogs.length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-md flex flex-col justify-center items-center">
            <p className="text-sm text-gray-500 mb-2">Today's Status</p>
            <div className="flex flex-col gap-1 w-full max-w-[150px]">
              <p className="text-lg font-semibold text-green-700">
                Pain: {todaysStatus.painLevel}/10
              </p>
              <div className="flex items-center justify-between bg-white rounded-full px-3 py-1 shadow-sm mt-1">
                <span className="flex items-center text-blue-600 font-medium">
                  <Droplets className="w-4 h-4 mr-1" />
                  {todaysStatus.hydration}
                </span>
                <button 
                  onClick={addWaterIntake}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full p-1 transition-colors"
                  title="Add water intake"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reminder Status Section */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Daily Reminders
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{activeReminders.length}</div>
              <div className="text-sm text-gray-500">Active</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl ${notificationsEnabled ? 'text-green-600' : 'text-red-600'}`}>
                {notificationsEnabled ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </div>
              <div className="text-sm text-gray-500">
                {notificationsEnabled ? 'Enabled' : 'Disabled'}
              </div>
            </div>
          </div>
          <Link
            to="/settings"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
          >
            Manage Reminders
          </Link>
        </div>
        {activeReminders.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Today's Active Reminders:</h3>
            <div className="flex flex-wrap gap-2">
              {activeReminders.slice(0, 3).map((reminder) => (
                <div key={reminder.id} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  <span className="mr-1">
                    {reminder.type === 'medication' ? <Pill className="w-4 h-4" /> :
                     reminder.type === 'water' ? <Droplets className="w-4 h-4" /> :
                     reminder.type === 'health-check' ? <FileText className="w-4 h-4" /> :
                     reminder.type === 'exercise' ? <Activity className="w-4 h-4" /> :
                     reminder.type === 'appointment' ? <Calendar className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  </span>
                  <span className="mr-1">{reminder.time}</span>
                  <span className="truncate max-w-24">{reminder.title}</span>
                </div>
              ))}
              {activeReminders.length > 3 && (
                <div className="text-sm text-gray-500 px-2 py-1">
                  +{activeReminders.length - 3} more
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Health Management Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <Link
            to="/journal"
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors flex flex-col items-center justify-center min-h-[120px]"
          >
            <FileText className="text-3xl mb-3" />
            <div className="font-semibold">Daily Journal</div>
          </Link>
          <Link
            to="/crisis-log"
            className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg text-center transition-colors flex flex-col items-center justify-center min-h-[120px]"
          >
            <AlertTriangle className="text-3xl mb-3" />
            <div className="font-semibold">Log Crisis</div>
          </Link>
          <Link
            to="/analytics"
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition-colors flex flex-col items-center justify-center min-h-[120px]"
          >
            <BarChart3 className="text-3xl mb-3" />
            <div className="font-semibold">Analytics</div>
          </Link>
          <Link
            to="/medical-reports"
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center transition-colors flex flex-col items-center justify-center min-h-[120px]"
          >
            <Clipboard className="text-3xl mb-3" />
            <div className="font-semibold">Medical Reports</div>
          </Link>
          {/* Report Generation Button */}
          <ReportGenerator />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
