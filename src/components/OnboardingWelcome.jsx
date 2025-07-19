import { useState } from 'react';
import { useHealthData } from '../context/HealthDataContext';
import toast from 'react-hot-toast';

function OnboardingWelcome() {
  const { completeOnboarding } = useHealthData();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const trimmedName = name.trim();
    
    // Validation
    if (!trimmedName) {
      toast.error('Please enter your name to continue');
      return;
    }
    
    if (trimmedName.length < 2) {
      toast.error('Name must be at least 2 characters long');
      return;
    }
    
    if (trimmedName.length > 50) {
      toast.error('Name must be less than 50 characters');
      return;
    }
    
    // Basic character validation (letters, spaces, hyphens, apostrophes)
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!nameRegex.test(trimmedName)) {
      toast.error('Name can only contain letters, spaces, hyphens, and apostrophes');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate a brief loading state for better UX
    setTimeout(() => {
      completeOnboarding(trimmedName);
      toast.success(`Welcome to your health journey, ${trimmedName}!`);
      setIsSubmitting(false);
    }, 500);
  };

  const handleSkip = () => {
    completeOnboarding('');
    toast.success('Welcome to your health journey!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🛡️</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to The Warrior's Journal
          </h1>
          <p className="text-gray-600">
            Your personal digital health companion for tracking wellness and managing health challenges.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
              What should we call you?
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your first name or nickname"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              maxLength={50}
              autoFocus
            />
            <p className="text-sm text-gray-500 mt-1">
              This helps us personalize your experience
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors ${
                isSubmitting
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              {isSubmitting ? 'Setting up...' : 'Start My Journey'}
            </button>
            
            <button
              type="button"
              onClick={handleSkip}
              className="w-full py-2 px-6 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Skip for now
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Your data stays private and secure on your device
          </p>
        </div>
      </div>
    </div>
  );
}

export default OnboardingWelcome;