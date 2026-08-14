import TeacherLayout from "../Layouts/TeacherLayout";
import StatCard from "../components/dashboard/StateCard";
import StudentList from "../components/dashboard/teacher/StudentList";
import InterventionCard from "../components/dashboard/teacher/InterventionCard";
import { Users, TrendingUp } from "lucide-react";

export default function TeacherDashboard() {
  return (
    <TeacherLayout>

      {/* Welcome */}
      <section className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-[#7B8CA3]">
            Dashboard Guru
          </p>

          <h1 className="text-[28px] font-bold leading-tight tracking-tight text-[#172B4D]">
            Selamat Pagi, Budi Santoso! 👋
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#718096]">
            Berikut adalah ringkasan performa Kelas 10A hari ini.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-xl border border-[#DDEEFF] bg-[#F5F8FC] px-4 py-2.5">
          <Users size={18} className="text-[#4285D4]" />
          <span className="text-sm font-semibold text-[#4285D4]">
            40 Siswa Aktif
          </span>
        </div>
      </section>

      {/* Main Stats */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

        <StatCard
          title="Rata-rata Mastery Kelas"
          value="72%"
          description="+4% dari minggu lalu"
          type="mastery"
        />

        <StatCard
          title="Siswa Perlu Perhatian"
          value="5"
          description="Siswa berada di bawah 60%"
          extra="Lihat detail intervensi"
          type="alert"
        />
        
        {/* Placeholder for a custom stats card if needed, currently using StatCard but customizing style maybe later. We can just use the default type for now */}
        <div className="rounded-2xl border border-[#E8EEF7] bg-white p-5 shadow-[0_4px_18px_rgba(36,74,120,0.04)] flex flex-col justify-between">
           <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#8291A5]">Total Kuis Diselesaikan</p>
                <p className="mt-3 text-[28px] font-bold leading-none text-[#5D7FB0]">128</p>
                <p className="mt-3 text-xs text-[#91A0B2]">Dalam 7 hari terakhir</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF8F1]">
                 <TrendingUp size={18} className="text-[#63A979]" />
              </div>
           </div>
        </div>

      </section>

      {/* Bottom Section */}
      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_350px]">
        <StudentList />
        <InterventionCard />
      </section>

    </TeacherLayout>
  );
}
