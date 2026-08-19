import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import StudentLayout from "../../Layouts/StudentLayout";
import TeacherLayout from "../../Layouts/TeacherLayout";
import { Moon, Sun } from "lucide-react";

export default function Appearance() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const Layout = user?.role === 'teacher' ? TeacherLayout : StudentLayout;

  return (
    <Layout>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">Pengaturan Tampilan</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-[#94A3B8]">Sesuaikan pengalaman visual Anda di Kurmerdeka TRACE.</p>

        <div className="mt-8 rounded-[24px] border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#0F172A]/60 p-6 dark:shadow-2xl backdrop-blur-xl sm:p-8">
          
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Tema Aplikasi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Dark Mode */}
            <div 
              onClick={() => setTheme('dark')}
              className={`cursor-pointer rounded-2xl border-2 p-4 text-center transition ${
                theme === 'dark' 
                  ? 'border-[#38BDF8] bg-[#1E293B]' 
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
              }`}
            >
              <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${
                theme === 'dark' ? 'bg-[#0F172A] text-[#38BDF8]' : 'bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-white'
              }`}>
                <Moon size={24} fill={theme === 'dark' ? "currentColor" : "none"} />
              </div>
              <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>Mode Gelap</h3>
              <p className={`mt-1 text-xs ${theme === 'dark' ? 'text-[#94A3B8]' : 'text-slate-500 dark:text-[#94A3B8]'}`}>Nyaman di mata untuk penggunaan lama.</p>
            </div>

            {/* Light Mode */}
            <div 
              onClick={() => setTheme('light')}
              className={`cursor-pointer rounded-2xl border-2 p-4 text-center transition ${
                theme === 'light' 
                  ? 'border-[#38BDF8] bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
              }`}
            >
              <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${
                theme === 'light' ? 'bg-blue-100 text-[#38BDF8] dark:bg-blue-900/40' : 'bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-white'
              }`}>
                <Sun size={24} fill={theme === 'light' ? "currentColor" : "none"} />
              </div>
              <h3 className={`font-bold ${theme === 'light' ? 'text-blue-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>Mode Terang</h3>
              <p className={`mt-1 text-xs ${theme === 'light' ? 'text-blue-600 dark:text-[#94A3B8]' : 'text-slate-500 dark:text-[#94A3B8]'}`}>Tampilan cerah dan segar.</p>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
            <p className="text-sm text-slate-500 dark:text-[#94A3B8]">
              * Saat ini Kurmerdeka TRACE sedang dalam tahap transisi penuh ke Mode Terang.
            </p>
          </div>

        </div>
      </div>
    </Layout>
  );
}
