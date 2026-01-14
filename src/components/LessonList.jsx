import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function LessonList({
  userId,
  isAdmin = false,
  onAction,
  refreshKey,
}) {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetchLessons();
  }, [refreshKey, userId]);

  async function fetchLessons() {
    let query = supabase.from("lesson_plans").select("*");
    if (!isAdmin) query = query.eq("user_id", userId);
    const { data } = await query.order("created_at", { ascending: false });
    setLessons(data || []);
  }

  return (
    <table
      border="1"
      width="100%"
      style={{ borderCollapse: "collapse", marginTop: "20px" }}
    >
      <thead>
        <tr style={{ background: "#f4f4f4" }}>
          <th>Title</th>
          <th>Subject</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {lessons.map((lesson) => (
          <tr key={lesson.id}>
            <td>{lesson.title}</td>
            <td>{lesson.subject}</td>
            <td>
              <button onClick={() => onAction(lesson, "view")}>View</button>
              {!isAdmin && (
                <>
                  <button onClick={() => onAction(lesson, "edit")}>Edit</button>
                  <button onClick={() => onAction(lesson, "duplicate")}>
                    Duplicate
                  </button>
                  <button
                    onClick={() => onAction(lesson, "delete")}
                    style={{ color: "red", marginLeft: "10px" }}
                  >
                    Delete
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
