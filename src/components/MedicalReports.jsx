      import { useHealthData } from '../context/HealthDataContext';
import ReportGenerator from './ReportGenerator';

function MedicalReports() {
  const { journalEntries, crisisLogs, emergencyContacts, crisisActionPlan } = useHealthData();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto print:p-0">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 print:hidden">Medical Reports</h2>
      <p className="mb-6 text-gray-600 print:hidden">
        Generate a comprehensive PDF report of your health journey to share with your healthcare provider. 
        You can also print this page directly.
      </p>

      <div className="mb-6 flex flex-wrap justify-end gap-3 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center space-x-2 h-[52px]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"></path></svg>
          <span>Print Preview</span>
        </button>
        <div className="w-auto">
             <ReportGenerator />
        </div>
      </div>

      <div className="report-content bg-white rounded-lg shadow-md p-6 print:shadow-none print:rounded-none print:p-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">Health Report Summary</h1>
        <p className="text-center text-gray-600 mb-6">Generated on: {formatDate(new Date().toISOString())}</p>

        <div className="mb-8 border-b pb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">1. Health Overview</h3>
          <p className="text-gray-700 mb-1"><span className="font-medium">Total Journal Entries:</span> {journalEntries.length}</p>
          <p className="text-gray-700"><span className="font-medium">Total Crisis Logs:</span> {crisisLogs.length}</p>
        </div>

        <div className="mb-8 border-b pb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">2. Daily Journal Entries ({journalEntries.length})</h3>
          {journalEntries.length > 0 ? (
            <div className="space-y-4">
              {journalEntries.map((entry) => (
                <div key={entry.id} className="border border-gray-200 rounded-md p-3 bg-gray-50">
                  <p className="font-semibold text-gray-900 mb-1">Date: {formatDate(entry.date)}</p>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    <li>Pain Level: {entry.painLevel}/10</li>
                    <li>Mood: {entry.mood || 'N/A'}</li>
                    <li>Hydration: {entry.hydration} glasses</li>
                    <li>Sleep Hours: {entry.sleepHours} hrs</li>
                    <li>Medications: {entry.medications || 'None recorded'}</li>
                    <li>Symptoms: {entry.symptoms && entry.symptoms.length > 0 ? entry.symptoms.join(', ') : 'None'}</li>
                    <li>Notes: {entry.personalNotes || 'N/A'}</li>
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="italic text-gray-500">No journal entries available.</p>
          )}
        </div>

        <div className="mb-8 border-b pb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">3. Crisis Log Entries ({crisisLogs.length})</h3>
          {crisisLogs.length > 0 ? (
            <div className="space-y-4">
              {crisisLogs.map((log) => (
                <div key={log.id} className="border border-red-200 rounded-md p-3 bg-red-50">
                  <p className="font-semibold text-gray-900 mb-1">Date: {formatDate(log.date)} (Time: {log.time})</p>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    <li>Severity: {log.severity}/10</li>
                    <li>Duration: {log.duration || 'N/A'}</li>
                    <li>Triggers: {log.triggers && log.triggers.length > 0 ? log.triggers.join(', ') : 'None'}</li>
                    <li>Medications Used: {log.medicationsUsed || 'None recorded'}</li>
                    <li>Location: {log.location || 'N/A'}</li>
                    <li>Circumstances: {log.circumstances || 'N/A'}</li>
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="italic text-gray-500">No crisis logs available.</p>
          )}
        </div>

        <div className="mb-8 pb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">4. Emergency Kit Summary</h3>
          <h4 className="text-lg font-medium text-gray-700 mb-2">Emergency Contacts ({emergencyContacts.length})</h4>
          {emergencyContacts.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700 mb-4">
              {emergencyContacts.map((contact) => (
                <li key={contact.id}>{contact.name}: {contact.phone}</li>
              ))}
            </ul>
          ) : (
            <p className="italic text-gray-500 mb-4">No emergency contacts set.</p>
          )}

          <h4 className="text-lg font-medium text-gray-700 mb-2">Crisis Action Plan</h4>
          {crisisActionPlan ? (
            <pre className="whitespace-pre-wrap bg-gray-100 p-3 rounded-md text-gray-800 text-sm border border-gray-200">
              {crisisActionPlan}
            </pre>
          ) : (
            <p className="italic text-gray-500">No crisis action plan defined.</p>
          )}
        </div>

        <p className="text-sm text-gray-500 text-center mt-6">
          This report is for informational purposes only and does not replace professional medical advice.
        </p>
      </div>
    </div>
  );
}

export default MedicalReports;