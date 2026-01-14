import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function LessonList({
  userId,
  isAdmin = false,
  onAction,
  refreshKey,
}) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLessons();
  }, [refreshKey, userId]);

async function fetchLessons() {
    setLoading(true);
    // First fetch lesson plans
    let query = supabase.from("lesson_plans").select("*");

    if (!isAdmin) query = query.eq("user_id", userId);

    const { data: lessonsData, error: lessonsError } = await query.order("created_at", {
      ascending: false,
    });

    if (lessonsError) {
      console.error("Error fetching lessons:", lessonsError);
      setLoading(false);
      return;
    }

    // If admin and we have lessons, fetch teacher names
    if (isAdmin && lessonsData && lessonsData.length > 0) {
      const userIds = [...new Set(lessonsData.map(lesson => lesson.user_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
      } else {
        // Create a map of user_id to full_name
        const profileMap = {};
        profilesData.forEach(profile => {
          profileMap[profile.id] = profile.full_name;
        });
        
        // Add teacher names to lessons
        const lessonsWithNames = lessonsData.map(lesson => ({
          ...lesson,
          profiles: { full_name: profileMap[lesson.user_id] || "Unknown Teacher" }
        }));
        
        setLessons(lessonsWithNames);
        setLoading(false);
        return;
      }
    }

    setLessons(lessonsData || []);
    setLoading(false);
  }

  if (loading) return <div style={{ padding: "20px" }}>Updating list...</div>;

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        border="1"
        width="100%"
        style={{
          borderCollapse: "collapse",
          marginTop: "20px",
          textAlign: "left",
        }}
      >
        <thead>
          <tr style={{ background: "#f4f4f4" }}>
            <th style={{ padding: "10px" }}>Week</th>
            <th style={{ padding: "10px" }}>Topic</th>
            <th style={{ padding: "10px" }}>Subject</th>
            {isAdmin && <th style={{ padding: "10px" }}>Teacher</th>}
            <th style={{ padding: "10px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lessons.length === 0 ? (
            <tr>
              <td
                colSpan={isAdmin ? 5 : 4}
                style={{ textAlign: "center", padding: "20px" }}
              >
                No lesson plans found.
              </td>
            </tr>
          ) : (
            lessons.map((lesson) => (
              <tr key={lesson.id}>
                <td style={{ padding: "10px" }}>
                  {lesson.content?.week || "N/A"}
                </td>
                <td style={{ padding: "10px" }}>
                  <strong>{lesson.title}</strong>
                </td>
                <td style={{ padding: "10px" }}>{lesson.subject}</td>
                {isAdmin && (
                  <td style={{ padding: "10px" }}>
                    {lesson.profiles?.full_name || "Unknown Teacher"}
                  </td>
                )}
                <td style={{ padding: "10px" }}>
                  <button onClick={() => onAction(lesson, "view")}>View</button>
                  {!isAdmin && (
                    <>
                      <button
                        onClick={() => onAction(lesson, "edit")}
                        style={{ marginLeft: "5px" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onAction(lesson, "duplicate")}
                        style={{ marginLeft: "5px" }}
                      >
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
