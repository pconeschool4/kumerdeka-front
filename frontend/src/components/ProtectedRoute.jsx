import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  // Jika user belum login, kembali ke halaman utama (login)
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Jika role user tidak sesuai dengan role yang diizinkan untuk rute ini
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect ke dashboard yang sesuai dengan rolenya
    if (user.role === 'Guru') {
      return <Navigate to="/teacher" replace />;
    } else {
      return <Navigate to="/student" replace />;
    }
  }

  // Jika lolos semua pengecekan, render komponen anak (Outlet)
  return <Outlet />;
}
