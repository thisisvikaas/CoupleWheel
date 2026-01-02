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
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-purple-600">
              💑 Couples Wheel
            </Link>
            <div className="flex space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/tasks"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/tasks')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Task Pool
              </Link>
              <Link
                to="/current"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/current')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Current Week
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {partner && (
              <span className="text-sm text-gray-600">
                Partner: <span className="font-medium">{partner.name}</span>
              </span>
            )}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

