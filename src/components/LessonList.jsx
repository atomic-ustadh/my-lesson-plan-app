import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function LessonList({ userId, isAdmin = false }) {
  const [lessons, setLessons] = useState([]);
  const [sortBy, setSortBy] = useState("created_at");

  useEffect(() => {
    fetchLessons();
  }, [sortBy]);

  async function fetchLessons() {
    let query = supabase.from("lesson_plans").select("*");

    // If NOT admin, RLS handles filtering, but we can be explicit:
    if (!isAdmin) query = query.eq("user_id", userId);

    const { data } = await query.order(sortBy, { ascending: false });
    setLessons(data || []);
  }

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        Sort by:
        <button onClick={() => setSortBy("created_at")}>Date</button>
        <button onClick={() => setSortBy("subject")}>Subject</button>
      </div>
      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>Title</th>
            <th>Subject</th>
            <th>Date</th>
            {isAdmin && <th>Teacher ID</th>}
          </tr>
        </thead>
        <tbody>
          {lessons.map((lesson) => (
            <tr key={lesson.id}>
              <td>{lesson.title}</td>
              <td>{lesson.subject}</td>
              <td>{new Date(lesson.created_at).toLocaleDateString()}</td>
              {isAdmin && <td>{lesson.user_id}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
