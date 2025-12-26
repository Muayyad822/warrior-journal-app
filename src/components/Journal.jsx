import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealthData } from '../context/HealthDataContext'; // Import the custom hook
import toast from 'react-hot-toast';

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
    toast.success('Journal entry saved successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Daily Journal - Track Your Health</h2>
      <p className="mb-6 text-slate-600">Record your daily health status to identify patterns and provide data for doctor visits.</p> 

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
        {/* Pain Level */}
        <div>
          <label htmlFor="painLevel" className="block text-lg font-medium text-slate-700 mb-2">
            Pain Level (0-10)
          </label>
          <div className="relative">
             <input
              type="range"
              id="painLevel"
              min="0"
              max="10"
              value={painLevel}
              onChange={(e) => setPainLevel(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
          </div>
          <div className="text-center mt-2 text-xl font-bold text-primary-600">{painLevel}/10</div>
        </div>

        {/* Mood */}
        <div>
          <label htmlFor="mood" className="block text-lg font-medium text-slate-700 mb-2">
            Mood
          </label>
          <div className="relative">
            <select
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="glass-input w-full px-4 py-3 appearance-none"
              required
            >
              <option value="">Select your mood</option>
              {moodOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Hydration */}
        <div>
          <label htmlFor="hydration" className="block text-lg font-medium text-slate-700 mb-2">
            Hydration (glasses of water)
          </label>
          <input
            type="number"
            id="hydration"
            min="0"
            value={hydration}
            onChange={(e) => setHydration(parseInt(e.target.value) || 0)}
            className="glass-input w-full px-4 py-3"
          />
        </div>

        {/* Sleep Hours */}
        <div>
          <label htmlFor="sleepHours" className="block text-lg font-medium text-slate-700 mb-2">
            Sleep Hours
          </label>
          <input
            type="number"
            id="sleepHours"
            min="0"
            step="0.5"
            value={sleepHours}
            onChange={(e) => setSleepHours(parseFloat(e.target.value) || 0)}
            className="glass-input w-full px-4 py-3"
          />
        </div>

        {/* Medications Taken */}
        <div>
          <label htmlFor="medications" className="block text-lg font-medium text-slate-700 mb-2">
            Medications Taken
          </label>
          <textarea
            id="medications"
            rows="3"
            value={medications}
            onChange={(e) => setMedications(e.target.value)}
            className="glass-input w-full px-4 py-3"
            placeholder="e.g., Tylenol (2 pills), Folic Acid (1 tab)"
          ></textarea>
        </div>

        {/* Symptoms Experienced */}
        <div>
          <label className="block text-lg font-medium text-slate-700 mb-2">
            Symptoms Experienced
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {commonSymptoms.map((symptom) => (
               <label key={symptom} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${symptoms.includes(symptom) ? 'bg-primary-50 border-primary-200 text-primary-700 font-medium' : 'bg-white/50 border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <input
                  type="checkbox"
                  id={`symptom-${symptom}`}
                  value={symptom}
                  checked={symptoms.includes(symptom)}
                  onChange={handleSymptomChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mr-2"
                />
                 {symptom}
              </label>
            ))}
          </div>
        </div>

        {/* Personal Notes */}
        <div>
          <label htmlFor="personalNotes" className="block text-lg font-medium text-slate-700 mb-2">
            Personal Notes
          </label>
          <textarea
            id="personalNotes"
            rows="4"
            value={personalNotes}
            onChange={(e) => setPersonalNotes(e.target.value)}
            className="glass-input w-full px-4 py-3"
            placeholder="Write a brief note about your day..."
          ></textarea>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full sm:w-auto btn-primary px-8 py-3.5 text-lg shadow-lg shadow-primary-500/20"
          >
            Save Journal Entry
          </button>
        </div>
      </form>
    </div>
  );
}

export default Journal;
