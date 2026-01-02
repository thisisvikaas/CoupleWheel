import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/supabaseClient';

export default function EmailConfirmed() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if this is an email confirmation callback
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');

    if (type === 'signup' && accessToken) {
      // Email was confirmed successfully
      setStatus('success');
      setMessage('Email confirmed successfully!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else if (type === 'recovery') {
      // Password recovery
      navigate('/reset-password');
    } else {
      // Check if user is already logged in
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setStatus('success');
          setMessage('You are already logged in!');
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          setStatus('error');
          setMessage('Invalid confirmation link or link expired.');
        }
      });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
      <div className="max-w-md w-full mx-4">
        <div className="card text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold mb-2">Confirming your email...</h2>
              <p className="text-gray-600">Please wait a moment</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold mb-2 text-green-600">
                Email Confirmed!
              </h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">
                Redirecting you to login page...
              </p>
              <Link to="/login" className="btn-primary mt-4 inline-block">
                Go to Login Now
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold mb-2 text-red-600">
                Confirmation Failed
              </h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <div className="space-y-2">
                <Link to="/signup" className="btn-primary inline-block">
                  Sign Up Again
                </Link>
                <br />
                <Link to="/login" className="text-purple-600 hover:text-purple-700 text-sm">
                  Already have an account? Log in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

