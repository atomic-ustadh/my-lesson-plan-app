import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Login from "./components/login";
import LessonForm from "./components/LessonForm";
import LessonList from "./components/LessonList";

function App() {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [mode, setMode] = useState("create"); // create, edit, view, duplicate
  const [refreshKey, setRefreshKey] = useState(0); // Used to force-refresh the list
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
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
      setCurrentView("form"); // Switch to the form page
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
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* NAVIGATION BAR (Always Visible) */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "20px",
          borderBottom: "1px solid #eee",
        }}
      >
        <span style={{ fontSize: "1.2rem" }}>
          📝 <strong>LessonPlanner</strong>
        </span>
        <div>
          <span style={{ marginRight: "15px" }}>{role.toUpperCase()}</span>
          <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
        </div>
      </nav>

      {/* PAGE ROUTER */}
      <main style={{ marginTop: "20px" }}>
        {currentView === "form" ? (
          /* --- THE LESSON PAGE --- */
          <div
            style={{
              background: "#f9f9f9",
              padding: "30px",
              borderRadius: "8px",
            }}
          >
            <button
              onClick={() => setCurrentView("list")}
              style={{ marginBottom: "20px" }}
            >
              ← Back to Dashboard
            </button>
            <h2 style={{ marginBottom: "20px" }}>
              {mode === "view"
                ? "Lesson Details"
                : mode === "edit"
                ? "Edit Lesson"
                : "New Lesson"}
            </h2>
            <LessonForm
              userId={session.user.id}
              initialData={selectedLesson}
              mode={mode}
              onClose={() => setCurrentView("list")}
              onSave={() => {
                setRefreshKey((prev) => prev + 1);
                setCurrentView("list"); // Go back to list after saving
              }}
            />
          </div>
        ) : (
          /* --- THE DASHBOARD PAGE --- */
          <div>
            <header
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h1>{role === "admin" ? "All Lessons" : "My Lessons"}</h1>
              {role !== "admin" && (
                <button
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#007bff",
                    color: "white",
                    borderRadius: "5px",
                    border: "none",
                  }}
                  onClick={() => {
                    setSelectedLesson(null);
                    setMode("create");
                    setCurrentView("form");
                  }}
                >
                  + Create New Lesson
                </button>
              )}
            </header>

            <LessonList
              userId={session.user.id}
              isAdmin={role === "admin"}
              refreshKey={refreshKey}
              onAction={handleAction}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
