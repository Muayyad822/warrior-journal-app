import { useState } from 'react';
import { useHealthData } from '../context/HealthDataContext';

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
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Motivation Hub - Daily Inspiration for {displayName}
      </h2>
      <p className="mb-6 text-gray-600">
        Find encouragement, practical tips, and positive affirmations to support your health journey, {displayName}.
      </p>

      {/* Daily Affirmation */}
      <section className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg p-6 mb-6 text-center">
        <h3 className="text-xl font-semibold mb-4">Daily Affirmation</h3>
        <p className="text-lg mb-4 italic">"{positiveAffirmations[currentAffirmation]}"</p>
        <button
          onClick={nextAffirmation}
          className="bg-white text-purple-600 hover:bg-purple-50 font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          New Affirmation
        </button>
      </section>

      {/* Motivational Quotes */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Inspirational Quotes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {motivationalQuotes.map((quote, index) => (
            <div key={index} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-gray-700 italic mb-2">"{quote.text}"</p>
              <p className="text-blue-600 font-medium">- {quote.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Health Tips */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Wellness Tips for {displayName}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {healthTips.map((tip, index) => (
            <div key={index} className="flex items-start space-x-3 bg-green-50 p-3 rounded-lg">
              <div className="text-green-600 text-xl">💡</div>
              <p className="text-gray-700">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Encouragement Section */}
      <section className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-lg p-6 text-center">
        <h3 className="text-xl font-semibold mb-4">Remember, {displayName}</h3>
        <p className="text-lg mb-4">
          Every step you take in tracking your health is a step toward better understanding and managing your well-being.
        </p>
        <p className="text-md opacity-90">
          You're not just surviving - you're thriving, one day at a time. Keep going, warrior! 🛡️
        </p>
      </section>
    </div>
  );
}

export default Motivation;
