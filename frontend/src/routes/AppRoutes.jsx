import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import TeacherDashboard from '../pages/TeacherDashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Route */}
      <Route 
        path="/" 
        element={
          user ? (
            <Navigate to={user.role === 'Guru' ? '/teacher' : '/student'} replace />
          ) : (
            <Login />
          )
        } 
      />

      {/* Protected Routes for Siswa */}
      <Route element={<ProtectedRoute allowedRoles={['Siswa']} />}>
        <Route path="/student" element={<Dashboard />} />
      </Route>

      {/* Protected Routes for Guru */}
      <Route element={<ProtectedRoute allowedRoles={['Guru']} />}>
        <Route path="/teacher" element={<TeacherDashboard />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
