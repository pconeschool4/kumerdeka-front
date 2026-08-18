import Navbar from "../components/common/NavBar";

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
  return (
    <div className="min-h-screen bg-[#F7FAFF] text-[#172B4D]">
      <Navbar menus={teacherMenus} user="Budi Santoso" avatar="B" />

      <main className="mx-auto w-full px-5 py-6 sm:px-8 lg:px-12 xl:px-16 lg:py-8">
        {children}
      </main>
    </div>
  );
}
