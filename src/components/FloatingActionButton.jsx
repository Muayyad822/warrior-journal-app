import { useState } from 'react';
import { Link } from 'react-router-dom';

function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Quick Action Buttons */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-3 mb-2">
          <Link
            to="/ai-chat"
            className="flex items-center justify-center w-12 h-12 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title="AI Health Companion"
            onClick={() => setIsOpen(false)}
          >
            🤖
          </Link>
          <Link
            to="/journal"
            className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title="Daily Journal"
            onClick={() => setIsOpen(false)}
          >
            📝
          </Link>
          <Link
            to="/crisis-log"
            className="flex items-center justify-center w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title="Crisis Log"
            onClick={() => setIsOpen(false)}
          >
            🚨
          </Link>
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={toggleMenu}
        className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
        title="Quick Actions"
      >
        {isOpen ? '✕' : '⚡'}
      </button>
    </div>
  );
}

export default FloatingActionButton;
