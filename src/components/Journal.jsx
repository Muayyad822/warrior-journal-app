import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealthData } from '../context/HealthDataContext'; // Import the custom hook

function Journal() {
  const navigate = useNavigate();
  const { addJournalEntry } = useHealthData(); // Get the addJournalEntry function from context

  // State for each journal entry field
  const [painLevel, setPainLevel] = useState(5);
  const [mood, setMood] = useState('');
  const [hydration, setHydration] = useState(0);
  const [sleepHours, setSleepHours] = useState(0);
  const [medications, setMedications] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [personalNotes, setPersonalNotes] = useState('');

  // Predefined options for mood and common symptoms
  const moodOptions = ['Excellent', 'Good', 'Neutral', 'Poor', 'Terrible'];
  const commonSymptoms = [
    'Fatigue', 'Joint Pain', 'Swelling', 'Fever', 'Headache',
    'Nausea', 'Shortness of Breath', 'Dizziness', 'Chest Pain', 'Abdominal Pain'
  ];

  // Handler for symptom checkboxes
  const handleSymptomChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSymptoms((prevSymptoms) => [...prevSymptoms, value]);
    } else {
      setSymptoms((prevSymptoms) =>
        prevSymptoms.filter((symptom) => symptom !== value)
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a journal entry object
    const newJournalEntry = {
      id: Date.now(), // Unique ID for the entry
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      painLevel,
      mood,
      hydration,
      sleepHours,
      medications,
      symptoms,
      personalNotes,
    };

    addJournalEntry(newJournalEntry); // Save the entry using the context function

    // Optionally, clear the form after submission
    setPainLevel(5);
    setMood('');
    setHydration(0);
    setSleepHours(0);
    setMedications('');
    setSymptoms([]);
    setPersonalNotes('');

    // Navigate back to dashboard or show a success message
    alert('Journal entry saved successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Daily Journal - Track Your Health</h2> 12]
      <p className="mb-6 text-gray-600">Record your daily health status to identify patterns and provide data for doctor visits.</p> 21]

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Pain Level */}
        <div>
          <label htmlFor="painLevel" className="block text-lg font-medium text-gray-700 mb-2">
            Pain Level (0-10)
          </label>
          <input
            type="range"
            id="painLevel"
            min="0"
            max="10"
            value={painLevel}
            onChange={(e) => setPainLevel(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
          />
          <div className="text-center mt-2 text-xl font-semibold text-blue-600">{painLevel}/10</div>
        </div>

        {/* Mood */}
        <div>
          <label htmlFor="mood" className="block text-lg font-medium text-gray-700 mb-2">
            Mood
          </label>
          <select
            id="mood"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-lg rounded-md shadow-sm"
            required
          >
            <option value="">Select your mood</option>
            {moodOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Hydration */}
        <div>
          <label htmlFor="hydration" className="block text-lg font-medium text-gray-700 mb-2">
            Hydration (glasses of water)
          </label>
          <input
            type="number"
            id="hydration"
            min="0"
            value={hydration}
            onChange={(e) => setHydration(parseInt(e.target.value) || 0)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
          />
        </div>

        {/* Sleep Hours */}
        <div>
          <label htmlFor="sleepHours" className="block text-lg font-medium text-gray-700 mb-2">
            Sleep Hours
          </label>
          <input
            type="number"
            id="sleepHours"
            min="0"
            step="0.5"
            value={sleepHours}
            onChange={(e) => setSleepHours(parseFloat(e.target.value) || 0)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
          />
        </div>

        {/* Medications Taken */}
        <div>
          <label htmlFor="medications" className="block text-lg font-medium text-gray-700 mb-2">
            Medications Taken
          </label>
          <textarea
            id="medications"
            rows="3"
            value={medications}
            onChange={(e) => setMedications(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
            placeholder="e.g., Tylenol (2 pills), Folic Acid (1 tab)"
          ></textarea>
        </div>

        {/* Symptoms Experienced */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Symptoms Experienced
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {commonSymptoms.map((symptom) => (
              <div key={symptom} className="flex items-center">
                <input
                  type="checkbox"
                  id={`symptom-${symptom}`}
                  value={symptom}
                  checked={symptoms.includes(symptom)}
                  onChange={handleSymptomChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={`symptom-${symptom}`} className="ml-2 block text-base text-gray-900">
                  {symptom}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Notes */}
        <div>
          <label htmlFor="personalNotes" className="block text-lg font-medium text-gray-700 mb-2">
            Personal Notes
          </label>
          <textarea
            id="personalNotes"
            rows="4"
            value={personalNotes}
            onChange={(e) => setPersonalNotes(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
            placeholder="Write a brief note about your day..."
          ></textarea>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Entry
          </button>
        </div>
      </form>
    </div>
  );
}

export default Journal;