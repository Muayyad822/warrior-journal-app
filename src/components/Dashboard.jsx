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
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight mb-2">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">{displayName}</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Monitor patterns, track progress, and stay resilient.
          </p>
        </div>
      </div>
      
      
      
      {/* Emergency Kit Section - Always visible */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white rounded-3xl shadow-[0_8px_30px_rgb(177,45,83,0.2)] p-6 sm:p-8 text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-white/10 transition-colors duration-700"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary-500/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-white/10 p-3 rounded-full mb-4 backdrop-blur-md border border-white/20">
            <AlertTriangle className="w-8 h-8 text-secondary-200" />
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-3 tracking-tight">
            Crisis Emergency Kit
          </h2>
          <p className="mb-8 text-primary-50 max-w-2xl mx-auto text-lg leading-relaxed">
            Quick access to emergency contacts, medical IDs, and crisis management tools during a pain episode.
          </p>
          <Link
            to="/emergency-kit"
            className="bg-white text-primary-700 hover:bg-primary-50 font-bold py-3.5 px-8 rounded-2xl text-lg transition-all shadow-[0_8px_20px_rgb(0,0,0,0.15)] hover:shadow-[0_12px_25px_rgb(0,0,0,0.2)] hover:-translate-y-1 active:translate-y-0"
          >
            Access Emergency Kit
          </Link>
        </div>
      </section>

      {/* Weather Widget */}
      <WeatherWidget />
      
      {/* Key Information Section */}
      <section className="glass-card p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center tracking-tight">
            <Activity className="w-6 h-6 mr-2.5 text-primary-500" />
            Health Tracking Summary
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-primary-50/80 p-6 rounded-3xl flex flex-col justify-center items-center text-center border border-primary-100/50 hover:bg-primary-50 transition-colors group">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-primary-500 mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Journal Entries</p>
            <p className="text-4xl font-bold text-primary-600 mt-2 tracking-tight">
              {journalEntries.length}
            </p>
          </div>
          
          <div className="bg-secondary-50/80 p-6 rounded-3xl flex flex-col justify-center items-center text-center border border-secondary-100/50 hover:bg-secondary-50 transition-colors group">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-secondary-500 mb-4 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Crisis Episodes</p>
            <p className="text-4xl font-bold text-secondary-600 mt-2 tracking-tight">
              {crisisLogs.length}
            </p>
          </div>
          
          <div className="bg-teal-50/80 p-6 rounded-3xl flex flex-col justify-center items-center text-center border border-teal-100/50 hover:bg-teal-50 transition-colors group">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-teal-500 mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Today's Status</p>
            <div className="flex flex-col gap-2.5 w-full items-center">
              <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-teal-100 w-full max-w-[160px] flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500">Pain Level</span>
                <span className="text-sm font-bold text-teal-700">{todaysStatus.painLevel}/10</span>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm border border-teal-100 w-full max-w-[160px] flex justify-between items-center">
                <span className="flex items-center text-teal-600 font-semibold text-xs">
                  <Droplets className="w-3.5 h-3.5 mr-1" />
                  {todaysStatus.hydration}
                </span>
                <button 
                  onClick={addWaterIntake}
                  className="bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg p-1.5 transition-colors"
                  title="Add water intake"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reminder Status Section */}
      <section className="glass-card p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center tracking-tight">
            <Bell className="w-6 h-6 mr-2.5 text-primary-500" />
            Daily Reminders
          </h2>
          <Link
            to="/settings"
            className="w-full sm:w-auto text-center px-5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-2xl transition-all shadow-sm"
          >
            Manage Reminders
          </Link>
        </div>
        
        <div className="flex items-center gap-8 mb-2">
          <div className="flex items-center gap-4 bg-primary-50/50 px-5 py-3 rounded-2xl border border-primary-100">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-primary-600 font-bold text-xl">
              {activeReminders.length}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-700">Active Tasks</div>
              <div className="text-xs text-slate-500 font-medium">Scheduled for today</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
            <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm ${notificationsEnabled ? 'text-teal-500' : 'text-slate-400'}`}>
              {notificationsEnabled ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-700">Notifications</div>
              <div className="text-xs text-slate-500 font-medium">{notificationsEnabled ? 'Enabled' : 'Disabled'}</div>
            </div>
          </div>
        </div>

        {activeReminders.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Today's Schedule</h3>
            <div className="flex flex-wrap gap-2.5">
              {activeReminders.slice(0, 3).map((reminder) => (
                <div key={reminder.id} className="flex items-center bg-white shadow-sm border border-slate-200 text-slate-700 px-3 py-2 rounded-xl text-sm">
                  <span className="mr-2.5 p-1.5 bg-primary-50 rounded-lg text-primary-600">
                    {reminder.type === 'medication' ? <Pill className="w-4 h-4" /> :
                     reminder.type === 'water' ? <Droplets className="w-4 h-4" /> :
                     reminder.type === 'health-check' ? <FileText className="w-4 h-4" /> :
                     reminder.type === 'exercise' ? <Activity className="w-4 h-4" /> :
                     reminder.type === 'appointment' ? <Calendar className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-primary-600">{reminder.time}</span>
                    <span className="truncate max-w-[120px] font-semibold text-[13px]">{reminder.title}</span>
                  </div>
                </div>
              ))}
              {activeReminders.length > 3 && (
                <div className="flex items-center bg-slate-50 border border-slate-200 text-slate-500 px-4 py-2 rounded-xl text-sm font-semibold">
                  +{activeReminders.length - 3} more
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="glass-card p-6 lg:p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6 tracking-tight">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Link
            to="/journal"
            className="group bg-gradient-to-br from-teal-500 to-teal-600 text-white p-5 rounded-3xl text-center transition-all hover:shadow-[0_12px_25px_rgb(20,184,166,0.3)] hover:-translate-y-1 flex flex-col items-center justify-center min-h-[150px] relative overflow-hidden border border-teal-400/50"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-white/0 group-hover:bg-white/10 transition-colors"></div>
            <div className="p-3.5 bg-white/20 rounded-2xl mb-3 group-hover:scale-110 transition-transform backdrop-blur-sm shadow-sm">
                <FileText className="w-7 h-7" />
            </div>
            <div className="font-bold text-sm tracking-wide">Daily Journal</div>
          </Link>
          <Link
            to="/crisis-log"
            className="group bg-gradient-to-br from-secondary-500 to-secondary-600 text-white p-5 rounded-3xl text-center transition-all hover:shadow-[0_12px_25px_rgb(255,106,31,0.3)] hover:-translate-y-1 flex flex-col items-center justify-center min-h-[150px] relative overflow-hidden border border-secondary-400/50"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-white/0 group-hover:bg-white/10 transition-colors"></div>
            <div className="p-3.5 bg-white/20 rounded-2xl mb-3 group-hover:scale-110 transition-transform backdrop-blur-sm shadow-sm">
                <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="font-bold text-sm tracking-wide">Log Crisis</div>
          </Link>
          <Link
            to="/analytics"
            className="group bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-5 rounded-3xl text-center transition-all hover:shadow-[0_12px_25px_rgb(99,102,241,0.3)] hover:-translate-y-1 flex flex-col items-center justify-center min-h-[150px] relative overflow-hidden border border-indigo-400/50"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-white/0 group-hover:bg-white/10 transition-colors"></div>
            <div className="p-3.5 bg-white/20 rounded-2xl mb-3 group-hover:scale-110 transition-transform backdrop-blur-sm shadow-sm">
                <BarChart3 className="w-7 h-7" />
            </div>
            <div className="font-bold text-sm tracking-wide">Analytics</div>
          </Link>
          <Link
            to="/medical-reports"
            className="group bg-gradient-to-br from-primary-500 to-primary-600 text-white p-5 rounded-3xl text-center transition-all hover:shadow-[0_12px_25px_rgb(202,70,107,0.3)] hover:-translate-y-1 flex flex-col items-center justify-center min-h-[150px] relative overflow-hidden border border-primary-400/50"
          >
             <div className="absolute top-0 left-0 w-full h-full bg-white/0 group-hover:bg-white/10 transition-colors"></div>
            <div className="p-3.5 bg-white/20 rounded-2xl mb-3 group-hover:scale-110 transition-transform backdrop-blur-sm shadow-sm">
                <Clipboard className="w-7 h-7" />
            </div>
            <div className="font-bold text-sm tracking-wide">Medical Reports</div>
          </Link>
          
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
