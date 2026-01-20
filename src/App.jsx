import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Auth from "./components/Auth";
import LessonList from "./components/LessonList";
import LessonForm from "./components/LessonForm";

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!session) return <Navigate to="/login" replace />;

  return children;
}

function AppContent() {
  const { session, userRole } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!session ? <Auth /> : <Navigate to="/" />} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<LessonList userId={session?.user?.id} isAdmin={userRole === 'admin'} />} />
        <Route path="/lessons/new" element={<LessonForm userId={session?.user?.id} mode="create" />} />
        <Route path="/lessons/:id" element={<LessonForm userId={session?.user?.id} mode="edit" />} />
        {/* We might strictly need a wrapper for 'View' mode or just reuse the edit component with readOnly prop */}
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
