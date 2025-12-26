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

    const crisisSeverityData = Array.from({ length: 11 }, (_, i) => ({
      severity: i,
      count: 0
    }));
    crisisLogs.forEach(log => {
      const severity = parseInt(log.severity);
      if (!isNaN(severity) && severity >= 0 && severity <= 10) {
        crisisSeverityData[severity].count++;
      }
    });

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
      symptomChartData,
      crisisSeverityData
    };
  }, [journalEntries, crisisLogs]); // Recalculate if journalEntries or crisisLogs change

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Health Analytics - Understand Your Patterns</h2>
      <p className="mb-6 text-gray-600">Gain insights into your health journey through data summaries.</p>

      {/* Overview Statistics */}
      <section className="glass-card p-6 mb-8">
        <h3 className="text-xl font-bold text-slate-700 mb-4">Overall Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="bg-primary-50/50 p-4 rounded-2xl border border-primary-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Journal Entries</p>
            <p className="text-3xl font-bold text-primary-600 mt-1">{analyticsData.totalJournalEntries}</p>
          </div>
          <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Crisis Logs</p>
            <p className="text-3xl font-bold text-rose-600 mt-1">{analyticsData.totalCrisisLogs}</p>
          </div>
          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Sleep</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">{analyticsData.avgSleepHours} <span className="text-sm font-medium text-slate-400">hrs</span></p>
          </div>
          <div className="bg-violet-50/50 p-4 rounded-2xl border border-violet-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Hydration</p>
            <p className="text-3xl font-bold text-violet-600 mt-1">{analyticsData.avgHydration} <span className="text-sm font-medium text-slate-400">cups</span></p>
          </div>
        </div>
      </section>

      {/* Journal Entry Trends */}
      <section className="glass-card p-6 mb-8">
        <h3 className="text-xl font-bold text-slate-700 mb-6">Journal Entry Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-slate-700 mb-3 flex items-center">
              <span className="w-2 h-6 bg-red-400 rounded-full mr-2"></span>
              Pain Level Trends
            </h4>
            <div className="flex justify-between mb-4 text-sm">
                <p className="text-slate-600">All Time Avg: <span className="font-bold text-slate-800">{analyticsData.avgPainAllTime}/10</span></p>
                <p className="text-slate-600">Last 7 Days Avg: <span className="font-bold text-slate-800">{analyticsData.avgPainLast7Days}/10</span></p>
            </div>
            
            <div className="h-64 mt-3 bg-white/40 rounded-xl p-2 border border-slate-100">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.painTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" fontSize={11} tick={{fill: '#64748b'}} />
                  <YAxis domain={[0, 10]} fontSize={11} tick={{fill: '#64748b'}} />
                  <Tooltip contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Line type="monotone" dataKey="pain" stroke="#ef4444" strokeWidth={3} dot={{r: 4, fill: '#ef4444', strokeWidth: 0}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-slate-700 mb-3 flex items-center">
                <span className="w-2 h-6 bg-indigo-400 rounded-full mr-2"></span>
                Mood Trends
            </h4>
             <div className="flex justify-between mb-4 text-sm">
                <p className="text-slate-600">All Time Mode: <span className="font-bold text-slate-800">{analyticsData.mostFrequentMood}</span></p>
                <p className="text-slate-600">7 Days Mode: <span className="font-bold text-slate-800">{analyticsData.mostFrequentMoodLast7Days}</span></p>
            </div>
            
            <div className="h-64 mt-3 bg-white/40 rounded-xl p-2 border border-slate-100 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.moodChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {analyticsData.moodChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
                {analyticsData.moodChartData.slice(0, 5).map((entry, index) => (
                    <div key={index} className="flex items-center text-xs text-slate-500">
                        <span className="w-2 h-2 rounded-full mr-1" style={{backgroundColor: COLORS[index % COLORS.length]}}></span>
                        {entry.mood}
                    </div>
                ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold text-slate-700 mb-3 flex items-center">
                <span className="w-2 h-6 bg-amber-400 rounded-full mr-2"></span>
                Top Symptoms Recorded
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/40 rounded-xl p-4 border border-slate-100">
                     {analyticsData.topSymptoms.length > 0 ? (
                        <div className="space-y-3">
                            {analyticsData.topSymptoms.map((symptom, idx) => (
                            <div key={symptom.name} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded-full text-xs font-bold text-slate-500 mr-3">{idx + 1}</span>
                                    <span className="text-slate-700 font-medium">{symptom.name}</span>
                                </div>
                                <span className="text-sm bg-slate-100 px-2 py-1 rounded-md text-slate-600 font-semibold">{symptom.count} times</span>
                            </div>
                            ))}
                        </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 text-slate-400">
                                <Activity className="w-10 h-10 mb-2 opacity-50" />
                                <p className="italic">No symptoms recorded yet.</p>
                            </div>
                        )}
                </div>
                <div className="h-52 bg-white/40 rounded-xl p-2 border border-slate-100">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.symptomChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                      <XAxis type="number" fontSize={11} hide />
                      <YAxis dataKey="name" type="category" width={100} fontSize={11} tick={{fill: '#64748b'}} />
                      <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Bar dataKey="count" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Crisis Log Analysis */}
      <section className="glass-card p-6">
        <h3 className="text-xl font-bold text-slate-700 mb-6">Crisis Log Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-slate-700 mb-4">Crisis Overview</h4>
            <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-red-50/50 rounded-xl border border-red-100">
                    <span className="text-slate-600">Total Episodes</span>
                    <span className="text-2xl font-bold text-red-600">{analyticsData.totalCrisisLogs}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                    <span className="text-slate-600">Avg Severity</span>
                    <span className="text-2xl font-bold text-orange-600">{analyticsData.avgCrisisSeverity}<span className="text-sm text-orange-400">/10</span></span>
                </div>
                 <div className="flex justify-between items-center p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                    <span className="text-slate-600">Common Trigger</span>
                    <span className="text-lg font-bold text-slate-700">{analyticsData.commonCrisisTrigger || "N/A"}</span>
                </div>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-slate-700 mb-4">Severity Distribution</h4>
            <div className="h-48 bg-white/40 rounded-xl p-2 border border-slate-100">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.crisisSeverityData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="severity" fontSize={11} tick={{fill: '#64748b'}} />
                  <YAxis fontSize={11} tick={{fill: '#64748b'}} />
                  <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="count" fill="#dc2626" radius={[4, 4, 0, 0]} />
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
