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
  const inputStyle = {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
  };
  const labelStyle = {
    fontWeight: "bold",
    display: "block",
    marginBottom: "5px",
    marginTop: "15px",
  };
  const reqStyle = { color: "red", marginLeft: "4px" };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: "900px", margin: "0 auto", paddingBottom: "50px" }}
    >
      {/* SECTION 1: Logistics */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        <div>
          <label style={labelStyle}>
            1. Subject <span style={reqStyle}>*</span>
          </label>
          <select
            disabled={isReadOnly}
            style={inputStyle}
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

          <label style={labelStyle}>
            2. Topic <span style={reqStyle}>*</span>
          </label>
          <input
            disabled={isReadOnly}
            style={inputStyle}
            value={formData.topic}
            onChange={(e) =>
              setFormData({ ...formData, topic: e.target.value })
            }
            required
          />

          <label style={labelStyle}>
            3. Duration <span style={reqStyle}>*</span>
          </label>
          <input
            disabled={isReadOnly}
            style={inputStyle}
            placeholder="e.g. 40 mins"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            required
          />

          <label style={labelStyle}>
            4. Grade / Class <span style={reqStyle}>*</span>
          </label>
          <select
            disabled={isReadOnly}
            style={inputStyle}
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

        <div>
          <label style={labelStyle}>
            5. Period <span style={reqStyle}>*</span>
          </label>
          <input
            disabled={isReadOnly}
            style={inputStyle}
            value={formData.period}
            onChange={(e) =>
              setFormData({ ...formData, period: e.target.value })
            }
            required
          />

          <label style={labelStyle}>
            6. Date <span style={reqStyle}>*</span>
          </label>
          <input
            type="date"
            disabled={isReadOnly}
            style={inputStyle}
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          <label style={labelStyle}>
            7. Average Age <span style={reqStyle}>*</span>
          </label>
          <input
            type="number"
            disabled={isReadOnly}
            style={inputStyle}
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            required
          />

          <label style={labelStyle}>
            8. Week <span style={reqStyle}>*</span>
          </label>
          <input
            disabled={isReadOnly}
            style={inputStyle}
            value={formData.week}
            onChange={(e) => setFormData({ ...formData, week: e.target.value })}
            required
          />
        </div>
      </div>

      <hr style={{ margin: "30px 0" }} />

      {/* SECTION 2: Instructional Content */}
      <label style={labelStyle}>
        9. Introduction <span style={reqStyle}>*</span>
      </label>
      <input
        disabled={isReadOnly}
        style={inputStyle}
        value={formData.introduction}
        onChange={(e) =>
          setFormData({ ...formData, introduction: e.target.value })
        }
        required
      />

      <label style={labelStyle}>
        10. Objectives <span style={reqStyle}>*</span>
      </label>
      <textarea
        disabled={isReadOnly}
        style={{ ...inputStyle, minHeight: "80px" }}
        value={formData.objectives}
        onChange={(e) =>
          setFormData({ ...formData, objectives: e.target.value })
        }
        required
      />

      <label style={labelStyle}>
        11. Summary / Content <span style={reqStyle}>*</span>
      </label>
      <textarea
        disabled={isReadOnly}
        style={{ ...inputStyle, minHeight: "150px" }}
        value={formData.summary}
        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
        required
      />

      <label style={labelStyle}>
        12. Methodology <span style={reqStyle}>*</span>
      </label>
      <textarea
        disabled={isReadOnly}
        style={{ ...inputStyle, minHeight: "80px" }}
        value={formData.methodology}
        onChange={(e) =>
          setFormData({ ...formData, methodology: e.target.value })
        }
        required
      />

      <label style={labelStyle}>
        13. Instructional Resources <span style={reqStyle}>*</span>
      </label>
      <textarea
        disabled={isReadOnly}
        style={{ ...inputStyle, minHeight: "80px" }}
        value={formData.resources}
        onChange={(e) =>
          setFormData({ ...formData, resources: e.target.value })
        }
        required
      />

      <label style={labelStyle}>
        14. Evaluation <span style={reqStyle}>*</span>
      </label>
      <textarea
        disabled={isReadOnly}
        style={{ ...inputStyle, minHeight: "80px" }}
        value={formData.evaluation}
        onChange={(e) =>
          setFormData({ ...formData, evaluation: e.target.value })
        }
        required
      />

      <label style={labelStyle}>15. Assignment (Optional)</label>
      <textarea
        disabled={isReadOnly}
        style={{ ...inputStyle, minHeight: "80px" }}
        value={formData.assignment}
        onChange={(e) =>
          setFormData({ ...formData, assignment: e.target.value })
        }
      />

      <hr style={{ margin: "30px 0" }} />

      {/* SECTION 3: Feedback */}
      <label style={labelStyle}>16. Teacher's Comment</label>
      <input
        disabled={isReadOnly}
        style={inputStyle}
        value={formData.teacherComment}
        onChange={(e) =>
          setFormData({ ...formData, teacherComment: e.target.value })
        }
      />

      <label style={labelStyle}>17. Supervisor's Comment</label>
      <input
        disabled={isReadOnly}
        style={inputStyle}
        value={formData.supervisorComment}
        onChange={(e) =>
          setFormData({ ...formData, supervisorComment: e.target.value })
        }
      />

      {/* FOOTER BUTTONS */}
      <div style={{ marginTop: "30px", display: "flex", gap: "15px" }}>
        {!isReadOnly && (
          <button
            type="submit"
            style={{
              flex: 2,
              padding: "15px",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {mode === "edit" ? "Update Lesson Plan" : "Save Lesson Plan"}
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          style={{
            flex: 1,
            padding: "15px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          {isReadOnly ? "Close" : "Cancel"}
        </button>
      </div>
    </form>
  );
}
