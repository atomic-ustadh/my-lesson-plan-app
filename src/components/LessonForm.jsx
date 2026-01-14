import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function LessonForm({
  userId,
  onSave,
  initialData = null,
  mode = "create",
  onClose,
}) {
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
    "Mathematics",
    "English",
    "Science",
    "Social Studies",
    "Art",
    "Physical Education",
    "Music",
    "ICT",
  ];
  const classes = [
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "JSS 1",
    "JSS 2",
    "JSS 3",
    "SSS 1",
    "SSS 2",
    "SSS 3",
  ];

  useEffect(() => {
    if (initialData) {
      const c = initialData.content || {};
      setFormData({
        subject: initialData.subject || "",
        topic:
          mode === "duplicate"
            ? `${initialData.title} (Copy)`
            : initialData.title || "",
        duration: c.duration || "",
        grade: initialData.grade_level || "",
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
    } else {
      // CLEANUP: Reset form when creating a brand new lesson
      setFormData({
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
    }
  }, [initialData, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "view") return;

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
    if (mode === "edit") {
      result = await supabase
        .from("lesson_plans")
        .update(payload)
        .eq("id", initialData.id);
    } else {
      // Both 'create' and 'duplicate' use insert
      result = await supabase.from("lesson_plans").insert([payload]);
    }

    if (result.error) alert(result.error.message);
    else onSave();
  };

const isReadOnly = mode === "view";

return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* SECTION 1: Logistics */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* SUBJECT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* TOPIC */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic <span className="text-red-500">*</span>
            </label>
            <input
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={formData.topic}
              onChange={(e) =>
                setFormData({ ...formData, topic: e.target.value })
              }
              required
            />
          </div>

          {/* DURATION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration <span className="text-red-500">*</span>
            </label>
            <input
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="e.g. 40 mins"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              required
            />
          </div>

          {/* GRADE / CLASS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class <span className="text-red-500">*</span>
            </label>
            <select
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={formData.grade}
              onChange={(e) =>
                setFormData({ ...formData, grade: e.target.value })
              }
              required
            >
              <option value="">Select Class</option>
              {classes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* PERIOD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Period <span className="text-red-500">*</span>
            </label>
            <input
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={formData.period}
              onChange={(e) =>
                setFormData({ ...formData, period: e.target.value })
              }
              required
            />
          </div>

          {/* DATE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          {/* AVERAGE AGE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Average Age <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              required
            />
          </div>

          {/* WEEK */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Week <span className="text-red-500">*</span>
            </label>
            <input
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={formData.week}
              onChange={(e) => setFormData({ ...formData, week: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6"></div>

      {/* SECTION 2: Instructional Content */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Introduction <span className="text-red-500">*</span>
          </label>
          <input
            disabled={isReadOnly}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            value={formData.introduction}
            onChange={(e) =>
              setFormData({ ...formData, introduction: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Objectives <span className="text-red-500">*</span>
          </label>
          <textarea
            disabled={isReadOnly}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed min-h-[80px]"
            value={formData.objectives}
            onChange={(e) =>
              setFormData({ ...formData, objectives: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Summary / Content <span className="text-red-500">*</span>
          </label>
          <textarea
            disabled={isReadOnly}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed min-h-[150px]"
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Methodology <span className="text-red-500">*</span>
          </label>
          <textarea
            disabled={isReadOnly}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed min-h-[80px]"
            value={formData.methodology}
            onChange={(e) =>
              setFormData({ ...formData, methodology: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instructional Resources <span className="text-red-500">*</span>
          </label>
          <textarea
            disabled={isReadOnly}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed min-h-[80px]"
            value={formData.resources}
            onChange={(e) =>
              setFormData({ ...formData, resources: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Evaluation <span className="text-red-500">*</span>
          </label>
          <textarea
            disabled={isReadOnly}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed min-h-[80px]"
            value={formData.evaluation}
            onChange={(e) =>
              setFormData({ ...formData, evaluation: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assignment (Optional)
          </label>
          <textarea
            disabled={isReadOnly}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed min-h-[80px]"
            value={formData.assignment}
            onChange={(e) =>
              setFormData({ ...formData, assignment: e.target.value })
            }
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6"></div>

      {/* SECTION 3: Feedback */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teacher's Comment
          </label>
          <input
            disabled={isReadOnly}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            value={formData.teacherComment}
            onChange={(e) =>
              setFormData({ ...formData, teacherComment: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Supervisor's Comment
          </label>
          <input
            disabled={isReadOnly}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            value={formData.supervisorComment}
            onChange={(e) =>
              setFormData({ ...formData, supervisorComment: e.target.value })
            }
          />
        </div>
      </div>

      {/* FOOTER BUTTONS */}
      <div className="flex gap-4 pt-6">
        {!isReadOnly && (
          <button
            type="submit"
            className="flex-2 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium cursor-pointer transition-colors"
          >
            {mode === "edit" ? "Update Lesson Plan" : "Save Lesson Plan"}
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
        >
          {isReadOnly ? "Close" : "Cancel"}
        </button>
      </div>
    </form>
  );
}
