import { useEffect, useState } from "react";

const API = "http://localhost:8080/api/courses";

export default function App() {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [error, setError] = useState("");

  const loadCourses = async () => {
    try {
      setError("");
      const res = await fetch(API);
      if (!res.ok) throw new Error("Failed to load courses");
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim() || !teacher.trim()) return;

    try {
      setError("");
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), teacher: teacher.trim() }),
      });
      if (!res.ok) throw new Error("Failed to add course");

      setName("");
      setTeacher("");
      await loadCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete course");
      await loadCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: "40px auto", padding: "0 16px", fontFamily: "sans-serif" }}>
      <h2>Course Tracker</h2>

      <form onSubmit={handleAdd} style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input
          placeholder="Course name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ flex: 1, padding: 8 }}
          required
        />
        <input
          placeholder="Teacher name"
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
          style={{ flex: 1, padding: 8 }}
          required
        />
        <button type="submit" style={{ padding: "8px 16px", cursor: "pointer" }}>
          Add
        </button>
      </form>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {courses.length === 0 ? (
        <p style={{ color: "#666" }}>No courses added yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {courses.map((c) => (
            <li
              key={c.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: "1px solid #ddd",
              }}
            >
              <span>
                <b>{c.name}</b> — {c.teacher}
              </span>
              <button onClick={() => handleDelete(c.id)} style={{ cursor: "pointer" }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}