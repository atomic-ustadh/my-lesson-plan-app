import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Login from "./components/login";
import LessonForm from "./components/LessonForm";
import LessonList from "./components/LessonList";

function App() {
  const [refreshKey, setRefreshKey] = useState(0); // Used to force-refresh the list
  const [showForm, setShowForm] = useState(false); // Toggles the create form
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
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();
    setRole(data?.role);
    setLoading(false);
  }

  if (loading) return <div>Loading...</div>;

  if (!session) {
    return <Login onLoginSuccess={(userRole) => setRole(userRole)} />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <nav>
        <span>
          Logged in as: <strong>{role}</strong>
        </span>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            setSession(null);
            setRole(null);
          }}
          style={{ marginLeft: "10px" }}
        >
          Sign Out
        </button>
      </nav>

      <hr />

      {role === "admin" ? (
        <div>
          <h1>Admin Dashboard</h1>
          <p>Viewing all teacher activity (Read-Only).</p>
          <LessonList userId={session.user.id} isAdmin={true} />
        </div>
      ) : (
        <div>
          <h1>My Lesson Plans</h1>

          {/* Toggle the form visibility */}
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Create New Plan"}
          </button>

          {showForm && (
            <div
              style={{
                marginTop: "20px",
                border: "1px solid #ccc",
                padding: "15px",
              }}
            >
              <LessonForm
                userId={session.user.id}
                onSave={() => {
                  setRefreshKey((prev) => prev + 1); // This triggers the list to update
                  setShowForm(false); // Hide the form after saving
                }}
              />
            </div>
          )}

          <hr />

          {/* Notice the 'key' prop—it forces the list to reload when refreshKey changes */}
          <LessonList key={refreshKey} userId={session.user.id} />
        </div>
      )}
    </div>
  );
}

export default App;
