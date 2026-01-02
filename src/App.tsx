import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useAuthStore } from './store/authStore';

// Pages (will be created)
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import Dashboard from './pages/Dashboard';
import TaskPool from './pages/TaskPool';
import CurrentWeek from './pages/CurrentWeek';
import EmailConfirmed from './pages/EmailConfirmed';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const { setUser, setLoading, setPartner } = useAuthStore();
  const [emailConfirmationMessage, setEmailConfirmationMessage] = useState<string | null>(null);

  useEffect(() => {
    // Handle email confirmation from URL hash (Supabase sends tokens in URL)
    const handleEmailConfirmation = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      // Check for query params too (some Supabase versions use this)
      const queryParams = new URLSearchParams(window.location.search);
      const tokenHash = queryParams.get('token_hash');
      const tokenType = queryParams.get('type');

      if (accessToken && refreshToken && type === 'signup') {
        console.log('Processing email confirmation from hash...');
        // Set the session with the tokens from the URL
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        
        if (error) {
          console.error('Error confirming email:', error);
          setEmailConfirmationMessage('Error confirming email. Please try again.');
        } else {
          console.log('Email confirmed successfully!');
          setEmailConfirmationMessage('Email confirmed successfully! You can now log in.');
          // Clear the hash from URL
          window.history.replaceState(null, '', window.location.pathname);
        }
      } else if (tokenHash && tokenType === 'email') {
        console.log('Processing email confirmation from query params...');
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'email',
        });
        
        if (error) {
          console.error('Error confirming email:', error);
          setEmailConfirmationMessage('Error confirming email. Please try again.');
        } else {
          console.log('Email confirmed successfully!');
          setEmailConfirmationMessage('Email confirmed successfully! You can now log in.');
          // Clear query params from URL
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    };

    handleEmailConfirmation();

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Fetch user data from users table
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle()
          .then(({ data }) => {
            setUser(data);
            
            // Fetch partner if exists
            if (data?.partner_id) {
              supabase
                .from('users')
                .select('*')
                .eq('id', data.partner_id)
                .maybeSingle()
                .then(({ data: partnerData }) => {
                  setPartner(partnerData);
                });
            }
          });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (session?.user) {
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle()
          .then(({ data }) => {
            setUser(data);
            
            if (data?.partner_id) {
              supabase
                .from('users')
                .select('*')
                .eq('id', data.partner_id)
                .maybeSingle()
                .then(({ data: partnerData }) => {
                  setPartner(partnerData);
                });
            }
          });
      } else {
        setUser(null);
        setPartner(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading, setPartner]);

  // Show confirmation message if present
  if (emailConfirmationMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
        <div className="max-w-md w-full mx-4">
          <div className="card text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2 text-green-600">
              Email Confirmed!
            </h2>
            <p className="text-gray-600 mb-4">{emailConfirmationMessage}</p>
            <a href="/login" className="btn-primary inline-block">
              Go to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="/email-confirmed" element={<EmailConfirmed />} />
      <Route path="/" element={<ProtectedRoute />}>
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<TaskPool />} />
        <Route path="current" element={<CurrentWeek />} />
      </Route>
    </Routes>
  );
}

export default App;

