import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/supabaseClient';

export default function Navbar() {
  const { user, partner } = useAuthStore();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { path: '/', label: '🏠 Home' },
    { path: '/tasks', label: '📝 Tasks' },
    { path: '/current', label: '🎯 Challenge' },
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900/50 to-slate-900 border-b border-purple-500/30 relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo */}
          <Link to="/" className="text-lg md:text-xl font-black" onClick={closeMenu}>
            <span className="neon-text">🎰 CASINO</span>
            <span className="neon-text hidden sm:inline"> COUPLES</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive(link.path)
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black'
                    : 'text-gray-300 hover:text-yellow-400 hover:bg-slate-800/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop User Info */}
          <div className="hidden md:flex items-center space-x-4">
            {partner && (
              <span className="text-sm text-purple-300">
                💕 <span className="text-pink-400 font-bold">{partner.name}</span>
              </span>
            )}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-yellow-400">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm text-gray-400 hover:text-red-400 hover:bg-slate-800/50 rounded-lg transition-all"
              >
                Exit 🚪
              </button>
            </div>
          </div>

          {/* Mobile: User name + Hamburger */}
          <div className="flex md:hidden items-center space-x-3">
            <span className="text-sm font-bold text-yellow-400 truncate max-w-[80px]">
              {user?.name}
            </span>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-yellow-400 hover:bg-slate-800/50 rounded-lg transition-all"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                // Close icon
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger icon
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-14 right-0 w-64 h-[calc(100vh-3.5rem)] bg-gradient-to-b from-slate-900 to-purple-900/90 border-l border-purple-500/30 transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Partner info */}
          {partner && (
            <div className="px-4 py-3 border-b border-purple-500/30 bg-slate-800/50">
              <span className="text-sm text-purple-300">
                Playing with 💕 <span className="text-pink-400 font-bold">{partner.name}</span>
              </span>
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className={`block px-6 py-4 text-lg font-bold transition-all ${
                  isActive(link.path)
                    ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border-l-4 border-yellow-500'
                    : 'text-gray-300 hover:text-yellow-400 hover:bg-slate-800/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t border-purple-500/30">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-center font-bold text-red-400 hover:bg-red-500/20 rounded-xl transition-all border border-red-500/30"
            >
              🚪 Exit Game
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
