import { Link } from "react-router-dom";
import { useHealthData } from "../context/HealthDataContext";

function Dashboard() {
  const { journalEntries, crisisLogs, getDisplayName } = useHealthData();
  const displayName = getDisplayName();

  // Calculate today's status
  const today = new Date().toISOString().split("T")[0];
  const todaysEntry = journalEntries.find((entry) => entry.date === today);

  const todaysStatus = {
    painLevel: todaysEntry ? todaysEntry.painLevel : "0",
    mood: todaysEntry ? todaysEntry.mood : "0",
    hydration: todaysEntry ? todaysEntry.hydration : "0",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        {displayName}'s Health Management Dashboard
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Welcome back, {displayName}! <br /> Monitor your health patterns and manage your health effectively.
      </p>
      
      {/* Emergency Kit Section - Always visible */}
      <section className="bg-red-700 text-white rounded-lg shadow-lg p-6 mb-6 text-center">
        <h2 className="text-xl font-semibold mb-4 flex items-center justify-center">
          🚨 Crisis Emergency Kit
        </h2>
        <p className="mb-4">Quick access to emergency contacts and crisis management tools during sickle cell pain episodes.</p>
        <Link
          to="/emergency-kit"
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors inline-block"
        >
          Access Emergency Kit
        </Link>
      </section>
      
      {/* Key Information Section */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Health Tracking Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Total Health Journal Entries</p>
            <p className="text-3xl font-bold text-blue-700">
              {journalEntries.length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Pain Crisis Episodes Logged</p>
            <p className="text-3xl font-bold text-red-700">
              {crisisLogs.length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Today's Health Status</p>
            <p className="text-lg font-semibold text-green-700">
              Pain: {todaysStatus.painLevel}/10
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Health Management Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/journal"
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors"
          >
            <div className="text-2xl mb-2">📝</div>
            <div className="font-semibold">Daily Health Journal</div>
          </Link>
          <Link
            to="/crisis-log"
            className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg text-center transition-colors"
          >
            <div className="text-2xl mb-2">🚨</div>
            <div className="font-semibold">Log Crisis Episode</div>
          </Link>
          <Link
            to="/analytics"
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition-colors"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold">Health Analytics</div>
          </Link>
          <Link
            to="/medical-reports"
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center transition-colors"
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="font-semibold">Medical Reports</div>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
