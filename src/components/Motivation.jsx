import { useState } from 'react';
import { useHealthData } from '../context/HealthDataContext';
import { Lightbulb, Shield } from 'lucide-react';

function Motivation() {
  const { getDisplayName } = useHealthData();
  const displayName = getDisplayName();
  
  const [currentAffirmation, setCurrentAffirmation] = useState(0);

  const positiveAffirmations = [
    `${displayName}, you are strong and resilient.`,
    `${displayName}, your body is healing and capable.`,
    `${displayName}, you are in control of your well-being.`,
    `Every day, ${displayName}, you are getting stronger.`,
    `${displayName}, you choose peace and comfort.`,
    `${displayName}, you are worthy of care and compassion.`,
    `${displayName}, you embrace your journey with courage.`,
    `${displayName}, you have the strength to overcome any challenge.`,
    `${displayName}, your resilience inspires others.`,
    `${displayName}, you are making progress every single day.`
  ];

  const motivationalQuotes = [
    {
      text: "The strongest people are not those who show strength in front of us, but those who win battles we know nothing about.",
      author: "Unknown"
    },
    {
      text: "You are braver than you believe, stronger than you seem, and smarter than you think.",
      author: "A.A. Milne"
    },
    {
      text: "Healing is not linear. Be patient with yourself.",
      author: "Unknown"
    },
    {
      text: "Your current situation is not your final destination.",
      author: "Unknown"
    }
  ];

const healthTips = [
    "Stay hydrated: Drink at least 8 glasses of water a day.",
    "Listen to your body: Rest when you need to, don't push through pain.",
    "Maintain a balanced diet: Focus on whole, unprocessed foods.",
    "Light exercise: Gentle movement can improve circulation and mood.",
    "Manage stress: Practice mindfulness, meditation, or deep breathing.",
    "Prioritize sleep: Aim for 7-9 hours of quality sleep nightly.",
    "Communicate with your doctor: Share all your symptoms and concerns.",
    "Connect with others: Build a support system with friends, family, or support groups."
];

  const nextAffirmation = () => {
    setCurrentAffirmation((prev) => (prev + 1) % positiveAffirmations.length);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">
        Motivation Hub - Daily Inspiration for {displayName}
      </h2>
      <p className="mb-6 text-slate-600">
        Find encouragement, practical tips, and positive affirmations to support your health journey, {displayName}.
      </p>

      {/* Daily Affirmation */}
      <section className="bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white rounded-2xl shadow-lg shadow-violet-500/20 p-8 mb-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-white/10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent pointer-events-none"></div>
        <h3 className="text-xl font-medium mb-6 opacity-90 relative z-10">Daily Affirmation</h3>
        <p className="text-2xl md:text-3xl font-bold mb-8 leading-relaxed relative z-10">"{positiveAffirmations[currentAffirmation]}"</p>
        <button
          onClick={nextAffirmation}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/40 font-semibold py-2.5 px-6 rounded-xl transition-all active:scale-95 relative z-10"
        >
          New Affirmation
        </button>
      </section>

      {/* Motivational Quotes */}
      <section className="glass-card p-6 mb-8">
        <h3 className="text-xl font-bold text-slate-700 mb-6">Inspirational Quotes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {motivationalQuotes.map((quote, index) => (
            <div key={index} className="bg-sky-50/50 p-5 rounded-xl border border-sky-100 hover:border-sky-200 transition-colors">
              <p className="text-slate-700 italic mb-3 leading-relaxed">"{quote.text}"</p>
              <p className="text-sky-600 font-semibold text-sm">- {quote.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Health Tips */}
      <section className="glass-card p-6 mb-8">
        <h3 className="text-xl font-bold text-slate-700 mb-6">
          Wellness Tips for {displayName}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {healthTips.map((tip, index) => (
            <div key={index} className="flex items-start space-x-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-colors">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 mt-0.5">
                  <Lightbulb className="w-5 h-5" />
              </div>
              <p className="text-slate-700 text-sm leading-relaxed pt-1">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Encouragement Section */}
      <section className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-md p-8 text-center">
        <h3 className="text-xl font-bold mb-4">Remember, {displayName}</h3>
        <p className="text-lg mb-4 opacity-90">
          Every step you take in tracking your health is a step toward better understanding and managing your well-being.
        </p>
        <div className="flex items-center justify-center space-x-2 text-md font-medium text-emerald-50 bg-white/10 py-2 px-4 rounded-full inline-block mt-2">
          <span>You're not just surviving - you're thriving!</span>
          <Shield className="w-5 h-5" />
        </div>
      </section>
    </div>
  );
}

export default Motivation;
