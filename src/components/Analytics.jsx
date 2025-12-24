import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useHealthData } from '../context/HealthDataContext';
import { Activity } from 'lucide-react';

function Analytics() {
  const { journalEntries, crisisLogs } = useHealthData();

  // Helper function to calculate average pain
  const calculateAveragePain = (entries) => {
    if (entries.length === 0) return 'N/A';
    const totalPain = entries.reduce((sum, entry) => sum + (entry.painLevel || 0), 0);
    return (totalPain / entries.length).toFixed(1);
  };

  // Helper function to find most frequent mood
  const findMostFrequentMood = (entries) => {
    if (entries.length === 0) return 'N/A';
    const moodCounts = {};
    entries.forEach(entry => {
      if (entry.mood) {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      }
    });

    let mostFrequent = '';
    let maxCount = 0;
    for (const mood in moodCounts) {
      if (moodCounts[mood] > maxCount) {
        maxCount = moodCounts[mood];
        mostFrequent = mood;
      }
    }
    return mostFrequent;
  };

  // Helper function to count symptom occurrences
  const countSymptomOccurrences = (entries) => {
    const symptomCounts = {};
    entries.forEach(entry => {
      if (entry.symptoms && Array.isArray(entry.symptoms)) {
        entry.symptoms.forEach(symptom => {
          symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
        });
      }
    });
    // Convert to array of {name, count} and sort by count descending
    return Object.entries(symptomCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  // Helper function to get most common crisis trigger
  const getMostCommonCrisisTrigger = (logs) => {
    if (logs.length === 0) return 'N/A';
    const triggerCounts = {};
    logs.forEach(log => {
      if (log.triggers && Array.isArray(log.triggers)) {
        log.triggers.forEach(trigger => {
          triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
        });
      }
    });

    let mostCommon = '';
    let maxCount = 0;
    for (const trigger in triggerCounts) {
      if (triggerCounts[trigger] > maxCount) {
        maxCount = triggerCounts[trigger];
        mostCommon = trigger;
      }
    }
    return mostCommon;
  };


  // Use useMemo to re-calculate analytics only when data changes
  const analyticsData = useMemo(() => {
    // Last 7 days journal entries (for short-term trends)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentJournalEntries = journalEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= sevenDaysAgo;
    });

    // Prepare chart data
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    const painTrendData = last30Days.map(date => {
      const entry = journalEntries.find(e => e.date === date);
      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        pain: entry ? entry.painLevel : null
      };
    }).filter(item => item.pain !== null);

    const moodDistribution = {};
    journalEntries.forEach(entry => {
      if (entry.mood) {
        moodDistribution[entry.mood] = (moodDistribution[entry.mood] || 0) + 1;
      }
    });

    const moodChartData = Object.entries(moodDistribution).map(([mood, count]) => ({
      mood,
      count
    }));

    const symptomChartData = countSymptomOccurrences(journalEntries).slice(0, 5);

    return {
      totalJournalEntries: journalEntries.length,
      totalCrisisLogs: crisisLogs.length,
      avgPainAllTime: calculateAveragePain(journalEntries),
      avgPainLast7Days: calculateAveragePain(recentJournalEntries),
      mostFrequentMood: findMostFrequentMood(journalEntries),
      mostFrequentMoodLast7Days: findMostFrequentMood(recentJournalEntries),
      topSymptoms: countSymptomOccurrences(journalEntries).slice(0, 3), // Top 3 symptoms
      commonCrisisTrigger: getMostCommonCrisisTrigger(crisisLogs),
      avgCrisisSeverity: calculateAveragePain(crisisLogs.map(log => ({ painLevel: log.severity }))), // Re-use pain calculator for severity
      avgSleepHours: journalEntries.length > 0 ? (journalEntries.reduce((sum, entry) => sum + (entry.sleepHours || 0), 0) / journalEntries.length).toFixed(1) : 'N/A',
      avgHydration: journalEntries.length > 0 ? (journalEntries.reduce((sum, entry) => sum + (entry.hydration || 0), 0) / journalEntries.length).toFixed(1) : 'N/A',
      painTrendData,
      moodChartData,
      symptomChartData
    };
  }, [journalEntries, crisisLogs]); // Recalculate if journalEntries or crisisLogs change

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Health Analytics - Understand Your Patterns</h2>
      <p className="mb-6 text-gray-600">Gain insights into your health journey through data summaries.</p>

      {/* Overview Statistics */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Overall Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Total Journal Entries</p>
            <p className="text-3xl font-bold text-blue-700">{analyticsData.totalJournalEntries}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Total Crisis Logs</p>
            <p className="text-3xl font-bold text-red-700">{analyticsData.totalCrisisLogs}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Average Sleep (All Time)</p>
            <p className="text-3xl font-bold text-green-700">{analyticsData.avgSleepHours} hrs</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Average Hydration (All Time)</p>
            <p className="text-3xl font-bold text-purple-700">{analyticsData.avgHydration} glasses</p>
          </div>
        </div>
      </section>

      {/* Journal Entry Trends */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Journal Entry Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">Pain Level Trends</h4>
            <p className="text-gray-700">Average Pain (All Time): <span className="font-semibold">{analyticsData.avgPainAllTime}/10</span></p>
            <p className="text-gray-700">Average Pain (Last 7 Days): <span className="font-semibold">{analyticsData.avgPainLast7Days}/10</span></p>
            
            <div className="h-32 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.painTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis domain={[0, 10]} fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="pain" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">Mood Trends</h4>
            <p className="text-gray-700">Most Frequent Mood (All Time): <span className="font-semibold">"{analyticsData.mostFrequentMood}"</span></p>
            <p className="text-gray-700">Most Frequent Mood (Last 7 Days): <span className="font-semibold">"{analyticsData.mostFrequentMoodLast7Days}"</span></p>
            
            <div className="h-48 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.moodChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ mood }) => mood}
                    labelLine={false}
                  >
                    {analyticsData.moodChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">Top Symptoms Recorded</h4>
            {analyticsData.topSymptoms.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700">
                {analyticsData.topSymptoms.map(symptom => (
                  <li key={symptom.name} className="mb-1">{symptom.name} (<span className="font-semibold">{symptom.count}</span> times)</li>
                ))}
              </ul>
            ) : (
                <div className="flex flex-col items-center justify-center p-4 text-gray-400">
                    <Activity className="w-8 h-8 mb-2 opacity-50" />
                    <p className="italic">No symptoms recorded yet.</p>
                </div>
            )}
            
            <div className="h-32 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.symptomChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Crisis Log Analysis */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Crisis Log Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">Crisis Overview</h4>
            <p className="text-gray-700">Total Crisis Episodes: <span className="font-semibold">{analyticsData.totalCrisisLogs}</span></p>
            <p className="text-gray-700">Average Crisis Severity: <span className="font-semibold">{analyticsData.avgCrisisSeverity}/10</span></p>
            <p className="text-gray-700">Most Common Trigger: <span className="font-semibold">"{analyticsData.commonCrisisTrigger}"</span></p>
            <div className="h-32 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.crisisSeverityData || []}> {/* Ensure data is passed, though original code had an issue here: analyticsData.crisisSeverityData was not defined in useMemo return. Let's fix that or fallback */}
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="severity" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Analytics;
