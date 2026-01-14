import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Login from "./components/login";
import LessonForm from "./components/LessonForm";
import LessonList from "./components/LessonList";

function App() {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [mode, setMode] = useState("create"); // create, edit, view, duplicate
  const [refreshKey, setRefreshKey] = useState(0); // Used to force-refresh the list
  const [showForm, setShowForm] = useState(false); // Toggles the create form
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const openForm = (lesson = null, currentMode = "create") => {
    setSelectedLesson(lesson);
    setMode(currentMode);
    setShowForm(true);
  };

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
          <button onClick={() => openForm(null, "create")}>
            + Create New Plan
          </button>

          {showForm && (
            <div
              style={{
                position: "fixed",
                top: "10%",
                left: "10%",
                right: "10%",
                bottom: "10%",
                background: "white",
                padding: "30px",
                boxShadow: "0 0 20px rgba(0,0,0,0.5)",
                overflowY: "auto",
                zIndex: 1000,
              }}
            >
              <h2>{mode.toUpperCase()} LESSON</h2>
              <LessonForm
                userId={session.user.id}
                initialData={selectedLesson}
                mode={mode}
                onClose={() => setShowForm(false)}
                onSave={() => {
                  setRefreshKey((prev) => prev + 1);
                  setShowForm(false);
                }}
              />
            </div>
          )}

          <LessonList
            userId={session.user.id}
            refreshKey={refreshKey}
            onAction={(lesson, m) => openForm(lesson, m)}
          />
        </div>
      )}
    </div>
  );
}

export default App;
