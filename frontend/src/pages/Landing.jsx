import { GraduationCap, ArrowRight, BookOpen, Presentation } from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#d9ecff] flex items-center justify-center p-4">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#aee8ff] via-[#cbdcff] to-[#ebc9f5]" />
      <div className="pointer-events-none absolute -left-32 top-20 h-[500px] w-[500px] rounded-full bg-[#24a8ed]/25 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-[550px] w-[550px] rounded-full bg-[#8d4cff]/25 blur-[120px]" />
      
      <div className="relative z-10 w-full max-w-4xl rounded-[30px] border border-white/10 bg-[#0F172A]/60 p-8 shadow-[0_35px_100px_rgba(30,65,110,0.25)] backdrop-blur-xl sm:p-12">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#0F172A]/60 text-[#1765a8] shadow-lg backdrop-blur-md">
            <GraduationCap size={48} />
          </div>
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-[#124b78] md:text-5xl">
            KURMERDEKA TRACE
          </h1>
          <p className="mb-10 text-lg font-medium text-[#3d6580]">
            Platform Pembelajaran Adaptif Kurikulum Merdeka
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Student Portal Card */}
            <Link 
              to="/student/login"
              className="group relative flex flex-col items-center overflow-hidden rounded-3xl border border-white/10 bg-[#0F172A]/60 p-8 text-center shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:bg-white/5 hover:shadow-xl"
            >
              <div className="mb-4 rounded-full bg-white/10 p-4 text-[#4285D4] transition-transform duration-300 group-hover:scale-110">
                <BookOpen size={40} />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-[#124b78]">Portal Siswa</h2>
              <p className="mb-6 text-sm text-[#3d6580]">Masuk untuk mengerjakan kuis, melihat materi, dan melacak perkembangan belajarmu.</p>
              <span className="mt-auto inline-flex items-center gap-2 font-bold text-[#4285D4]">
                Masuk <ArrowRight size={18} />
              </span>
            </Link>

            {/* Teacher Portal Card */}
            <Link 
              to="/teacher/login"
              className="group relative flex flex-col items-center overflow-hidden rounded-3xl border border-white/10 bg-[#0F172A]/60 p-8 text-center shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:bg-white/5 hover:shadow-xl"
            >
              <div className="mb-4 rounded-full bg-[#F3E8FF] p-4 text-[#8B5CF6] transition-transform duration-300 group-hover:scale-110">
                <Presentation size={40} />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-[#124b78]">Portal Guru</h2>
              <p className="mb-6 text-sm text-[#3d6580]">Masuk untuk mengelola bank soal, memantau analitik kelas, dan mengunggah materi.</p>
              <span className="mt-auto inline-flex items-center gap-2 font-bold text-[#8B5CF6]">
                Masuk <ArrowRight size={18} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
