import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealthData } from '../context/HealthDataContext';

function CrisisLog() {
  const navigate = useNavigate();
  const { addCrisisLog } = useHealthData();

  // State for each crisis log field
  const [severity, setSeverity] = useState(5); // 0-10 scale
  const [duration, setDuration] = useState(''); // e.g., "2 hours", "Half day"
  const [triggers, setTriggers] = useState([]);
  const [medicationsUsed, setMedicationsUsed] = useState('');
  const [location, setLocation] = useState('');
  const [circumstances, setCircumstances] = useState('');

  // Predefined options for common triggers (can be expanded)
  const commonTriggers = [
    'Stress', 'Dehydration', 'Weather Change', 'Infection', 'Physical Exertion',
    'Lack of Sleep', 'Emotional Distress', 'Dietary Factors', 'Cold Exposure'
  ];

  // Handler for trigger checkboxes
  const handleTriggerChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTriggers((prevTriggers) => [...prevTriggers, value]);
    } else {
      setTriggers((prevTriggers) =>
        prevTriggers.filter((trigger) => trigger !== value)
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a crisis log object
    const newCrisisLog = {
      id: Date.now(), // Unique ID
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), // HH:MM AM/PM
      severity,
      duration,
      triggers,
      medicationsUsed,
      location,
      circumstances,
    };

    addCrisisLog(newCrisisLog); // Save the log using the context function

    console.log("Saving Crisis Log:", newCrisisLog);

    // Optionally, clear the form after submission
    setSeverity(5);
    setDuration('');
    setTriggers([]);
    setMedicationsUsed('');
    setLocation('');
    setCircumstances('');

    alert('Crisis log saved successfully!');
    navigate('/dashboard'); // Go back to dashboard after saving
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Crisis Log - Emergency Tracking</h2>
      <p className="mb-6 text-gray-600">Record details during pain crises or health emergencies to identify triggers and patterns.</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Crisis Severity */}
        <div>
          <label htmlFor="severity" className="block text-lg font-medium text-gray-700 mb-2">
            Crisis Severity (0-10)
          </label>
          <input
            type="range"
            id="severity"
            min="0"
            max="10"
            value={severity}
            onChange={(e) => setSeverity(parseInt(e.target.value))}
            className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer range-lg"
          />
          <div className="text-center mt-2 text-xl font-semibold text-red-600">{severity}/10</div>
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className="block text-lg font-medium text-gray-700 mb-2">
            Duration of Crisis (e.g., "2 hours", "Half day")
          </label>
          <input
            type="text"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-lg"
            placeholder="e.g., 4 hours, 1 day, 30 minutes"
            required
          />
        </div>

        {/* Triggers */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Possible Triggers
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {commonTriggers.map((trigger) => (
              <div key={trigger} className="flex items-center">
                <input
                  type="checkbox"
                  id={`trigger-${trigger}`}
                  value={trigger}
                  checked={triggers.includes(trigger)}
                  onChange={handleTriggerChange}
                  className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor={`trigger-${trigger}`} className="ml-2 block text-base text-gray-900">
                  {trigger}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Medications Used */}
        <div>
          <label htmlFor="medicationsUsed" className="block text-lg font-medium text-gray-700 mb-2">
            Medications Used During Crisis
          </label>
          <textarea
            id="medicationsUsed"
            rows="3"
            value={medicationsUsed}
            onChange={(e) => setMedicationsUsed(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-lg"
            placeholder="e.g., Hydroxyurea (200mg), IV fluids, Painkillers"
          ></textarea>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-lg font-medium text-gray-700 mb-2">
            Location of Crisis
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-lg"
            placeholder="e.g., Home, Hospital, Work"
          />
        </div>

        {/* Circumstances */}
        <div>
          <label htmlFor="circumstances" className="block text-lg font-medium text-gray-700 mb-2">
            Circumstances / Notes
          </label>
          <textarea
            id="circumstances"
            rows="4"
            value={circumstances}
            onChange={(e) => setCircumstances(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-lg"
            placeholder="Describe what was happening, who was with you, etc."
          ></textarea>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Log Crisis
          </button>
        </div>
      </form>
    </div>
  );
}

export default CrisisLog;