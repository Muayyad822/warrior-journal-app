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
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
            {displayName}'s Health Manager
          </h1>
          <p className="text-lg text-slate-500">
            Monitor patterns, track progress, and stay resilient.
          </p>
        </div>
      </div>
      
      
      
      {/* Emergency Kit Section - Always visible */}
      {/* Emergency Kit Section - Always visible */}
      <section className="bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-3xl shadow-xl shadow-rose-500/20 p-6 sm:p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-white/5 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent pointer-events-none"></div>
        <h2 className="text-2xl font-bold mb-4 flex items-center justify-center relative z-10">
          <AlertTriangle className="w-8 h-8 mr-3" /> Crisis Emergency Kit
        </h2>
        <p className="mb-6 text-rose-50 max-w-2xl mx-auto relative z-10 text-lg">Quick access to emergency contacts and crisis management tools during sickle cell pain episodes.</p>
        <Link
          to="/emergency-kit"
          className="bg-white text-rose-700 hover:bg-rose-50 font-bold py-3 px-8 rounded-full text-lg transition-all shadow-lg active:scale-95 inline-block relative z-10"
        >
          Access Emergency Kit
        </Link>
      </section>

      {/* Weather Widget */}
      <WeatherWidget />
      
      {/* Key Information Section */}
      {/* Key Information Section */}
      <section className="glass-card p-6 lg:p-8">
        <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-primary-500" />
          Health Tracking Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-primary-50/50 p-6 rounded-2xl flex flex-col justify-center items-center text-center border border-primary-100 hover:border-primary-200 transition-colors">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Journal Entries</p>
            <p className="text-4xl font-bold text-primary-600 mt-2">
              {journalEntries.length}
            </p>
          </div>
          <div className="bg-rose-50/50 p-6 rounded-2xl flex flex-col justify-center items-center text-center border border-rose-100 hover:border-rose-200 transition-colors">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Pain Crisis Episodes</p>
            <p className="text-4xl font-bold text-rose-600 mt-2">
              {crisisLogs.length}
            </p>
          </div>
          <div className="bg-teal-50/50 p-6 rounded-2xl flex flex-col justify-center items-center text-center border border-teal-100 hover:border-teal-200 transition-colors">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Today's Status</p>
            <div className="flex flex-col gap-2 w-full items-center">
              <p className="text-xl font-bold text-teal-700">
                Pain: {todaysStatus.painLevel}/10
              </p>
              <div className="flex items-center justify-between bg-white rounded-full px-4 py-1.5 shadow-sm border border-teal-100 w-full max-w-[140px]">
                <span className="flex items-center text-teal-600 font-medium">
                  <Droplets className="w-4 h-4 mr-1.5" />
                  {todaysStatus.hydration}
                </span>
                <button 
                  onClick={addWaterIntake}
                  className="bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-full p-1 transition-colors ml-2"
                  title="Add water intake"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reminder Status Section */}
      <section className="glass-card p-6 lg:p-8">
        <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center">
          <Bell className="w-5 h-5 mr-2 text-primary-500" />
          Daily Reminders
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{activeReminders.length}</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">Active</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl flex justify-center ${notificationsEnabled ? 'text-teal-500' : 'text-rose-500'}`}>
                {notificationsEnabled ? <Check className="w-8 h-8" /> : <X className="w-8 h-8" />}
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                {notificationsEnabled ? 'Enabled' : 'Disabled'}
              </div>
            </div>
          </div>
          <Link
            to="/settings"
            className="w-full sm:w-auto text-center px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
          >
            Manage Reminders
          </Link>
        </div>
        {activeReminders.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wide">Today's Active Reminders:</h3>
            <div className="flex flex-wrap gap-2">
              {activeReminders.slice(0, 3).map((reminder) => (
                <div key={reminder.id} className="flex items-center bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg text-sm border border-primary-100">
                  <span className="mr-2 opacity-70">
                    {reminder.type === 'medication' ? <Pill className="w-3.5 h-3.5" /> :
                     reminder.type === 'water' ? <Droplets className="w-3.5 h-3.5" /> :
                     reminder.type === 'health-check' ? <FileText className="w-3.5 h-3.5" /> :
                     reminder.type === 'exercise' ? <Activity className="w-3.5 h-3.5" /> :
                     reminder.type === 'appointment' ? <Calendar className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                  </span>
                  <span className="mr-2 font-mono text-xs bg-white px-1.5 rounded text-primary-600">{reminder.time}</span>
                  <span className="truncate max-w-24 font-medium">{reminder.title}</span>
                </div>
              ))}
              {activeReminders.length > 3 && (
                <div className="text-xs font-medium text-slate-400 px-2 py-1.5 flex items-center">
                  +{activeReminders.length - 3} more
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="glass-card p-6 lg:p-8">
        <h2 className="text-xl font-bold text-slate-700 mb-6">Health Management Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Link
            to="/journal"
            className="group bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-2xl text-center transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col items-center justify-center min-h-[140px]"
          >
            <div className="p-3 bg-white/20 rounded-full mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
            </div>
            <div className="font-semibold text-sm">Daily Journal</div>
          </Link>
          <Link
            to="/crisis-log"
            className="group bg-gradient-to-br from-rose-500 to-rose-600 text-white p-4 rounded-2xl text-center transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col items-center justify-center min-h-[140px]"
          >
             <div className="p-3 bg-white/20 rounded-full mb-3 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="font-semibold text-sm">Log Crisis</div>
          </Link>
          <Link
            to="/analytics"
            className="group bg-gradient-to-br from-teal-500 to-teal-600 text-white p-4 rounded-2xl text-center transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col items-center justify-center min-h-[140px]"
          >
            <div className="p-3 bg-white/20 rounded-full mb-3 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
            </div>
            <div className="font-semibold text-sm">Analytics</div>
          </Link>
          <Link
            to="/medical-reports"
            className="group bg-gradient-to-br from-violet-500 to-violet-600 text-white p-4 rounded-2xl text-center transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col items-center justify-center min-h-[140px]"
          >
            <div className="p-3 bg-white/20 rounded-full mb-3 group-hover:scale-110 transition-transform">
                <Clipboard className="w-6 h-6" />
            </div>
            <div className="font-semibold text-sm">Medical Reports</div>
          </Link>
          {/* Report Generation Button - Custom Styling wrapped in helper or direct */}
          <ReportGenerator />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
