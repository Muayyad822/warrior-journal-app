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
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        {displayName}'s Health Command Center
      </h2>
      <p className="text-lg text-gray-600 mb-6">
        Welcome back, {displayName}! Here's your health overview.
      </p>
      
      {/* Emergency Kit Section - Always visible */}
      <section className="bg-red-700 text-white rounded-lg shadow-lg p-6 mb-6 text-center">
        <h3 className="text-xl font-semibold mb-4 flex items-center justify-center">
          🚨 Emergency Kit
        </h3>
        <p className="mb-4">Quick access to alerting your family during a crisis.</p>
        <Link
          to="/emergency-kit"
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors inline-block"
        >
          Access Emergency Kit
        </Link>
      </section>
      
      {/* Key Information Section */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Key Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Total Journal Entries</p>
            <p className="text-3xl font-bold text-blue-700">
              {journalEntries.length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Crisis Episodes Recorded</p>
            <p className="text-3xl font-bold text-red-700">
              {crisisLogs.length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Today's Status</p>
            <p className="text-xl font-bold text-green-700">
              Pain: {todaysStatus.painLevel}/10 <br /> Mood: {todaysStatus.mood}
            </p>
            <p className="text-md text-green-600">
              Hydration: {todaysStatus.hydration} glasses
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Quick Stats
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 bg-indigo-50 p-4 rounded-md">
            <div className="text-indigo-600 text-3xl">📊</div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                Average Pain Level (Last 7 Days)
              </p>
              <p className="text-2xl font-bold text-indigo-800">
                {/* TODO: Calculate average from journalEntries */ "-"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-purple-50 p-4 rounded-md">
            <div className="text-purple-600 text-3xl">😊</div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                Most Frequent Mood
              </p>
              <p className="text-2xl font-bold text-purple-800">
                {/* TODO: Calculate from journalEntries */ "-"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-yellow-50 p-4 rounded-md">
            <div className="text-yellow-600 text-3xl">🏃‍♀️</div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                Recent Activity
              </p>
              <p className="text-2xl font-bold text-yellow-800">
                {/* TODO: Extract from personal notes/symptoms */ "-"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/journal"
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors"
          >
            <div className="text-2xl mb-2">📝</div>
            <div className="font-semibold">Add Journal Entry</div>
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
            <div className="text-2xl mb-2">📈</div>
            <div className="font-semibold">View Analytics</div>
          </Link>
          <Link
            to="/motivation"
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center transition-colors"
          >
            <div className="text-2xl mb-2">💪</div>
            <div className="font-semibold">Get Motivated</div>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
