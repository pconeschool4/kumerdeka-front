import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import TeacherDashboard from '../pages/TeacherDashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

// Student Pages
import StudentMaterials from '../pages/student/Materials';
import StudentQuiz from '../pages/student/Quiz';
import StudentProgress from '../pages/student/Progress';
import StudentRecommendations from '../pages/student/Recommendations';

// Teacher Pages
import TeacherStudents from '../pages/teacher/Students';
import TeacherSubjects from '../pages/teacher/Subjects';
import TeacherMaterials from '../pages/teacher/Materials';
import TeacherQuestions from '../pages/teacher/Questions';
import TeacherQuiz from '../pages/teacher/Quiz';
import TeacherAnalytics from '../pages/teacher/Analytics';

// Settings Pages
import SettingsProfile from '../pages/settings/Profile';
import SettingsAppearance from '../pages/settings/Appearance';
import SettingsContact from '../pages/settings/Contact';

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
        <Route path="/student/materials" element={<StudentMaterials />} />
        <Route path="/student/quiz" element={<StudentQuiz />} />
        <Route path="/student/progress" element={<StudentProgress />} />
        <Route path="/student/recommendations" element={<StudentRecommendations />} />
      </Route>

      {/* Protected Routes for Guru */}
      <Route element={<ProtectedRoute allowedRoles={['Guru']} />}>
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/students" element={<TeacherStudents />} />
        <Route path="/teacher/subjects" element={<TeacherSubjects />} />
        <Route path="/teacher/materials" element={<TeacherMaterials />} />
        <Route path="/teacher/questions" element={<TeacherQuestions />} />
        <Route path="/teacher/quiz" element={<TeacherQuiz />} />
        <Route path="/teacher/analytics" element={<TeacherAnalytics />} />
      </Route>

      {/* Global Protected Routes (Settings) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/settings/profile" element={<SettingsProfile />} />
        <Route path="/settings/appearance" element={<SettingsAppearance />} />
        <Route path="/settings/contact" element={<SettingsContact />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
