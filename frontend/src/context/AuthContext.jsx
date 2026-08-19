import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check active sessions and sets the user
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await syncProfile(session);
      } else {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        await syncProfile(session);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const syncProfile = async (session) => {
    try {
      setLoading(true);
      // Panggil backend Node.js untuk mengecek dan sinkronisasi role dari DB
      const res = await fetch('http://localhost:5000/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sync profile');
      }

      setUser({
        ...session.user,
        role: data.profile.role,
        profile: data.profile
      });

      // Redirect ke dashboard yang sesuai (hanya jika pengguna sedang berada di rute autentikasi)
      const publicRoutes = ['/login', '/register', '/verify-email', '/', '/admin/guru'];
      if (publicRoutes.includes(location.pathname)) {
        if (data.profile.role === 'teacher') {
          navigate('/teacher');
        } else {
          navigate('/student');
        }
      }
    } catch (err) {
      console.error('Error syncing profile:', err);
      // Jika sinkronisasi gagal (misal server down), kita bisa tetap menyimpan session tanpa role
      // namun akan diblokir oleh ProtectedRoutes
      setUser(session.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
  };

  // Kompatibilitas fungsi manual (Login/Register sementara jika belum connect database, sekarang tidak digunakan secara langsung)
  const login = () => {
    console.warn("Manual login is disabled. Use Supabase auth.");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
