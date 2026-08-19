import Navbar from "../components/common/NavBar";
import { useAuth } from "../context/AuthContext";

const teacherMenus = [
  { label: "Dashboard", path: "/teacher" },
  { label: "Siswa", path: "/teacher/students" },
  { label: "Pelajaran", path: "/teacher/subjects" },
  { label: "Materi", path: "/teacher/materials" },
  { label: "Soal", path: "/teacher/questions" },
  { label: "Quiz", path: "/teacher/quiz" },
  { label: "Analitik", path: "/teacher/analytics" },
];

export default function TeacherLayout({ children }) {
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || "Guru";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-white">
      <Navbar menus={teacherMenus} user={userName} avatar={userInitial} />

      <main className="mx-auto w-full px-5 py-6 sm:px-8 lg:px-12 xl:px-16 lg:py-8">
        {children}
      </main>
    </div>
  );
}
