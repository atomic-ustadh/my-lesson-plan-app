import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function LessonList({
  userId,
  isAdmin = false,
}) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLessons();
  }, [refreshKey, userId]);

  async function fetchLessons() {
    setLoading(true);
    try {
      let query = supabase.from("lesson_plans").select(`
        *,
        profiles!user_id (
          full_name
        )
      `);

      if (!isAdmin) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;
      setLessons(data || []);
    } catch (error) {
      console.error("Error fetching lessons:", error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (lessonId) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      const { error } = await supabase.from("lesson_plans").delete().eq("id", lessonId);
      if (error) alert(error.message);
      else setRefreshKey(k => k + 1);
    }
  };

  const handleDuplicate = async (lesson) => {
    // In a real app we might navigate to a 'create' page with pre-filled state
    // For now, simpler to perhaps navigate to /lessons/new with state
    navigate("/lessons/new", { state: { duplicateFrom: lesson } });
  }

  if (loading) return <div className="text-center py-10 text-gray-500">Loading lessons...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isAdmin ? "All Lesson Plans" : "My Lessons"}
        </h1>
        {!isAdmin && (
          <button
            onClick={() => navigate("/lessons/new")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
          >
            + New Lesson
          </button>
        )}
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lessons.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="px-6 py-10 text-center text-gray-500">
                    No lesson plans found.
                  </td>
                </tr>
              ) : (
                lessons.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lesson.content?.week || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lesson.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {lesson.subject}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lesson.profiles?.full_name || "Unknown"}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/lessons/${lesson.id}`)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View
                      </button>

                      {!isAdmin && (
                        <>
                          <button
                            onClick={() => navigate(`/lessons/${lesson.id}?edit=true`)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDuplicate(lesson)}
                            className="text-gray-600 hover:text-gray-900 mr-4"
                          >
                            Copy
                          </button>
                          <button
                            onClick={() => handleDelete(lesson.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
