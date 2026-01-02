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
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  // Generate Gmail search URL with filter for Supabase confirmation email
  const getGmailUrl = () => {
    const searchQuery = 'from:noreply subject:"Confirm your signup"';
    return `https://mail.google.com/mail/u/0/#search/${encodeURIComponent(searchQuery)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailSent(false);

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

    try {
      console.log('Starting signup...');
      const result = await authService.signUp(
        name,
        email,
        password,
        partnerEmail
      );

      console.log('Signup result:', result);

      const { user, error: signUpError, needsEmailConfirmation } = result;

      if (signUpError) {
        console.error('Signup error:', signUpError);
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // If no user returned and no error, email confirmation is needed
      // Or if explicitly flagged
      if (needsEmailConfirmation || !user) {
        console.log('Email confirmation needed, showing confirmation screen');
        setEmailSent(true);
        setLoading(false);
        return;
      }

      if (user) {
        console.log('User created, navigating to dashboard');
        setUser(user);
        navigate('/');
      }
    } catch (err) {
      console.error('Unexpected error during signup:', err);
      setError((err as Error).message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Show email confirmation screen
  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center stars-bg py-8">
        <div className="max-w-md w-full mx-4">
          <div className="card-gold text-center">
            <div className="text-7xl mb-6 animate-float">📧</div>
            <h1 className="text-3xl font-black mb-4">
              <span className="neon-text">CHECK YOUR EMAIL!</span>
            </h1>
            
            <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
              <p className="text-gray-300 mb-2">We sent a confirmation link to:</p>
              <p className="text-yellow-400 font-bold text-lg">{email}</p>
            </div>

            <p className="text-gray-400 mb-6">
              Click the link in the email to verify your account, then come back to log in!
            </p>

            {/* Gmail Button */}
            <a
              href={getGmailUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full btn-primary text-lg py-4 flex items-center justify-center gap-3 mb-4"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
              </svg>
              Open Gmail
            </a>

            {/* Other email providers */}
            <div className="flex gap-2 justify-center mb-6">
              <a
                href="https://outlook.live.com/mail/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm py-2 px-4"
              >
                Outlook
              </a>
              <a
                href="https://mail.yahoo.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm py-2 px-4"
              >
                Yahoo
              </a>
              <a
                href="https://www.icloud.com/mail"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm py-2 px-4"
              >
                iCloud
              </a>
            </div>

            <div className="border-t border-yellow-500/30 pt-4">
              <p className="text-gray-500 text-sm mb-3">Already confirmed?</p>
              <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-bold">
                Go to Login 🎯
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
