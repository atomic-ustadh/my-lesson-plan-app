import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function LessonForm({
  userId,
  // These props might be redundant now that we use params, but keeping for compatibility if embedded
  initialDataProp = null,
  modeProp = "create",
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(!!id);

  // Determine mode based on URL or props or state
  const isEditMode = location.search.includes("edit=true");
  const isDuplicate = !!location.state?.duplicateFrom;

  // Effective Mode: create, edit, view, duplicate
  let currentMode = "create";
  if (id) {
    currentMode = isEditMode ? "edit" : "view";
  } else if (isDuplicate) {
    currentMode = "duplicate";
  }

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
    "Mathematics", "English", "Science", "Social Studies", "Art",
    "Physical Education", "Music", "ICT",
  ];

  const classes = [
    "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6",
    "JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3",
  ];

  useEffect(() => {
    // If we have an ID, fetch the lesson
    if (id) {
      fetchLesson(id);
    } else if (isDuplicate && location.state?.duplicateFrom) {
      // Pre-fill from passed state
      populateForm(location.state.duplicateFrom, true);
    }
  }, [id, isDuplicate]);

  async function fetchLesson(lessonId) {
    try {
      const { data, error } = await supabase.from("lesson_plans").select("*").eq("id", lessonId).single();
      if (error) throw error;
      populateForm(data, false);
    } catch (err) {
      alert("Error loading lesson: " + err.message);
      navigate("/");
    } finally {
      setLoading(false);
    }
  }

  function populateForm(data, asCopy) {
    const c = data.content || {};
    setFormData({
      subject: data.subject || "",
      topic: asCopy ? `${data.title} (Copy)` : data.title || "",
      duration: c.duration || "",
      grade: data.grade_level || "",
      period: c.period || "",
      date: c.date || "",
      age: c.age || "",
      week: c.week || "",
      introduction: c.introduction || "",
      objectives: c.objectives || "",
      summary: c.summary || "",
      methodology: c.methodology || "",
      resources: c.resources || "",
      evaluation: c.evaluation || "",
      assignment: c.assignment || "",
      teacherComment: c.teacherComment || "",
      supervisorComment: c.supervisorComment || "",
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentMode === "view") return;

    const payload = {
      user_id: userId,
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
    if (currentMode === "edit") {
      result = await supabase
        .from("lesson_plans")
        .update(payload)
        .eq("id", id);
    } else {
      // create or duplicate = insert
      result = await supabase.from("lesson_plans").insert([payload]);
    }

    if (result.error) {
      alert(result.error.message);
    } else {
      navigate("/");
    }
  };

  const isReadOnly = currentMode === "view";

  if (loading) return <div className="text-center p-10">Loading form...</div>;

  return (
    <div className="bg-white shadow rounded-lg px-8 py-6">
      <div className="mb-6 flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {currentMode === "create" && "Create New Lesson"}
          {currentMode === "duplicate" && "Duplicate Lesson"}
          {currentMode === "edit" && "Edit Lesson"}
          {currentMode === "view" && "View Lesson"}
        </h2>
        <button
          onClick={() => navigate("/")}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕ Close
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Logistics - Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-gray-50 p-4 rounded-md">

          {/* SUBJECT */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject *</label>
            <select
              disabled={isReadOnly}
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            >
              <option value="">Select Subject</option>
              {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* TOPIC */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Topic *</label>
            <input
              disabled={isReadOnly}
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              required
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            />
          </div>

          {/* CLASS */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Class *</label>
            <select
              disabled={isReadOnly}
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              required
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            >
              <option value="">Select Class</option>
              {classes.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* DURATION */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration *</label>
            <input
              disabled={isReadOnly}
              placeholder="e.g. 40 mins"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            />
          </div>

          {/* PERIOD */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Period *</label>
            <input
              disabled={isReadOnly}
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              required
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            />
          </div>

          {/* DATE */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date *</label>
            <input
              type="date"
              disabled={isReadOnly}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            />
          </div>

          {/* WEEK */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Week *</label>
            <input
              disabled={isReadOnly}
              value={formData.week}
              onChange={(e) => setFormData({ ...formData, week: e.target.value })}
              required
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            />
          </div>
          {/* AVERAGE AGE - Added inside grid for better fit, maybe separate if tight */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Avg Age *</label>
            <input
              type="number"
              disabled={isReadOnly}
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              required
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* SECTION 2: Content Fields */}
        <div className="space-y-4">
          {[
            { label: "Introduction", key: "introduction", rows: 3 },
            { label: "Objectives", key: "objectives", rows: 4 },
            { label: "Summary / Content", key: "summary", rows: 5 },
            { label: "Methodology", key: "methodology", rows: 3 },
            { label: "Instructional Resources", key: "resources", rows: 2 },
            { label: "Evaluation", key: "evaluation", rows: 3 },
            { label: "Assignment", key: "assignment", rows: 2 },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label} {field.key !== 'assignment' && "*"}
              </label>
              <textarea
                rows={field.rows}
                disabled={isReadOnly}
                value={formData[field.key]}
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                required={field.key !== 'assignment'}
                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
              />
            </div>
          ))}
        </div>

        <hr className="border-gray-200" />

        {/* SECTION 3: Feedback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Teacher's Comment</label>
            <input
              disabled={isReadOnly}
              value={formData.teacherComment}
              onChange={(e) => setFormData({ ...formData, teacherComment: e.target.value })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Supervisor's Comment</label>
            <input
              disabled={isReadOnly}
              value={formData.supervisorComment}
              onChange={(e) => setFormData({ ...formData, supervisorComment: e.target.value })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isReadOnly ? "Close" : "Cancel"}
          </button>
          {!isReadOnly && (
            <button
              type="submit"
              className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {currentMode === "edit" ? "Update Lesson Plan" : "Save Lesson Plan"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
