import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHealthData } from '../context/HealthDataContext';
import toast from 'react-hot-toast';
import { Pencil, Check, X } from 'lucide-react';

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
      <header className="glass sticky top-0 z-40 border-b border-gray-100">
        <div className="container mx-auto flex justify-between items-center py-4">
          {/* App Title/Logo */}
          <Link to="/dashboard" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 hover:opacity-80 transition-opacity">
            The Warrior's Journal
          </Link>

          {/* Desktop Navigation */}
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/dashboard" className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition-all">Dashboard</Link>
            <Link to="/journal" className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition-all">Journal</Link>
            <Link to="/crisis-log" className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition-all">Crisis CLI</Link>
            <Link to="/analytics" className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition-all">Analytics</Link>
            <Link to="/motivation" className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition-all">Motivation</Link>
            <Link to="/settings" className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition-all">Settings</Link>
            <Link to="/guide" className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition-all">How to use app</Link>

          </nav>



          {/* Mobile Menu Button */}
          <button
            className="md:hidden z-50 p-2 text-slate-700"
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
          <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-gray-100 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            {/* Sidebar Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">Menu</h3>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex flex-col h-full">
              {/* Navigation Links */}
              <nav className="flex flex-col p-4 space-y-2">
                <Link 
                  to="/dashboard" 
                  className="flex items-center p-3 rounded-xl text-slate-600 hover:bg-primary-50 hover:text-primary-700 transition-all font-medium"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/journal" 
                  className="flex items-center p-3 rounded-xl text-slate-600 hover:bg-primary-50 hover:text-primary-700 transition-all font-medium"
                  onClick={closeMobileMenu}
                >
                  Journal
                </Link>
                <Link 
                  to="/crisis-log" 
                  className="flex items-center p-3 rounded-xl text-slate-600 hover:bg-primary-50 hover:text-primary-700 transition-all font-medium"
                  onClick={closeMobileMenu}
                >
                  Crisis Log
                </Link>
                <Link 
                  to="/analytics" 
                  className="flex items-center p-3 rounded-xl text-slate-600 hover:bg-primary-50 hover:text-primary-700 transition-all font-medium"
                  onClick={closeMobileMenu}
                >
                  Analytics
                </Link>
                <Link 
                  to="/motivation" 
                  className="flex items-center p-3 rounded-xl text-slate-600 hover:bg-primary-50 hover:text-primary-700 transition-all font-medium"
                  onClick={closeMobileMenu}
                >
                  Motivation
                </Link>
                <Link 
                  to="/guide" 
                  className="flex items-center p-3 rounded-xl text-slate-600 hover:bg-primary-50 hover:text-primary-700 transition-all font-medium"
                  onClick={closeMobileMenu}
                >
                  How to use app
                </Link>
                <Link 
                  to="/settings" 
                  className="flex items-center p-3 rounded-xl text-slate-600 hover:bg-primary-50 hover:text-primary-700 transition-all font-medium"
                  onClick={closeMobileMenu}
                >
                  Settings
                </Link>
              </nav>
              
              {/* User Greeting Section */}
              <div className="border-t border-gray-100 p-6">
                <div className="bg-primary-50 rounded-2xl p-4">
                  {isEditingName ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-4 py-2 bg-white rounded-lg text-sm border border-primary-200 focus:ring-2 focus:ring-primary-400 outline-none"
                        maxLength={50}
                        onKeyPress={(e) => e.key === 'Enter' && saveName()}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={saveName}
                          className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-medium hover:bg-primary-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="px-3 py-1.5 bg-white text-slate-600 border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={startEditingName}
                      className="flex items-center justify-between w-full text-primary-900"
                    >
                      <span className="font-medium">Hello, {displayName}</span>
                      <div className="p-2 bg-white rounded-full text-primary-600">
                        <Pencil className="w-4 h-4" />
                      </div>
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
