import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useHealthData } from '../context/HealthDataContext';
import toast from 'react-hot-toast';
import { Pencil, Check, X, LayoutDashboard, BookOpen, AlertTriangle, BarChart2, Menu } from 'lucide-react';

function Header() {
  const { getDisplayName, updateUserName } = useHealthData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const location = useLocation();

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

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="glass sticky top-0 z-40 border-b border-gray-100">
        <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-0">
          {/* App Title/Logo */}
          <Link to="/dashboard" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 hover:opacity-80 transition-opacity">
            The Warrior's Journal
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/dashboard" className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive('/dashboard') ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'}`}>Dashboard</Link>
            <Link to="/journal" className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive('/journal') ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'}`}>Journal</Link>
            <Link to="/crisis-log" className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive('/crisis-log') ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'}`}>Crisis Log</Link>
            <Link to="/analytics" className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive('/analytics') ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'}`}>Analytics</Link>
            <Link to="/motivation" className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive('/motivation') ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'}`}>Motivation</Link>
            <Link to="/settings" className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive('/settings') ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'}`}>Settings</Link>
            <Link to="/guide" className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive('/guide') ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'}`}>How to use app</Link>
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-gray-200 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-[70px] pb-2">
            <Link to="/dashboard" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/dashboard') ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}>
                <LayoutDashboard className={`w-6 h-6 ${isActive('/dashboard') ? 'fill-primary-100' : ''}`} />
                <span className="text-[10px] font-medium">Home</span>
            </Link>
            <Link to="/journal" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/journal') ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}>
                <BookOpen className={`w-6 h-6 ${isActive('/journal') ? 'fill-primary-100' : ''}`} />
                <span className="text-[10px] font-medium">Journal</span>
            </Link>
            <div className="relative -top-6">
                <Link to="/crisis-log" className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105 transition-all">
                    <AlertTriangle className="w-6 h-6" />
                </Link>
                <span className="absolute -bottom-5 w-full text-center text-[10px] font-medium text-slate-500">Crisis</span>
            </div>
            <Link to="/analytics" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/analytics') ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}>
                <BarChart2 className={`w-6 h-6 ${isActive('/analytics') ? 'fill-primary-100' : ''}`} />
                <span className="text-[10px] font-medium">Analytics</span>
            </Link>
            <button 
                onClick={() => setIsMenuOpen(true)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isMenuOpen ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <Menu className="w-6 h-6" />
                <span className="text-[10px] font-medium">Menu</span>
            </button>
        </div>
      </nav>

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
