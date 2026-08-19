import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const VerifyEmail = lazy(() => import('../pages/VerifyEmail'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const TeacherDashboard = lazy(() => import('../pages/TeacherDashboard'));
const TeacherLogin = lazy(() => import('../pages/TeacherLogin'));
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

// Student Pages
const StudentMaterials = lazy(() => import('../pages/student/Materials'));
const StudentQuiz = lazy(() => import('../pages/student/Quiz'));
const StudentProgress = lazy(() => import('../pages/student/Progress'));
const StudentRecommendations = lazy(() => import('../pages/student/Recommendations'));

// Teacher Pages
const TeacherStudents = lazy(() => import('../pages/teacher/Students'));
const TeacherSubjects = lazy(() => import('../pages/teacher/Subjects'));
const TeacherMaterials = lazy(() => import('../pages/teacher/Materials'));
const TeacherQuestions = lazy(() => import('../pages/teacher/Questions'));
const TeacherQuiz = lazy(() => import('../pages/teacher/Quiz'));
const TeacherAnalytics = lazy(() => import('../pages/teacher/Analytics'));

// Settings Pages
const SettingsProfile = lazy(() => import('../pages/settings/Profile'));
const SettingsAppearance = lazy(() => import('../pages/settings/Appearance'));
const SettingsContact = lazy(() => import('../pages/settings/Contact'));


const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#0A1128]">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#4285D4] border-t-transparent" />
      <p className="text-sm font-medium text-slate-500 dark:text-[#94A3B8]">Memuat halaman...</p>
    </div>
  </div>
);

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route 
        path="/login" 
        element={
          user ? (
            <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} replace />
          ) : (
            <Login />
          )
        } 
      />
      <Route 
        path="/register" 
        element={
          user ? (
            <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} replace />
          ) : (
            <Register />
          )
        } 
      />
      <Route 
        path="/admin/guru" 
        element={
          user ? (
            <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} replace />
          ) : (
            <TeacherLogin />
          )
        } 
      />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Protected Routes for Siswa */}
      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route path="/student" element={<Dashboard />} />
        <Route path="/student/materials" element={<StudentMaterials />} />
        <Route path="/student/quiz" element={<StudentQuiz />} />
        <Route path="/student/progress" element={<StudentProgress />} />
        <Route path="/student/recommendations" element={<StudentRecommendations />} />
      </Route>

      {/* Protected Routes for Guru */}
      <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
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
    </Suspense>
  );
}
