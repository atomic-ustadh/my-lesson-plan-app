import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from './components/login';

function App() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check for current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchRole(session.user.id);
      else setLoading(false);
    });

    // 2. Listen for sign-in/sign-out changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchRole(session.user.id);
      else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Helper function to get the user's role
  async function fetchRole(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    setRole(data?.role);
    setLoading(false);
  }

  if (loading) return <div>Loading...</div>;

  if (!session) {
    return <Login onLoginSuccess={(userRole) => setRole(userRole)} />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <nav>
        <span>Logged in as: <strong>{role}</strong></span>
        <button onClick={() => supabase.auth.signOut()} style={{ marginLeft: '10px' }}>
          Sign Out
        </button>
      </nav>

      <hr />

      {role === 'admin' ? (
        <div>
          <h1>Admin Dashboard</h1>
          <p>You can see all lesson plans here (Read-Only).</p>
          {/* We will build the AdminTable component next */}
        </div>
      ) : (
        <div>
          <h1>My Lesson Plans</h1>
          <button>+ Create New Plan</button>
          {/* We will build the LessonList component next */}
        </div>
      )}
    </div>
  );
}

export default App;