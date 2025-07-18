import { Link } from "react-router-dom";
import { useHealthData } from "../context/HealthDataContext"; // Import the custom hook

function Dashboard() {
  const { journalEntries, crisisLogs } = useHealthData(); // Use the context data

  // Calculate today's status (simplified for now, actual logic might be more complex)
  const today = new Date().toISOString().split("T")[0];
  const todaysEntry = journalEntries.find((entry) => entry.date === today);

  const todaysStatus = {
    painLevel: todaysEntry ? todaysEntry.painLevel : "0",
    mood: todaysEntry ? todaysEntry.mood : "0",
    hydration: todaysEntry ? todaysEntry.hydration : "0",
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Dashboard - Your Health Command Center
      </h2>
      {/* Emergency Kit Section - Always visible */}
      <section className="bg-red-700 text-white rounded-lg shadow-lg p-6 mb-6 text-center">
        <h3 className="text-xl font-semibold mb-4 flex items-center justify-center">
          🚨 Emergency Kit
        </h3>
        <p className="mb-4">Quick access to alerting your family during a crisis.</p>
        
          <div className="w-full max-w-xs mx-auto">
            <Link
              to="/emergency-kit"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>Crisis Alert Button</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </Link>
          </div>
          {/* <Link
            to="/emergency-kit"
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-md text-center transition-colors flex items-center justify-center space-x-2"
          >
            <span>Emergency Contacts</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
              ></path>
            </svg>
          </Link>
          <Link
            to="/emergency-kit"
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-md text-center transition-colors flex items-center justify-center space-x-2"
          >
            <span>Action Plan</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.007 12.007 0 002.944 12c.048.755.15 1.5.304 2.222.183.872.446 1.722.793 2.531.689 1.638 1.83 3.078 3.407 4.204.646.456 1.344.856 2.083 1.214C10.07 22.794 11.025 23 12 23s1.93-.206 2.863-.647c.739-.358 1.437-.758 2.083-1.214 1.577-1.126 2.718-2.566 3.407-4.204.347-.809.61-1.659.793-2.531.154-.722.256-1.467.304-2.222A12.007 12.007 0 0021.056 12a11.955 11.955 0 01-3.04-8.618z"
              ></path>
            </svg>
          </Link> */}
        
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
            </p>{" "}
            {/* Use actual count */}
          </div>
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Crisis Episodes Recorded</p>
            <p className="text-3xl font-bold text-red-700">
              {crisisLogs.length}
            </p>{" "}
            {/* Use actual count */}
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
            <div className="text-indigo-600 text-3xl">📊</div>{" "}
            {/* Emoji icon */}
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
            <div className="text-purple-600 text-3xl">😊</div>{" "}
            {/* Emoji icon */}
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
            <div className="text-yellow-600 text-3xl">🏃‍♀️</div>{" "}
            {/* Emoji icon */}
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

      {/* Medical Reports Section - Direct link for doctors */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Medical Reports
        </h3>
        <p className="mb-4">
          Generate comprehensive reports for medical appointments and family
          sharing.
        </p>
        <Link
          to="/medical-reports"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md transition-colors inline-flex items-center space-x-2"
        >
          <span>Export Report for Doctor</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
        </Link>
      </section>
    </div>
  );
}

export default Dashboard;
