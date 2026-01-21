import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function LessonList({ userId, isAdmin, refreshKey, onAction }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    fetchLessons();
  }, [refreshKey, isAdmin]); // Refetch when refreshKey or role changes

  const fetchLessons = async () => {
    setLoading(true);
    let query = supabase.from("lesson_plans").select(`
      *,
      profiles!user_id (
          full_name
      )
    `);

    if (!isAdmin) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;
    if (error) console.error("Error fetching lessons:", error);
    else setLessons(data || []);
    setLoading(false);
  };

  const handleDuplicate = (lesson) => {
    // Navigate to form with "duplicateFrom" state
    navigate("/lessons/new", { state: { duplicateFrom: lesson } });
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t("confirmDelete"))) return;

    const { error } = await supabase.from("lesson_plans").delete().eq("id", id);
    if (error) alert(error.message);
    else {
      fetchLessons(); // Local refresh just in case
      if (onAction) onAction(); // Trigger parent refresh if needed
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading lessons...</div>;

  return (
    <div className="space-y-6 w-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isAdmin ? t("allLessons") : t("myLessons")}
        </h1>
        {!isAdmin && (
          <button
            onClick={() => navigate("/lessons/new")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
          >
            {t("newLesson")}
          </button>
        )}
      </div>

      <div className="bg-white w-full shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t("colWeek")}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t("colTopic")}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t("colSubject")}</th>
                {isAdmin && <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t("colTeacher")}</th>}
                <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase tracking-wider">{t("colActions")}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lessons.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="px-6 py-10 text-center text-gray-500">
                    {t("noLessons")}
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
                    <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                      <button
                        onClick={() => navigate(`/lessons/${lesson.id}`)}
                        className="text-blue-600 hover:text-blue-900 me-4"
                      >
                        {t("btnView")}
                      </button>

                      <button
                        onClick={() => navigate(`/lessons/${lesson.id}?edit=true`)}
                        className="text-indigo-600 hover:text-indigo-900 me-4"
                      >
                        {t("btnEdit")}
                      </button>
                      <button
                        onClick={() => handleDuplicate(lesson)}
                        className="text-gray-600 hover:text-gray-900 me-4"
                      >
                        {t("btnCopy")}
                      </button>
                      <button
                        onClick={() => handleDelete(lesson.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        {t("btnDelete")}
                      </button>
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
