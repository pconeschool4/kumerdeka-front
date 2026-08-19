import Navbar from "../components/common/NavBar";
import { useAuth } from "../context/AuthContext";

export default function StudentLayout({ children, noPadding = false }) {
  const { user } = useAuth();
  
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Siswa";
  const avatar = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-white">
      <Navbar user={displayName} avatar={avatar} />

      <main className={`mx-auto w-full ${noPadding ? '' : 'px-5 py-6 sm:px-8 lg:px-12 xl:px-16 lg:py-8'}`}>
        {children}
      </main>
    </div>
  );
}