import { useState } from "react";
import { supabase } from "../supabaseClient";
import { TEMPLATES } from "../templates";

export default function LessonForm({ userId, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    grade: "",
    objectives: "",
    activities: "",
    assessment: "",
  });

  const applyTemplate = (key) => {
    const template = TEMPLATES[key];
    setFormData({ ...formData, ...template });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("lesson_plans").insert([
      {
        user_id: userId,
        title: formData.title,
        subject: formData.subject,
        grade_level: formData.grade,
        content: {
          objectives: formData.objectives,
          activities: formData.activities,
          assessment: formData.assessment,
        },
      },
    ]);

    if (error) alert(error.message);
    else onSave(); // Refresh the list
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <select onChange={(e) => applyTemplate(e.target.value)}>
        <option value="">-- Choose a Template --</option>
        {Object.entries(TEMPLATES).map(([key, t]) => (
          <option key={key} value={key}>
            {t.name}
          </option>
        ))}
      </select>

      <input
        placeholder="Lesson Title"
        required
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <input
        placeholder="Subject"
        value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
      />

      <textarea
        placeholder="Objectives"
        value={formData.objectives}
        onChange={(e) =>
          setFormData({ ...formData, objectives: e.target.value })
        }
      />
      <textarea
        placeholder="Activities"
        value={formData.activities}
        onChange={(e) =>
          setFormData({ ...formData, activities: e.target.value })
        }
      />

      <button type="submit">Save Lesson Plan</button>
    </form>
  );
}
