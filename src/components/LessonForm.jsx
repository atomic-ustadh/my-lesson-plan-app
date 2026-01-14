import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { TEMPLATES } from "../templates";

export default function LessonForm({
  userId,
  onSave,
  initialData = null,
  mode = "create",
  onClose,
}) {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    grade: "",
    objectives: "",
    activities: "",
    assessment: "",
  });

  // Sync form with initialData if editing/viewing/duplicating
  useEffect(() => {
    if (initialData) {
      setFormData({
        title:
          mode === "duplicate"
            ? `${initialData.title} (Copy)`
            : initialData.title,
        subject: initialData.subject || "",
        grade: initialData.grade_level || "",
        objectives: initialData.content?.objectives || "",
        activities: initialData.content?.activities || "",
        assessment: initialData.content?.assessment || "",
      });
    } else {
      // RESET: Ensures the form is empty when clicking "+ Create New Plan"
      setFormData({
        title: "",
        subject: "",
        grade: "",
        objectives: "",
        activities: "",
        assessment: "",
      });
    }
  }, [initialData, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "view") return;

    const payload = {
      user_id: userId,
      title: formData.title,
      subject: formData.subject,
      grade_level: formData.grade,
      content: {
        objectives: formData.objectives,
        activities: formData.activities,
        assessment: formData.assessment,
      },
    };

    let result;
    if (mode === "edit") {
      result = await supabase
        .from("lesson_plans")
        .update(payload)
        .eq("id", initialData.id);
    } else {
      result = await supabase.from("lesson_plans").insert([payload]);
    }

    if (result.error) alert(result.error.message);
    else onSave();
  };

  const isReadOnly = mode === "view";

  // Shared style for inputs to keep code clean
  const inputStyle = {
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "5px" }}
    >
      {/* 1. Template Selector (Only for new plans) */}
      {!isReadOnly && mode !== "edit" && (
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontWeight: "bold" }}>
            Start with a Template:
          </label>
          <select
            style={{ ...inputStyle, width: "100%" }}
            onChange={(e) => {
              const t = TEMPLATES[e.target.value];
              if (t)
                setFormData({
                  ...formData,
                  objectives: t.objectives,
                  activities: t.activities,
                  assessment: t.assessment,
                });
            }}
          >
            <option value="">-- Blank Slate --</option>
            {Object.entries(TEMPLATES).map(([key, t]) => (
              <option key={key} value={key}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 2. Basic Info Row */}
      <label>Lesson Title *</label>
      <input
        disabled={isReadOnly}
        style={inputStyle}
        placeholder="e.g. Intro to Photosynthesis"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ flex: 1 }}>
          <label>Subject</label>
          <input
            disabled={isReadOnly}
            style={{ ...inputStyle, width: "100%" }}
            placeholder="e.g. Science"
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
          />
        </div>
        <div style={{ flex: 1 }}>
          <label>Grade Level</label>
          <input
            disabled={isReadOnly}
            style={{ ...inputStyle, width: "100%" }}
            placeholder="e.g. 5th Grade"
            value={formData.grade}
            onChange={(e) =>
              setFormData({ ...formData, grade: e.target.value })
            }
          />
        </div>
      </div>

      {/* 3. Detailed Content */}
      <label>Learning Objectives</label>
      <textarea
        disabled={isReadOnly}
        style={{ ...inputStyle, minHeight: "60px" }}
        placeholder="What will students learn?"
        value={formData.objectives}
        onChange={(e) =>
          setFormData({ ...formData, objectives: e.target.value })
        }
      />

      <label>Lesson Activities</label>
      <textarea
        disabled={isReadOnly}
        style={{ ...inputStyle, minHeight: "120px" }}
        placeholder="Step-by-step procedure..."
        value={formData.activities}
        onChange={(e) =>
          setFormData({ ...formData, activities: e.target.value })
        }
      />

      <label>Assessment / Exit Ticket</label>
      <textarea
        disabled={isReadOnly}
        style={{ ...inputStyle, minHeight: "60px" }}
        placeholder="How will you check for understanding?"
        value={formData.assessment}
        onChange={(e) =>
          setFormData({ ...formData, assessment: e.target.value })
        }
      />

      {/* 4. Action Buttons */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        {!isReadOnly && (
          <button
            type="submit"
            style={{
              backgroundColor: "green",
              color: "white",
              padding: "10px 20px",
              cursor: "pointer",
              border: "none",
              borderRadius: "4px",
            }}
          >
            {mode === "edit" ? "Update Lesson" : "Save Lesson"}
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          {isReadOnly ? "Close" : "Cancel"}
        </button>
      </div>
    </form>
  );
}
