import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useAuthStore } from './store/authStore';

// Pages (will be created)
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import Dashboard from './pages/Dashboard';
import TaskPool from './pages/TaskPool';
import CurrentWeek from './pages/CurrentWeek';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const { setUser, setLoading, setPartner } = useAuthStore();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Fetch user data from users table
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            setUser(data);
            
            // Fetch partner if exists
            if (data?.partner_id) {
              supabase
                .from('users')
                .select('*')
                .eq('id', data.partner_id)
                .single()
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
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            setUser(data);
            
            if (data?.partner_id) {
              supabase
                .from('users')
                .select('*')
                .eq('id', data.partner_id)
                .single()
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

  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="/" element={<ProtectedRoute />}>
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<TaskPool />} />
        <Route path="current" element={<CurrentWeek />} />
      </Route>
    </Routes>
  );
}

export default App;

