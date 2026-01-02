import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    const { user, error: loginError } = await authService.login(email, password);

    if (loginError) {
      // Provide more helpful error messages
      if (loginError.message.includes('Email not confirmed')) {
        setInfo('Please check your email and click the confirmation link before logging in.');
        setError('Email not confirmed yet');
      } else if (loginError.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please check and try again.');
      } else {
        setError(loginError.message);
      }
      setLoading(false);
      return;
    }

    if (user) {
      setUser(user);
      navigate('/');
    } else {
      setError('Login failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center stars-bg py-8">
      <div className="max-w-md w-full mx-4">
        <div className="card-gold">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-float">🎰</div>
            <h1 className="text-3xl font-black mb-2">
              <span className="neon-text">COUPLES CASINO</span>
            </h1>
            <p className="text-gray-400">Enter your credentials to play</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/50 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl">
                ❌ {error}
              </div>
            )}

            {info && (
              <div className="bg-blue-900/50 border border-blue-500/50 text-blue-300 px-4 py-3 rounded-xl text-sm">
                📧 {info}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-yellow-400 mb-2">
                📧 Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
                disabled={loading}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-yellow-400 mb-2">
                🔐 Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
                disabled={loading}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary text-lg py-4"
              disabled={loading}
            >
              {loading ? '🎲 Loading...' : '🎰 ENTER CASINO'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              New player?{' '}
              <Link to="/signup" className="text-yellow-400 hover:text-yellow-300 font-bold">
                Create Account 🎯
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
