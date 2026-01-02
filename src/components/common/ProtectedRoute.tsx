import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Navbar from './Navbar';

export default function ProtectedRoute() {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center stars-bg">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-yellow-500/30 rounded-full"></div>
          <div className="w-24 h-24 border-4 border-t-yellow-400 rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="mt-6 text-2xl font-bold text-yellow-400 glow-gold animate-pulse">
          Loading Casino...
        </p>
        <p className="mt-2 text-purple-400">Preparing your experience</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
