import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Shield, FileText, Contact, User, Menu, X } from 'lucide-react';

interface NavbarProps {
  isConnected: boolean;
  address: string | null;
  onConnect: () => void;
  isOwner: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isConnected, address, onConnect, isOwner }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Shield color="#1E40AF" size={32} />
          <span className="text-xl sm:text-2xl font-bold text-blue-800">InsureDApp</span>
        </div>

        {/* Hamburger Menu Button for Mobile */}
        <button
          className="md:hidden block text-blue-800"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="flex items-center text-blue-700 hover:text-blue-900 transition-colors"
          >
            <Home size={20} className="mr-2" /> Home
          </Link>
          <Link
            to="/about"
            className="flex items-center text-blue-700 hover:text-blue-900 transition-colors"
          >
            <User size={20} className="mr-2" /> About Us
          </Link>
          <Link
            to="/contact"
            className="flex items-center text-blue-700 hover:text-blue-900 transition-colors"
          >
            <Contact size={20} className="mr-2" /> Contact
          </Link>

          {isConnected && (
            <>
              <Link
                to="/policies"
                className="flex items-center text-blue-700 hover:text-blue-900 transition-colors"
              >
                <FileText size={20} className="mr-2" /> Policies
              </Link>
              <Link
                to="/claims"
                className="flex items-center text-blue-700 hover:text-blue-900 transition-colors"
              >
                <FileText size={20} className="mr-2" /> Claims
              </Link>

              {isOwner && (
                <Link
                  to="/process-claims"
                  className="flex items-center text-blue-700 hover:text-blue-900 transition-colors"
                >
                  <FileText size={20} className="mr-2" /> Process Claim
                </Link>
              )}
            </>
          )}
        </div>

        {/* Wallet Button */}
        <div>
          {isConnected ? (
            <div className="flex items-center space-x-2 bg-blue-100 px-3 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-blue-800 text-sm">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
          ) : (
            <button
              onClick={onConnect}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-50">
          <div className="flex flex-col items-start space-y-4 py-4 px-6">
            <Link
              to="/"
              className="flex items-center text-blue-700 hover:text-blue-900 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home size={20} className="mr-2" /> Home
            </Link>
            <Link
              to="/about"
              className="flex items-center text-blue-700 hover:text-blue-900 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User size={20} className="mr-2" /> About Us
            </Link>
            <Link
              to="/contact"
              className="flex items-center text-blue-700 hover:text-blue-900 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Contact size={20} className="mr-2" /> Contact
            </Link>

            {isConnected && (
              <>
                <Link
                  to="/policies"
                  className="flex items-center text-blue-700 hover:text-blue-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileText size={20} className="mr-2" /> Policies
                </Link>
                <Link
                  to="/claims"
                  className="flex items-center text-blue-700 hover:text-blue-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileText size={20} className="mr-2" /> Claims
                </Link>

                {isOwner && (
                  <Link
                    to="/process-claims"
                    className="flex items-center text-blue-700 hover:text-blue-900 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FileText size={20} className="mr-2" /> Process Claim
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
