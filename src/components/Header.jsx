import { useState } from 'react';
import { Link } from 'react-router-dom'; 
function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* App Title/Logo - "The Warrior's Journal"  */}
        <Link to="/" className="text-2xl font-bold">
          The Warrior's Journal
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
          <Link to="/journal" className="hover:text-blue-200">Journal</Link>
          <Link to="/crisis-log" className="hover:text-blue-200">Crisis Log</Link>
          <Link to="/analytics" className="hover:text-blue-200">Analytics</Link>
          <Link to="/motivation" className="hover:text-blue-200">Motivation</Link>
        </nav>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Slide-in from right */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleMobileMenu}
          ></div>
          
          {/* Slide-in Menu */}
          <nav className="fixed top-0 right-0 h-full w-64 bg-blue-700 shadow-xl z-50 md:hidden transform transition-transform duration-300 ease-in-out">
            <div className="p-4">
              <button 
                onClick={toggleMobileMenu}
                className="float-right text-white text-2xl mb-4"
              >
                ✕
              </button>
              <div className="clear-both pt-8">
                <Link to="/dashboard" className="block px-4 py-3 text-white hover:bg-blue-600 rounded-md mb-2" onClick={toggleMobileMenu}>Dashboard</Link>
                <Link to="/journal" className="block px-4 py-3 text-white hover:bg-blue-600 rounded-md mb-2" onClick={toggleMobileMenu}>Journal</Link>
                <Link to="/crisis-log" className="block px-4 py-3 text-white hover:bg-blue-600 rounded-md mb-2" onClick={toggleMobileMenu}>Crisis Log</Link>
                <Link to="/analytics" className="block px-4 py-3 text-white hover:bg-blue-600 rounded-md mb-2" onClick={toggleMobileMenu}>Analytics</Link>
                <Link to="/motivation" className="block px-4 py-3 text-white hover:bg-blue-600 rounded-md mb-2" onClick={toggleMobileMenu}>Motivation</Link>
              </div>
              
            </div>
          </nav>
        </>
      )}
    </header>
  );
}

export default Header;
