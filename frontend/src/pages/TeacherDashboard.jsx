import TeacherLayout from "../Layouts/TeacherLayout";
import StudentList from "../components/dashboard/teacher/StudentList";
import InterventionCard from "../components/dashboard/teacher/InterventionCard";
import { Users, TrendingUp, BookOpen, Target } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useTeacherStats } from "../hooks/useTeacherStats";

export default function TeacherDashboard() {
  const { user } = useAuth();
  
  

  

  const fetchDashboardStats = async () => {
    try {
      // Fetch all students
      const { data: students, error: studentError } = await supabase
        .from('data_siswa')
        .select('id');
        
      if (studentError) throw studentError;
      
      const totalStudents = students ? students.length : 0;

      // Fetch all quiz results
      const { data: results, error: resultError } = await supabase
        .from('hasil_kuis')
        .select('siswa_id, nilai');
        
      if (resultError) throw resultError;

      let classAverage = 0;
      let studentsNeedingHelp = 0;
      let totalQuizzes = results ? results.length : 0;

      if (results && results.length > 0) {
        // Calculate average
        const totalScore = results.reduce((sum, curr) => sum + (curr.nilai || 0), 0);
        classAverage = Math.round(totalScore / results.length);

        // Group by student to find struggling students
        const studentAverages = {};
        results.forEach(res => {
          if (!studentAverages[res.siswa_id]) studentAverages[res.siswa_id] = { total: 0, count: 0 };
          studentAverages[res.siswa_id].total += (res.nilai || 0);
          studentAverages[res.siswa_id].count += 1;
        });

        Object.values(studentAverages).forEach(stud => {
          const avg = stud.total / stud.count;
          if (avg < 60) {
            studentsNeedingHelp++;
          }
        });
      }

      setStats({
        totalStudents,
        classAverage,
        studentsNeedingHelp,
        totalQuizzes
      });

    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <TeacherLayout>

      {/* Welcome */}
      <section className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-slate-500 dark:text-[#7B8CA3]">
            Dashboard Guru
          </p>

          <h1 className="text-[28px] font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
            Selamat Pagi, {user?.user_metadata?.full_name || 'Guru'}! 👋
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-[#94A3B8]">
            Berikut adalah ringkasan performa Kelas 10A hari ini.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 dark:border-[#DDEEFF]/10 dark:bg-white/5 px-4 py-2.5">
          <Users size={18} className="text-blue-600 dark:text-[#4285D4]" />
          <span className="text-sm font-semibold text-blue-600 dark:text-[#4285D4]">
            {stats.totalStudents} Siswa Aktif
          </span>
        </div>
      </section>

      {/* Main Stats */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

        {/* CARD 1: Rata-rata Mastery Kelas */}
        <div className="group relative overflow-hidden rounded-[26px] border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0F172A]/60 p-6 shadow-xl dark:shadow-[0_12px_35px_rgba(63,130,155,0.08)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-slate-50 dark:hover:bg-white/5 hover:shadow-2xl dark:hover:shadow-[0_18px_45px_rgba(63,130,155,0.13)]">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#38BDF8]/10 dark:bg-[#38BDF8]/20 blur-3xl transition-transform duration-500 group-hover:scale-125" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-slate-100 bg-slate-50 dark:border-white/10 dark:bg-white/5 text-[#45A9C1]">
                <TrendingUp size={20} />
              </div>
            </div>
            <p className="mt-6 text-xs font-semibold text-slate-500 dark:text-[#94A3B8]">Rata-rata Mastery Kelas</p>
            <div className="mt-1 flex items-end gap-2">
              <h2 className="text-[38px] font-extrabold tracking-[-1px] text-slate-900 dark:text-white">{stats.classAverage}%</h2>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-[#78D5E8] to-[#52B8D2] transition-all duration-700" style={{ width: `${stats.classAverage}%` }} />
            </div>
          </div>
        </div>

        {/* CARD 2: Total Kuis Diselesaikan */}
        <div className="group relative overflow-hidden rounded-[26px] border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0F172A]/60 p-6 shadow-xl dark:shadow-[0_12px_35px_rgba(63,130,155,0.08)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-slate-50 dark:hover:bg-white/5 hover:shadow-2xl dark:hover:shadow-[0_18px_45px_rgba(63,130,155,0.13)]">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#818CF8]/10 dark:bg-[#818CF8]/20 blur-3xl transition-transform duration-500 group-hover:scale-125" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-slate-100 bg-slate-50 dark:border-[#DDD5F6]/10 dark:bg-[#F1EDFF]/10 text-[#7E68C6]">
                <BookOpen size={20} />
              </div>
            </div>
            <p className="mt-6 text-xs font-semibold text-slate-500 dark:text-[#94A3B8]">Total Kuis Diselesaikan</p>
            <div className="mt-1 flex items-end gap-2">
              <h2 className="text-[38px] font-extrabold tracking-[-1px] text-slate-900 dark:text-white">{stats.totalQuizzes}</h2>
              <span className="mb-1 text-xs text-slate-500 dark:text-[#64748B]">kuis</span>
            </div>
          </div>
        </div>

        {/* CARD 3: Siswa Perlu Perhatian */}
        <div className="group relative overflow-hidden rounded-[26px] border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0F172A]/60 p-6 shadow-xl dark:shadow-[0_12px_35px_rgba(63,130,155,0.08)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-slate-50 dark:hover:bg-white/5 hover:shadow-2xl dark:hover:shadow-[0_18px_45px_rgba(63,130,155,0.13)]">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#10B981]/10 dark:bg-[#10B981]/20 blur-3xl transition-transform duration-500 group-hover:scale-125" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-slate-100 bg-slate-50 dark:border-white/10 dark:bg-white/5 text-[#43AFC8]">
                <Target size={20} />
              </div>
            </div>
            <p className="mt-6 text-xs font-semibold text-slate-500 dark:text-[#94A3B8]">Siswa Perlu Perhatian</p>
            <div className="mt-1 flex items-end gap-2">
              <h2 className="text-[38px] font-extrabold tracking-[-1px] text-slate-900 dark:text-white">{stats.studentsNeedingHelp}</h2>
              <span className="mb-1 text-xs text-slate-500 dark:text-[#64748B]">siswa</span>
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-[#64748B]">Rata-rata di bawah 60</p>
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
