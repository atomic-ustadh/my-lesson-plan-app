import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Login from "./components/login";
import LessonForm from "./components/LessonForm";
import LessonList from "./components/LessonList";

function App() {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [mode, setMode] = useState("create");
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentView, setCurrentView] = useState("list");
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState(""); // Added missing state
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
      if (session) {
        fetchRole(session.user.id);
      } else {
        setRole(null);
        setUserName("");
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Helper function to get the user's role and name
  async function fetchRole(userId) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", userId)
        .single();

      if (error) throw error;

      setRole(data?.role || "teacher");
      setUserName(data?.full_name || "Teacher");
    } catch (err) {
      console.error("Profile fetch error:", err.message);
      setRole("teacher"); // Fallback
    } finally {
      setLoading(false); // Ensures loading stops even if fetch fails
    }
  }

  const handleAction = (lesson, mode) => {
    if (mode === "delete") {
      handleDelete(lesson.id);
    } else {
      setSelectedLesson(lesson);
      setMode(mode);
      setCurrentView("form");
    }
  };

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
        setRefreshKey((prev) => prev + 1);
      }
    }
  };

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        Loading Application...
      </div>
    );
  }

  if (!session) {
    return <Login onLoginSuccess={(userRole) => setRole(userRole)} />;
  }

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      {/* NAVIGATION BAR */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "20px",
          borderBottom: "1px solid #eee",
        }}
      >
        <span style={{ fontSize: "1.2rem" }}>
          📝 <strong>LessonPlanner</strong>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span>
            Logged in as: <strong>{userName}</strong> <small>({role})</small>
          </span>
          <button
            onClick={() => supabase.auth.signOut()}
            style={{ padding: "5px 10px", cursor: "pointer" }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* PAGE ROUTER */}
      <main style={{ marginTop: "20px" }}>
        {currentView === "form" ? (
          <div
            style={{
              background: "#f9f9f9",
              padding: "30px",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          >
            <button
              onClick={() => setCurrentView("list")}
              style={{ marginBottom: "20px", cursor: "pointer" }}
            >
              ← Back to Dashboard
            </button>
            <h2
              style={{
                marginBottom: "20px",
                borderBottom: "2px solid #333",
                paddingBottom: "10px",
              }}
            >
              {mode === "view"
                ? "View Lesson Details"
                : mode === "edit"
                ? "Edit Lesson Plan"
                : "Create New Lesson"}
            </h2>
            <LessonForm
              userId={session.user.id}
              initialData={selectedLesson}
              mode={mode}
              onClose={() => setCurrentView("list")}
              onSave={() => {
                setRefreshKey((prev) => prev + 1);
                setCurrentView("list");
              }}
            />
          </div>
        ) : (
          <div>
            <header
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h1>
                {role === "admin" ? "Global Activity" : "My Lesson Plans"}
              </h1>
              {role !== "admin" && (
                <button
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#007bff",
                    color: "white",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
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
