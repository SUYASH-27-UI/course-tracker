import { useEffect, useState } from "react";

const API = "http://localhost:8080/api/courses";
const GOOGLE_LOGIN_URL = "http://localhost:8080/oauth2/authorization/google";

export default function App() {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState(() => localStorage.getItem("jwt_token") || "");

  const getHeaders = () => ({
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });

  const handleSaveToken = (newToken) => {
    const cleaned = newToken.trim();
    setToken(cleaned);
    if (cleaned) {
      localStorage.setItem("jwt_token", cleaned);
    } else {
      localStorage.removeItem("jwt_token");
    }
  };

  const loadCourses = async () => {
    try {
      setError("");
      const res = await fetch(API, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to load courses");
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [token]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim() || !teacher.trim()) return;

    try {
      setError("");
      const res = await fetch(API, {
        method: "POST",
        headers: getHeaders(),
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
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete course");
      await loadCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: "40px auto", padding: "0 16px", fontFamily: "sans-serif" }}>
      <h2>Course Tracker</h2>

      <div style={{ marginBottom: 20, padding: 12, border: "1px solid #ddd" }}>
        <div style={{ marginBottom: 8 }}>
          <a href={GOOGLE_LOGIN_URL}>Login with Google (OAuth 2.0)</a>
        </div>
        <input
          placeholder="Paste JWT token here (after login)"
          value={token}
          onChange={(e) => handleSaveToken(e.target.value)}
          style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
        />
      </div>

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