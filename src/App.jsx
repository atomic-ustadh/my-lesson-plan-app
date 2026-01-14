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
  const [userName, setUserName] = useState(""); // Crucial: Must be defined
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

  async function fetchRole(userId) {
    try {
      // Fetch both role and full_name for the header
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
      setRole("teacher");
      setUserName("Teacher");
    } finally {
      setLoading(false);
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
      "Are you sure you want to delete this lesson?"
    );
    if (confirmed) {
      const { error } = await supabase
        .from("lesson_plans")
        .delete()
        .eq("id", lessonId);
      if (error) alert(error.message);
      else setRefreshKey((prev) => prev + 1);
    }
  };

  if (loading)
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        Loading LessonPlanner...
      </div>
    );

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
        <div>
          <span style={{ marginRight: "15px" }}>
            Logged in as: <strong>{userName}</strong> ({role})
          </span>
          <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
        </div>
      </nav>

      {/* PAGE ROUTER */}
      <main style={{ marginTop: "20px" }}>
        {currentView === "form" ? (
          <div>
            <button
              onClick={() => setCurrentView("list")}
              style={{ marginBottom: "20px" }}
            >
              ← Back
            </button>
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
              }}
            >
              <h1>{role === "admin" ? "All Lesson Plans" : "My Lessons"}</h1>
              {role !== "admin" && (
                <button
                  onClick={() => {
                    setSelectedLesson(null);
                    setMode("create");
                    setCurrentView("form");
                  }}
                  style={{
                    padding: "10px 20px",
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  + New Lesson
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
