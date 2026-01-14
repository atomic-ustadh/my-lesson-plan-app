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

  const handleAction = (lesson, mode) => {
    if (mode === "delete") {
      handleDelete(lesson.id);
    } else {
      // This handles 'view', 'edit', and 'duplicate'
      setSelectedLesson(lesson);
      setMode(mode);
      setShowForm(true);
    }
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

  const handleDelete = async (lessonId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lesson plan? This cannot be undone."
    );

    if (confirmed) {
      const { error } = await supabase
        .from("lesson_plans")
        .delete()
        .eq("id", lessonId);

      if (error) {
        alert("Error deleting lesson: " + error.message);
      } else {
        // Refresh the list to show the lesson is gone
        setRefreshKey((prev) => prev + 1);
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>
          Logged in as: <strong>{role}</strong>
        </span>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            setSession(null);
            setRole(null);
          }}
        >
          Sign Out
        </button>
      </nav>

      <hr />

      {/* --- SHARED MODAL ENGINE --- */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            top: "5%",
            left: "5%",
            right: "5%",
            bottom: "5%",
            background: "white",
            padding: "30px",
            boxShadow: "0 0 20px rgba(0,0,0,0.5)",
            overflowY: "auto",
            zIndex: 1000,
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ margin: 0 }}>{mode.toUpperCase()} LESSON</h2>
            <button
              onClick={() => setShowForm(false)}
              style={{ cursor: "pointer" }}
            >
              X
            </button>
          </div>
          <hr />
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

      {/* --- ROLE BASED DASHBOARDS --- */}
      {role === "admin" ? (
        <div>
          <h1>Admin Dashboard</h1>
          <p>Viewing all teacher activity (Read-Only).</p>
          <LessonList
            userId={session.user.id}
            isAdmin={true}
            refreshKey={refreshKey}
            onAction={(lesson, m) => handleAction(lesson, m)}
          />
        </div>
      ) : (
        <div>
          <h1>My Lesson Plans</h1>
          <button
            onClick={() => {
              setSelectedLesson(null);
              setMode("create");
              setShowForm(true);
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            + Create New Plan
          </button>

          <LessonList
            userId={session.user.id}
            refreshKey={refreshKey}
            isAdmin={false}
            onAction={(lesson, m) => handleAction(lesson, m)}
          />
        </div>
      )}
    </div>
  );
}

export default App;
