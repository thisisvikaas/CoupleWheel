import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';

export default function SignUpForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (email === partnerEmail) {
      setError('Your email and partner email cannot be the same');
      return;
    }

    setLoading(true);

    const { user, error: signUpError, needsEmailConfirmation } = await authService.signUp(
      name,
      email,
      password,
      partnerEmail
    );

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Check if email confirmation is required
    if (needsEmailConfirmation) {
      setSuccess(
        `🎉 Account created! Check your email (${email}) for a confirmation link. After confirming, come back and log in!`
      );
      setLoading(false);
      return;
    }

    if (user) {
      setUser(user);
      navigate('/');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center stars-bg py-8">
      <div className="max-w-md w-full mx-4">
        <div className="card-gold">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-float">🎲</div>
            <h1 className="text-3xl font-black mb-2">
              <span className="neon-text">JOIN THE GAME</span>
            </h1>
            <p className="text-gray-400">Create your player account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/50 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-sm">
                ❌ {error}
              </div>
            )}

            {success && (
              <div className="bg-green-900/50 border border-green-500/50 text-green-300 px-4 py-3 rounded-xl text-sm">
                {success}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-bold text-yellow-400 mb-2">
                🎭 Your Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                required
                disabled={loading}
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-yellow-400 mb-2">
                📧 Your Email
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
              <label htmlFor="partnerEmail" className="block text-sm font-bold text-pink-400 mb-2">
                💕 Partner's Email
              </label>
              <input
                id="partnerEmail"
                type="email"
                value={partnerEmail}
                onChange={(e) => setPartnerEmail(e.target.value)}
                className="input-field"
                required
                disabled={loading}
                placeholder="partner@email.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Auto-linked when they sign up
              </p>
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
                minLength={6}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-yellow-400 mb-2">
                🔐 Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? '🎲 Creating...' : '🎰 CREATE ACCOUNT'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already playing?{' '}
              <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-bold">
                Log In 🎯
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
