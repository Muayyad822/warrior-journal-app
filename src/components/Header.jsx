import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHealthData } from '../context/HealthDataContext';
import toast from 'react-hot-toast';

function Header() {
  const { getDisplayName, updateUserName } = useHealthData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const displayName = getDisplayName();

  const startEditingName = () => {
    setNameInput(displayName === 'Warrior' ? '' : displayName);
    setIsEditingName(true);
  };

  const saveName = () => {
    const trimmedName = nameInput.trim();
    
    if (trimmedName.length > 0 && trimmedName.length < 2) {
      toast.error('Name must be at least 2 characters long');
      return;
    }
    
    if (trimmedName.length > 50) {
      toast.error('Name must be less than 50 characters');
      return;
    }
    
    if (trimmedName && !/^[a-zA-Z\s\-']+$/.test(trimmedName)) {
      toast.error('Name can only contain letters, spaces, hyphens, and apostrophes');
      return;
    }

    updateUserName(trimmedName);
    setIsEditingName(false);
    setNameInput('');
    
    if (trimmedName) {
      toast.success(`Name updated to ${trimmedName}!`);
    } else {
      toast.success('Name cleared - you\'re now "Warrior"!');
    }
  };

  const cancelEditing = () => {
    setIsEditingName(false);
    setNameInput('');
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
          {/* App Title/Logo */}
          <Link to="/dashboard" className="text-2xl font-bold">
            The Warrior's Journal
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
            <Link to="/journal" className="hover:text-blue-200">Journal</Link>
            <Link to="/crisis-log" className="hover:text-blue-200">Crisis Log</Link>
            <Link to="/analytics" className="hover:text-blue-200">Analytics</Link>
            <Link to="/motivation" className="hover:text-blue-200">Motivation</Link>
            <Link to="/guide" className="hover:text-blue-200">How to use app</Link>
          </nav>

          {/* User Greeting & Name Edit */}
          <div className="hidden md:flex items-center space-x-3">
            {isEditingName ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter your name"
                  className="px-2 py-1 text-gray-800 rounded text-sm"
                  maxLength={50}
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && saveName()}
                />
                <button
                  onClick={saveName}
                  className="text-green-300 hover:text-green-100 text-sm"
                >
                  ✓
                </button>
                <button
                  onClick={cancelEditing}
                  className="text-red-300 hover:text-red-100 text-sm"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={startEditingName}
                className="flex items-center space-x-1 hover:text-blue-200 transition-colors"
              >
                <span>Hi, {displayName}</span>
                <span className="text-xs">✏️</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden z-50 relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={closeMobileMenu}
          ></div>
          
          {/* Sidebar */}
          <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-purple-700 text-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            {/* Sidebar Header */}
            <div className="flex justify-between items-center p-4 border-b border-purple-700">
              <h3 className="text-lg font-semibold">Menu</h3>
              <button
                onClick={closeMobileMenu}
                className="text-white hover:text-blue-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex flex-col h-full">
              {/* Navigation Links */}
              <nav className="flex flex-col p-4 space-y-1">
                <Link 
                  to="/dashboard" 
                  className="hover:text-blue-200 hover:bg-blue-700 py-3 px-3 rounded transition-colors"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/journal" 
                  className="hover:text-blue-200 hover:bg-blue-700 py-3 px-3 rounded transition-colors"
                  onClick={closeMobileMenu}
                >
                  Journal
                </Link>
                <Link 
                  to="/crisis-log" 
                  className="hover:text-blue-200 hover:bg-blue-700 py-3 px-3 rounded transition-colors"
                  onClick={closeMobileMenu}
                >
                  Crisis Log
                </Link>
                <Link 
                  to="/analytics" 
                  className="hover:text-blue-200 hover:bg-blue-700 py-3 px-3 rounded transition-colors"
                  onClick={closeMobileMenu}
                >
                  Analytics
                </Link>
                <Link 
                  to="/motivation" 
                  className="hover:text-blue-200 hover:bg-blue-700 py-3 px-3 rounded transition-colors"
                  onClick={closeMobileMenu}
                >
                  Motivation
                </Link>
                <Link 
                  to="/guide" 
                  className="hover:text-blue-200 hover:bg-blue-700 py-3 px-3 rounded transition-colors"
                  onClick={closeMobileMenu}
                >
                  How to use app
                </Link>
              </nav>
              
              {/* User Greeting Section */}
              <div className=" border-t border-purple-500 p-4">
                <div className="bg-purple-900 rounded-lg p-4">
                  {isEditingName ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-3 py-2 text-gray-800 rounded text-sm"
                        maxLength={50}
                        onKeyPress={(e) => e.key === 'Enter' && saveName()}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={saveName}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={startEditingName}
                      className="flex items-center justify-between w-full hover:text-blue-200 transition-colors"
                    >
                      <span>Hi, {displayName}</span>
                      <span className="text-sm">✏️</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
