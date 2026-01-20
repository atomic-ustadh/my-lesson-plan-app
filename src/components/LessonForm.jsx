import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function LessonForm({ userId, onSave }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Determine mode: 'create', 'edit', 'view', or 'duplicate'
  const isEdit = Boolean(id && location.search.includes("edit=true"));
  const isView = Boolean(id && !isEdit);
  const duplicateFrom = location.state?.duplicateFrom;
  const isDuplicate = Boolean(duplicateFrom);
  const isCreate = !id && !isDuplicate;

  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    duration: "",
    grade: "",
    period: "",
    date: "",
    age: "",
    week: "",
    introduction: "",
    objectives: "",
    summary: "",
    methodology: "",
    resources: "",
    evaluation: "",
    assignment: "",
    teacherComment: "",
    supervisorComment: "",
  });

  const subjects = [
    "Quran",
    "Islamic Studies",
    "Arabic",
    "English",
    "Mathematics",
    "Science",
    "Social Studies",
    "Computer Science",
    "Art",
    "PE",
  ];

  const classes = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

  useEffect(() => {
    if (id) {
      fetchLesson(id);
    } else if (isDuplicate) {
      populateForm(duplicateFrom, true);
    }
  }, [id, duplicateFrom]);

  const fetchLesson = async (lessonId) => {
    const { data, error } = await supabase.from("lesson_plans").select("*").eq("id", lessonId).single();
    if (error) console.error("Error fetching lesson:", error);
    else populateForm(data, false);
  }

  const populateForm = (data, isCopy) => {
    setFormData({
      subject: data.subject || "",
      topic: isCopy ? `${data.title} (Copy)` : data.title || "",
      duration: data.content?.duration || "",
      grade: data.grade_level || "",
      period: data.content?.period || "",
      date: isCopy ? "" : (data.content?.date || ""),
      age: data.content?.age || "",
      week: data.content?.week || "",
      introduction: data.content?.introduction || "",
      objectives: data.content?.objectives || "",
      summary: data.content?.summary || "",
      methodology: data.content?.methodology || "",
      resources: data.content?.resources || "",
      evaluation: data.content?.evaluation || "",
      assignment: data.content?.assignment || "",
      teacherComment: data.content?.teacherComment || "",
      supervisorComment: data.content?.supervisorComment || "",
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isView) return;

    const payload = {
      user_id: userId, // Ensure userId is passed/available
      subject: formData.subject,
      title: formData.topic,
      grade_level: formData.grade,
      content: {
        duration: formData.duration,
        period: formData.period,
        date: formData.date,
        age: formData.age,
        week: formData.week,
        introduction: formData.introduction,
        objectives: formData.objectives,
        summary: formData.summary,
        methodology: formData.methodology,
        resources: formData.resources,
        evaluation: formData.evaluation,
        assignment: formData.assignment,
        teacherComment: formData.teacherComment,
        supervisorComment: formData.supervisorComment,
      },
    };

    let result;
    if (isEdit) {
      result = await supabase
        .from("lesson_plans")
        .update(payload)
        .eq("id", id);
    } else {
      // Create or Duplicate (Insert new)
      const { data: { user } } = await supabase.auth.getUser();
      payload.user_id = user.id; // Ensure we attach the current user
      result = await supabase.from("lesson_plans").insert([payload]);
    }

    if (result.error) alert(result.error.message);
    else {
      navigate("/"); // Go back to list
    }
  };

  const isReadOnly = isView;

  const getTitle = () => {
    if (isEdit) return t("editLesson");
    if (isView) return t("viewLesson");
    return t("createLesson");
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">{getTitle()}</h2>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-gray-500 hover:text-gray-700 font-medium text-sm"
        >
          ✕ {t("closeBtn")}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* SECTION 1: Logistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("lblSubject")} <span className="text-red-500">*</span></label>
            <select
              disabled={isReadOnly}
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            >
              <option value="">{t("phSubject")}</option>
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("lblTopic")} <span className="text-red-500">*</span></label>
            <input
              type="text"
              disabled={isReadOnly}
              value={formData.topic}
              placeholder={t("phTopic")}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("lblDate")}</label>
            <input
              type="date"
              disabled={isReadOnly}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("lblDuration")}</label>
            <input
              type="number"
              disabled={isReadOnly}
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("lblGrade")}</label>
            <select
              disabled={isReadOnly}
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            >
              <option value="">Select Grade</option>
              {classes.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("lblPeriod")}</label>
            <input
              type="text"
              disabled={isReadOnly}
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("lblAge")}</label>
            <input
              type="text"
              disabled={isReadOnly}
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("lblWeek")}</label>
            <input
              type="number"
              disabled={isReadOnly}
              value={formData.week}
              onChange={(e) => setFormData({ ...formData, week: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* SECTION 2: Core Content */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("lblIntro")}</label>
            <textarea
              rows={3}
              disabled={isReadOnly}
              placeholder={t("phIntro")}
              value={formData.introduction}
              onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("lblObjectives")}</label>
            <textarea
              rows={4}
              disabled={isReadOnly}
              placeholder={t("phObj")}
              value={formData.objectives}
              onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("lblSummary")}</label>
            <textarea
              rows={3}
              disabled={isReadOnly}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("lblMethod")}</label>
            <textarea
              rows={3}
              disabled={isReadOnly}
              value={formData.methodology}
              onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("lblResources")}</label>
            <textarea
              rows={2}
              disabled={isReadOnly}
              value={formData.resources}
              onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("lblEval")}</label>
            <textarea
              rows={2}
              disabled={isReadOnly}
              value={formData.evaluation}
              onChange={(e) => setFormData({ ...formData, evaluation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("lblAssign")}</label>
            <textarea
              rows={2}
              disabled={isReadOnly}
              value={formData.assignment}
              onChange={(e) => setFormData({ ...formData, assignment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* SECTION 3: Comments (Admin Only or Read Only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("lblTComment")}</label>
            <textarea
              rows={2}
              disabled={isReadOnly}
              value={formData.teacherComment}
              onChange={(e) => setFormData({ ...formData, teacherComment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("lblSComment")}</label>
            <textarea
              rows={2}
              disabled={isReadOnly} // Typically only admin/supervisor would edit this, but keeping logic simple for now
              value={formData.supervisorComment}
              onChange={(e) => setFormData({ ...formData, supervisorComment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t("cancelBtn")}
          </button>
          {!isReadOnly && (
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isEdit ? t("updateBtn") : t("saveBtn")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
