function Motivation() {
  // Static data for motivation content
  const inspirationalQuotes = [
    {
      quote: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    },
    {
      quote: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt"
    },
    {
      quote: "Strength does not come from physical capacity. It comes from an indomitable will.",
      author: "Mahatma Gandhi"
    },
    {
      quote: "It's not what happens to you, but how you react to it that matters.",
      author: "Epictetus"
    },
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

  const positiveAffirmations = [
    "I am strong and resilient.",
    "My body is healing and capable.",
    "I am in control of my well-being.",
    "Every day, I am getting stronger.",
    "I choose peace and comfort.",
    "I am worthy of care and compassion.",
    "I embrace my journey with courage."
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Motivation Hub - Daily Inspiration</h2>
      <p className="mb-6 text-gray-600">Find encouragement, practical tips, and positive affirmations to support your health journey.</p>

      {/* Inspirational Quotes Section */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center space-x-2">
          ✨ Inspirational Quotes
        </h3>
        <div className="space-y-4">
          {inspirationalQuotes.map((item, index) => (
            <blockquote key={index} className="border-l-4 border-blue-500 pl-4 italic text-gray-700">
              <p className="mb-1">"{item.quote}"</p>
              <footer className="text-sm text-gray-500">- {item.author}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Health Tips Section */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center space-x-2">
          💡 Health Management Tips
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {healthTips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </section>

      {/* Positive Affirmations Section */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center space-x-2">
          💖 Positive Affirmations
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {positiveAffirmations.map((affirmation, index) => (
            <li key={index}>{affirmation}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Motivation;