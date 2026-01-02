import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/supabaseClient';

export default function Navbar() {
  const { user, partner } = useAuthStore();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900/50 to-slate-900 border-b border-purple-500/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-black">
              <span className="neon-text">🎰 COUPLES CASINO</span>
            </Link>
            <div className="hidden md:flex space-x-2">
              <Link
                to="/"
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive('/')
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black'
                    : 'text-gray-300 hover:text-yellow-400 hover:bg-slate-800/50'
                }`}
              >
                🏠 Home
              </Link>
              <Link
                to="/tasks"
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive('/tasks')
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black'
                    : 'text-gray-300 hover:text-yellow-400 hover:bg-slate-800/50'
                }`}
              >
                📝 Tasks
              </Link>
              <Link
                to="/current"
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive('/current')
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black'
                    : 'text-gray-300 hover:text-yellow-400 hover:bg-slate-800/50'
                }`}
              >
                🎯 Challenge
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {partner && (
              <span className="text-sm text-purple-300 hidden sm:inline">
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
        </div>
      </div>
    </nav>
  );
}
