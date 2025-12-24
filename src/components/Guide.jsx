const GuidePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-10">

        {/* Introduction Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
            The Warrior's Journal: Your Digital Health Companion
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            Introduction: Empowering Your Health Journey
          </h2>
          <p className="text-gray-700 mb-4">
            Welcome to The Warrior's Journal, a comprehensive digital health tracking app designed
            specifically for individuals managing chronic health conditions, especially sickle cell disease.
            We understand the unique challenges you face, and our mission is to provide you with a personal
            health diary, an essential emergency toolkit, and a powerful motivation center, all in one intuitive
            and easy-to-use app.
          </p>
          <p className="text-gray-700">
            The Warrior's Journal is here to empower you, help you understand your patterns, communicate
            better with your healthcare team, and take proactive control of your wellness.
          </p>
          <p className="text-gray-500 text-md mt-4">
            Developed by: <a
          href="https://abdulmuizjimoh.vercel.app/"
          className="text-gray-500 underline hover:text-blue-700 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Muayyad
        </a>
          </p>
        </div>

        {/* Features Section */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          Key Features & Benefits for a Healthier You
        </h2>
        
        {/* Personalized Health Tracking */}
        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-3">
            1. Personalized Health Tracking & Insights
          </h3>
          <p className="text-gray-700 mb-4">
            Gain unparalleled visibility into your health with easy, consistent tracking and smart analytics.
          </p>
          <ul className="list-disc list-inside space-y-4 text-gray-700 ml-4">
            <li>
              <span className="font-bold">Daily Journal:</span> Effortlessly record your daily health status, including:
              <ul className="list-disc list-inside ml-8 mt-2 space-y-1">
                <li>Pain levels (on a 0-10 scale)</li>
                <li>Mood (from Excellent to Terrible)</li>
                <li>Hydration (glasses of water consumed)</li>
                <li>Hours of sleep</li>
                <li>Medications taken</li>
                <li>Symptoms experienced</li>
                <li>Personal notes about your day.</li>
              </ul>
              <p className="mt-2 text-sm text-gray-600 italic">This helps you identify patterns and gather valuable data for your doctor visits.</p>
            </li>
            <li>
              <span className="font-bold">Powerful Analytics:</span> Transform your daily entries into actionable insights.
              <ul className="list-disc list-inside ml-8 mt-2 space-y-1">
                <li>Visualize your health trends with charts for pain, mood, and hydration over time.</li>
                <li>Identify triggers that lead to good or bad days.</li>
                <li>Review weekly summaries of your average pain, sleep, and hydration levels.</li>
                <li>Track your progress and celebrate improvements over time.</li>
              </ul>
            </li>
            <li>
              <span className="font-bold">Medical Reports:</span> Share your journey with confidence.
              <ul className="list-disc list-inside ml-8 mt-2 space-y-1">
                <li>Generate comprehensive reports of your health data, including symptoms, triggers, and patterns, ideal for medical appointments.</li>
                <li>Easily export and share these summaries with your doctors and loved ones.</li>
              </ul>
            </li>
          </ul>
        </div>
        
        {/* Instant Crisis Support */}
        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-3">
            2. Instant Crisis Support: Always Prepared
          </h3>
          <p className="text-gray-700 mb-4">
            Your safety is paramount. The Emergency Kit ensures help is always just a tap away.
          </p>
          <ul className="list-disc list-inside space-y-4 text-gray-700 ml-4">
            <li>
              <span className="font-bold">Crisis Alert Button:</span> In a health crisis, instantly send your location to pre-set emergency contacts via WhatsApp or SMS. This crucial feature is always visible on your Dashboard.
            </li>
            <li>
              <span className="font-bold">Emergency Contacts:</span> Securely store and quickly call your doctor, family, and hospital numbers directly from the app.
            </li>
            <li>
              <span className="font-bold">Crisis Log:</span> Document crisis severity, duration, identified triggers, medications used, and location to help prevent future crises.
            </li>
            <li>
              <span className="font-bold">Action Plan:</span> Follow a step-by-step crisis management guide tailored for your needs.
            </li>
          </ul>
        </div>
        
        {/* AI Health Companion */}
        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-3">
            3. AI Health Companion: Teni, Your Supportive Guide
          </h3>
          <p className="text-gray-700 mb-4">
            Meet Teni, your warm and empathetic AI chatbot, powered by Gemini 1.5 Flash. Teni is designed to provide you with compassionate support and general wellness guidance, right within the app.
          </p>
          <ul className="list-disc list-inside space-y-4 text-gray-700 ml-4">
            <li>
              <span className="font-bold">Emotional Support:</span> Chat with Teni when you need encouragement, are feeling stressed, anxious, or just need to share your thoughts. Teni is here to listen and provide empathetic responses.
            </li>
            <li>
              <span className="font-bold">General Wellness Tips:</span> Ask Teni for practical advice on topics like staying hydrated, managing fatigue, coping strategies for daily challenges, gentle exercises, and balanced nutrition.
            </li>
            <li>
              <span className="font-bold">Always Safe:</span> Teni is an AI companion, not a medical professional. It will never offer medical diagnoses, treatment plans, medication advice, or interpret lab results. Instead, Teni will always remind you to consult your healthcare providers for any medical decisions or emergencies. If you mention a severe crisis, Teni will immediately advise you to contact your doctor or emergency services. This ensures you always receive safe, appropriate support.
            </li>
          </ul>
        </div>
        
        {/* Motivation Hub */}
        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-3">
            4. Motivation Hub: Stay Inspired
          </h3>
          <p className="text-gray-700 mb-4">
            Nurture your mental well-being with daily doses of positivity.
          </p>
          <ul className="list-disc list-inside space-y-4 text-gray-700 ml-4">
            <li>
              <span className="font-bold">Daily Affirmations:</span> Receive uplifting messages to brighten your day.
            </li>
            <li>
              <span className="font-bold">Health Tips:</span> Get practical advice tailored for managing your condition.
            </li>
            <li>
              <span className="font-bold">Inspiration:</span> Access motivational content to keep you moving forward on your health journey.
            </li>
          </ul>
        </div>
        
        {/* User Experience Section */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-10 mb-6">
          Seamless User Experience
        </h2>
        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-3">
            Easy Navigation
          </h3>
          <p className="text-gray-700 mb-4">
            The Warrior's Journal is designed for quick and intuitive access to your health tools.
          </p>
          <ul className="list-disc list-inside space-y-4 text-gray-700 ml-4">
            <li>
              <span className="font-bold">Dashboard:</span> Your health command center for a complete overview.
            </li>
            <li>
              <span className="font-bold">Main Navigation:</span> A clear top bar on desktop, or a convenient hamburger menu on mobile for full access to all features.
            </li>
            <li>
              <span className="font-bold">Quick Navigation Floating Button:</span> A blue chat bot icon in the bottom-right corner provides one-tap access to your AI Health Companion (Teni).
            </li>
          </ul>
        </div>
        
        {/* Install as an App */}
        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-3">
            Install as an App
          </h3>
          <p className="text-gray-700 mb-4">
            For faster access and offline capabilities, you can install The Warrior's Journal directly to your phone's home screen.
          </p>
          <p className="text-gray-700">
            <span className="font-bold">Benefits:</span> Faster access, offline use, and more reliable performance.
          </p>
        </div>
        
        {/* Privacy Section */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-10 mb-6">
          Your Privacy, Your Control
        </h2>
        <p className="text-gray-700 mb-4">
          We prioritize your privacy. All your health data within The Warrior's Journal is stored locally on your device. There is no cloud sync, meaning your information is not sent to external servers. You maintain complete control over what you share and with whom.
        </p>
        
        {/* Conclusion */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-10 mb-6">
          Get Started Today!
        </h2>
        <p className="text-gray-700 mb-4">
          Take control of your health journey with The Warrior's Journal. It's more than an app; it's your dedicated companion in managing sickle cell disease.
        </p>
        <p className="text-gray-500 text-sm italic mt-4">
          Remember: This app is a powerful tool to help you manage your health, but it does not replace professional medical care. Always consult with your healthcare providers for medical decisions.
        </p>

      </div>
    </div>
  );
};

export default GuidePage;