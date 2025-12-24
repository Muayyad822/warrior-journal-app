import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Zap } from 'lucide-react';

function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-3 flex flex-col space-y-2">
          <Link
            to="/crisis-log"
            className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-colors text-sm text-center"
            onClick={() => setIsOpen(false)}
          >
            Crisis Log
          </Link>
          <Link
            to="/journal"
            className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors text-sm text-center"
            onClick={() => setIsOpen(false)}
          >
            Journal
          </Link>
          <Link
            to="/dashboard"
            className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors text-sm text-center"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
        </div>
      )}
      <button
        onClick={toggleMenu}
        className="bg-purple-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-3xl font-bold hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        aria-label="Quick Navigation"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
      </button>
    </div>
  );
}

export default FloatingActionButton;