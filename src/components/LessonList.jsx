import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { getSubjects, getWeeks } from "../constants";

export default function LessonList({ userId, isAdmin, refreshKey, onAction }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState("");
  const [filterWeek, setFilterWeek] = useState("");
  const [filterTeacher, setFilterTeacher] = useState("");

  const [uniqueTeachers, setUniqueTeachers] = useState([]);

  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const subjects = getSubjects(language);
  const weeks = getWeeks(language);

  useEffect(() => {
    fetchLessons();
  }, [refreshKey, isAdmin, filterSubject, filterWeek, filterTeacher]);

  useEffect(() => {
    fetchFilterOptions();
  }, [isAdmin]);

  const fetchFilterOptions = async () => {
    // 1. Fetch unique teachers (if Admin)
    if (isAdmin) {
      const { data: teachersData } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("role", "teacher");

      if (teachersData) {
        setUniqueTeachers(teachersData.map(t => t.full_name).sort());
      }
    }
  };

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

    // Apply Filters
    if (filterSubject) {
      query = query.eq("subject", filterSubject);
    }
    if (filterWeek) {
      // Use JSONB containment operator for nested field
      query = query.filter("content", "cs", JSON.stringify({ week: filterWeek }));
    }
    if (isAdmin && filterTeacher) {
      query = query.filter("profiles.full_name", "eq", filterTeacher);
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {isAdmin ? t("allLessons") : t("myLessons")}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          {/* Filter UI */}
          <div className="flex flex-wrap items-center gap-2 bg-gray-100 p-2 rounded-lg border border-gray-200 shadow-inner">
            <span className="text-xs font-semibold text-gray-400 px-2 uppercase tracking-wider">{t("filterTitle")}</span>

            {/* Subject Filter */}
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="text-sm border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 py-1 bg-white"
            >
              <option value="">{t("filterAllSubjects")}</option>
              {subjects.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>

            {/* Week Filter */}
            <select
              value={filterWeek}
              onChange={(e) => setFilterWeek(e.target.value)}
              className="text-sm border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 py-1 bg-white"
            >
              <option value="">{t("filterAllWeeks")}</option>
              {weeks.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
            </select>

            {/* Teacher Filter (Admin Only) */}
            {isAdmin && (
              <select
                value={filterTeacher}
                onChange={(e) => setFilterTeacher(e.target.value)}
                className="text-sm border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 py-1 bg-white"
              >
                <option value="">{t("filterAllTeachers")}</option>
                {uniqueTeachers.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            )}

            {(filterSubject || filterWeek || (isAdmin && filterTeacher)) && (
              <button
                onClick={() => {
                  setFilterSubject("");
                  setFilterWeek("");
                  setFilterTeacher("");
                }}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium px-2 underline underline-offset-4"
              >
                {t("filterClear")}
              </button>
            )}
          </div>

          {!isAdmin && (
            <button
              onClick={() => navigate("/lessons/new")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              {t("newLesson")}
            </button>
          )}
        </div>
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
                      {!isAdmin && (
                        <button
                          onClick={() => handleDuplicate(lesson)}
                          className="text-gray-600 hover:text-gray-900 me-4"
                        >
                          {t("btnCopy")}
                        </button>
                      )}
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
