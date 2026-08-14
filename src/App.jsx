import { Routes, Route, Navigate } from "react-router-dom";
import TeacherDashboard from "./pages/TeacherDashboard";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/student" element={<Dashboard />} />
      <Route path="/teacher" element={<TeacherDashboard />} />
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;