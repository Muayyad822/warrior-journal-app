import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealthData } from '../context/HealthDataContext';
import toast from 'react-hot-toast';

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

    toast.success('Crisis log saved successfully!');
    navigate('/dashboard'); // Go back to dashboard after saving
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Crisis Log - Emergency Tracking</h2>
      <p className="mb-6 text-slate-600">Record details during pain crises or health emergencies to identify triggers and patterns.</p>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
        {/* Crisis Severity */}
        <div>
          <label htmlFor="severity" className="block text-lg font-medium text-slate-700 mb-2">
            Crisis Severity (0-10)
          </label>
          <div className="relative">
             <input
              type="range"
              id="severity"
              min="0"
              max="10"
              value={severity}
              onChange={(e) => setSeverity(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
          </div>
          <div className="text-center mt-2 text-xl font-bold text-rose-600">{severity}/10</div>
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className="block text-lg font-medium text-slate-700 mb-2">
            Duration of Crisis
          </label>
          <input
            type="text"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="glass-input w-full px-4 py-3"
            placeholder="e.g., 4 hours, 1 day, 30 minutes"
            required
          />
        </div>

        {/* Triggers */}
        <div>
          <label className="block text-lg font-medium text-slate-700 mb-2">
            Possible Triggers
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {commonTriggers.map((trigger) => (
              <label key={trigger} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${triggers.includes(trigger) ? 'bg-rose-50 border-rose-200 text-rose-700 font-medium' : 'bg-white/50 border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <input
                  type="checkbox"
                  id={`trigger-${trigger}`}
                  value={trigger}
                  checked={triggers.includes(trigger)}
                  onChange={handleTriggerChange}
                  className="w-4 h-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500 mr-2"
                />
                {trigger}
              </label>
            ))}
          </div>
        </div>

        {/* Medications Used */}
        <div>
          <label htmlFor="medicationsUsed" className="block text-lg font-medium text-slate-700 mb-2">
            Medications Used During Crisis
          </label>
          <textarea
            id="medicationsUsed"
            rows="3"
            value={medicationsUsed}
            onChange={(e) => setMedicationsUsed(e.target.value)}
            className="glass-input w-full px-4 py-3"
            placeholder="e.g., Hydroxyurea (200mg), IV fluids, Painkillers"
          ></textarea>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-lg font-medium text-slate-700 mb-2">
            Location of Crisis
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="glass-input w-full px-4 py-3"
            placeholder="e.g., Home, Hospital, Work"
          />
        </div>

        {/* Circumstances */}
        <div>
          <label htmlFor="circumstances" className="block text-lg font-medium text-slate-700 mb-2">
            Circumstances / Notes
          </label>
          <textarea
            id="circumstances"
            rows="4"
            value={circumstances}
            onChange={(e) => setCircumstances(e.target.value)}
            className="glass-input w-full px-4 py-3"
            placeholder="Describe what was happening, who was with you, etc."
          ></textarea>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full sm:w-auto bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-rose-500/30 transition-all transform hover:-translate-y-0.5"
          >
            Log Crisis Entry
          </button>
        </div>
      </form>
    </div>
  );
}

export default CrisisLog;
