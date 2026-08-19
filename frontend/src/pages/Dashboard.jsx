import {
  Sparkles,
  Flame,
  TrendingUp,
  Target,
  Brain,
  BookOpen,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  PlayCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useStudentData } from "../hooks/useStudentData";

import StudentLayout from "../Layouts/StudentLayout";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { loading: pageLoading, siswaId, stats, availableQuizzes, refetch } = useStudentData(user);
  // OLD STATES REMOVED BY REFACTOR
  
  
  
  const navigate = useNavigate();

  

  const fetchStudentData = async () => {
    try {
      const { data: siswaData } = await supabase
        .from('data_siswa')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      if (siswaData) {
        setSiswaId(siswaData.id);
        fetchStats(siswaData.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async (id) => {
    try {
      const { data, error } = await supabase
        .from('hasil_kuis')
        .select('id, nilai, finished_at, kuis(deskripsi, subjects(nama))')
        .eq('siswa_id', id)
        .order('finished_at', { ascending: false });

      if (!error && data) {
        const total = data.length;
        const avg = total > 0 ? Math.round(data.reduce((a, b) => a + (b.nilai || 0), 0) / total) : 0;
        
        // Hitung area yang perlu diperkuat
        const subjectScores = {};
        data.forEach(item => {
          const subject = item.kuis?.subjects?.nama;
          if (subject) {
            if (!subjectScores[subject]) subjectScores[subject] = { total: 0, count: 0 };
            subjectScores[subject].total += item.nilai || 0;
            subjectScores[subject].count += 1;
          }
        });
        
        let weakestSubject = null;
        let lowestScore = 101;
        Object.keys(subjectScores).forEach(sub => {
          const subAvg = subjectScores[sub].total / subjectScores[sub].count;
          if (subAvg < lowestScore) {
            lowestScore = subAvg;
            weakestSubject = sub;
          }
        });

        setStats({
          mastery: avg,
          totalQuizzes: total,
          recentHistory: data.slice(0, 5), // Ambil 5 kuis terakhir
          weakestSubject: weakestSubject
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchQuizzes = async () => {
    try {
      // Fetch available quizzes with subject name
      const { data, error } = await supabase
        .from('kuis')
        .select(`
          id, deskripsi, durasi, kesulitan,
          subjects (nama)
        `)
        .order('id', { ascending: false });
        
      if (!error && data) {
        setAvailableQuizzes(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getDisplayName = () => {
    if (!user) return 'Siswa';
    
    if (user.user_metadata?.username) return user.user_metadata.username;
    if (user.user_metadata?.full_name) return user.user_metadata.full_name;
    
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'Siswa';
  };

  if (authLoading || pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#0B1120]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#4285D4]" />
          <p className="text-sm font-semibold text-slate-500 dark:text-[#94A3B8]">Memuat Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <StudentLayout noPadding={true}>
      {/* =========================================================
          DASHBOARD BACKGROUND
      ========================================================== */}

      <div className="relative min-h-screen overflow-hidden bg-transparent">

        {/* Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute inset-0 bg-transparent" />

          {/* Blue glow */}
          <div
            className="
              absolute
              -left-40
              -top-40
              h-[520px]
              w-[520px]
              rounded-full
              bg-[#1E3A8A]/30
              blur-[130px]
            "
          />

          {/* Purple glow */}
          <div
            className="
              absolute
              -right-40
              -top-32
              h-[520px]
              w-[520px]
              rounded-full
              bg-[#F59E0B]/15
              blur-[130px]
            "
          />

          {/* Bottom glow */}
          <div
            className="
              absolute
              bottom-[-250px]
              left-[35%]
              h-[500px]
              w-[500px]
              rounded-full
              bg-slate-50 dark:bg-white/5
              blur-[130px]
            "
          />

        </div>

        {/* =========================================================
            MAIN CONTENT
        ========================================================== */}

        <main className="relative z-10 mx-auto w-full max-w-[1450px] px-5 py-6 sm:px-7 lg:px-10">

          {/* =====================================================
              HEADER
          ====================================================== */}

          <header className="mb-8">

            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

              {/* Greeting */}

              <div>

                <div
                  className="
                    mb-4
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-slate-200 dark:border-white/10
                    bg-white dark:bg-white dark:bg-[#0F172A]/60
                    px-3.5
                    py-2
                    shadow-[0_8px_25px_rgba(67,145,170,0.08)]
                    backdrop-blur-xl
                  "
                >
                  <Sparkles
                    size={14}
                    strokeWidth={2.5}
                    className="text-[#4AAFC8]"
                  />

                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-[#94A3B8]">
                    Dashboard Belajar
                  </span>
                </div>

                <h1
                  className="
                    text-[30px]
                    font-extrabold
                    leading-tight
                    tracking-[-1.2px]
                    text-slate-900 dark:text-white
                    sm:text-[36px]
                    capitalize
                  "
                >
                  Hai, {getDisplayName()}! 👋
                </h1>

                <p className="mt-2 text-sm text-slate-500 dark:text-[#94A3B8]">
                  Yuk lanjutkan progres belajarmu hari ini.
                </p>

              </div>

              {/* Streak */}

              <div
                className="
                  group
                  flex
                  w-fit
                  items-center
                  gap-3
                  rounded-[20px]
                  border
                  border-slate-200 dark:border-white/10
                  bg-white dark:bg-white dark:bg-[#0F172A]/60
                  px-4
                  py-3
                  shadow-[0_10px_30px_rgba(65,130,150,0.09)]
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-slate-50 dark:bg-white/5
                  hover:shadow-[0_15px_35px_rgba(65,130,150,0.13)]
                "
              >

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-[14px]
                    bg-[#F59E0B]/20
                    shadow-sm
                  "
                >
                  <Flame
                    size={19}
                    className="text-[#E2A51D]"
                    fill="currentColor"
                  />
                </div>

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#F59E0B]">
                    Learning Streak
                  </p>

                  <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">
                    0 hari berturut-turut
                  </p>

                </div>

              </div>

            </div>

          </header>

          {/* =====================================================
              STAT CARDS
          ====================================================== */}

          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {/* =================================================
                MASTERY CARD
            ================================================== */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[26px]
                border
                border-slate-200 dark:border-white/10
                bg-white dark:bg-white dark:bg-[#0F172A]/60
                p-6
                shadow-[0_12px_35px_rgba(63,130,155,0.08)]
                backdrop-blur-2xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-slate-50 dark:bg-white/5
                hover:shadow-[0_18px_45px_rgba(63,130,155,0.13)]
              "
            >

              {/* Glow */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-12
                  -top-12
                  h-36
                  w-36
                  rounded-full
                  bg-[#38BDF8]/20
                  blur-3xl
                  transition-transform
                  duration-500
                  group-hover:scale-125
                "
              />

              <div className="relative">

                <div className="flex items-center justify-between">

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-[14px]
                      border
                      border-slate-200 dark:border-white/10
                      bg-slate-50 dark:bg-white/5
                      text-[#45A9C1]
                    "
                  >
                    <TrendingUp size={20} />
                  </div>

                  <span
                    className="
                      rounded-full
                      border
                      border-[#C9ECD9]
                      bg-[#ECF9F1]
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      text-[#4C9769]
                    "
                  >
                    +5%
                  </span>

                </div>

                <p className="mt-6 text-xs font-semibold text-slate-500 dark:text-[#94A3B8]">
                  Mastery keseluruhan
                </p>

                <div className="mt-1 flex items-end gap-2">

                  <h2 className="text-[38px] font-extrabold tracking-[-1px] text-slate-900 dark:text-white">
                    {stats.mastery}%
                  </h2>

                  <span className="mb-1 text-xs text-slate-400 dark:text-[#64748B]">
                    minggu ini
                  </span>

                </div>

                {/* Progress */}

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">

                  <div
                    className="
                      h-full
                      rounded-full
                      bg-gradient-to-r
                      from-[#78D5E8]
                      to-[#52B8D2]
                      transition-all
                      duration-700
                    "
                    style={{ width: `${stats.mastery}%` }}
                  />

                </div>

                <p className="mt-3 text-xs text-slate-400 dark:text-[#64748B]">
                  Belum ada data minggu lalu
                </p>

              </div>

            </div>

            {/* =================================================
                QUIZ CARD
            ================================================== */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[26px]
                border
                border-slate-200 dark:border-white/10
                bg-white dark:bg-white dark:bg-[#0F172A]/60
                p-6
                shadow-[0_12px_35px_rgba(63,130,155,0.08)]
                backdrop-blur-2xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-slate-50 dark:bg-white/5
                hover:shadow-[0_18px_45px_rgba(63,130,155,0.13)]
              "
            >

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-12
                  -top-12
                  h-36
                  w-36
                  rounded-full
                  bg-[#818CF8]/20
                  blur-3xl
                  transition-transform
                  duration-500
                  group-hover:scale-125
                "
              />

              <div className="relative">

                <div className="flex items-center justify-between">

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-[14px]
                      border
                      border-[#DDD5F6]
                      bg-[#F1EDFF]
                      text-[#7E68C6]
                    "
                  >
                    <BookOpen size={20} />
                  </div>

                  <span className="text-[10px] font-semibold text-[#8599A5]">
                    Minggu ini
                  </span>

                </div>

                <p className="mt-6 text-xs font-semibold text-slate-500 dark:text-[#94A3B8]">
                  Aktivitas quiz
                </p>

                <div className="mt-1 flex items-end gap-2">

                  <h2 className="text-[38px] font-extrabold tracking-[-1px] text-slate-900 dark:text-white">
                    {stats.totalQuizzes}
                  </h2>

                  <span className="mb-1 text-xs text-slate-400 dark:text-[#64748B]">
                    quiz selesai
                  </span>

                </div>

                <div className="mt-5 flex items-center gap-2">

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">

                    <div
                      className="
                        h-full
                        rounded-full
                        bg-gradient-to-r
                        from-[#A596E4]
                        to-[#806ACD]
                        transition-all
                        duration-700
                      "
                      style={{ width: `${stats.mastery}%` }}
                    />

                  </div>

                  <span className="text-[11px] font-bold text-[#7660BC]">
                    {stats.mastery}%
                  </span>

                </div>

                <p className="mt-3 text-xs text-slate-400 dark:text-[#64748B]">
                  Rata-rata nilai quiz
                </p>

              </div>

            </div>

            {/* =================================================
                FOCUS CARD
            ================================================== */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[26px]
                border
                border-slate-200 dark:border-white/10
                bg-white dark:bg-white dark:bg-[#0F172A]/60
                p-6
                shadow-[0_12px_35px_rgba(63,130,155,0.08)]
                backdrop-blur-2xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-slate-50 dark:bg-white/5
                hover:shadow-[0_18px_45px_rgba(63,130,155,0.13)]
              "
            >

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-12
                  -top-12
                  h-36
                  w-36
                  rounded-full
                  bg-[#10B981]/20
                  blur-3xl
                  transition-transform
                  duration-500
                  group-hover:scale-125
                "
              />

              <div className="relative">

                <div className="flex items-center justify-between">

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-[14px]
                      border
                      border-slate-200 dark:border-white/10
                      bg-slate-50 dark:bg-white/5
                      text-[#43AFC8]
                    "
                  >
                    <Target size={20} />
                  </div>

                  <span
                    className="
                      rounded-full
                      border
                      border-slate-200 dark:border-white/10
                      bg-slate-50 dark:bg-white/5
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      text-[#478CA1]
                    "
                  >
                    Fokus
                  </span>

                </div>

                <p className="mt-6 text-xs font-semibold text-slate-500 dark:text-[#94A3B8]">
                  Area yang perlu diperkuat
                </p>

                <h2 className="mt-2 text-[19px] font-extrabold text-slate-900 dark:text-white">
                  {stats.weakestSubject ? stats.weakestSubject : 'Belum Ada Data'}
                </h2>

                <p className="mt-2 text-xs leading-5 text-slate-400 dark:text-[#64748B]">
                  {stats.weakestSubject 
                    ? `Perkuat pemahaman materi ${stats.weakestSubject} dengan mengulang bahan ajar.` 
                    : 'Kerjakan kuis terlebih dahulu agar sistem dapat mendeteksi.'}
                </p>

                <button
                  type="button"
                  className="
                    group/btn
                    mt-5
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-xl
                    border
                    border-slate-200 dark:border-white/10
                    bg-slate-50 dark:bg-white/5
                    px-3
                    py-2
                    text-[11px]
                    font-bold
                    text-[#38BDF8]
                    transition-all
                    duration-300
                    hover:border-[#8BD2E1]
                    hover:bg-[#DFF6FA]
                  "
                >
                  Mulai latihan

                  <ArrowUpRight
                    size={13}
                    className="transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                  />
                </button>

              </div>

            </div>

          </section>

          {/* =====================================================
              AVAILABLE QUIZZES
          ====================================================== */}
          <section className="mt-9">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-slate-200 dark:border-white/10 bg-white dark:bg-white dark:bg-[#0F172A]/60 text-[#43A9C3] shadow-sm backdrop-blur-xl">
                  <PlayCircle size={19} />
                </div>
                <div>
                  <h2 className="text-[19px] font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Kuis Tersedia
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-[#94A3B8]">
                    Kuis yang siap kamu kerjakan sekarang
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {availableQuizzes.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white dark:bg-[#0F172A]/60 p-6 text-center text-sm text-slate-500 dark:text-[#94A3B8] backdrop-blur-xl">
                  Tidak ada kuis yang tersedia saat ini.
                </div>
              ) : (
                availableQuizzes.map((quiz) => (
                  <div key={quiz.id} className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white dark:bg-[#0F172A]/60 p-5 shadow-lg backdrop-blur-xl transition hover:border-[#4285D4]/50">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-slate-50 dark:bg-white/5 px-2.5 py-1 text-[10px] font-bold text-[#4285D4]">
                        {quiz.subjects?.nama || 'Tanpa Mapel'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-[#94A3B8]">{quiz.durasi} Menit</span>
                    </div>
                    <h3 className="mb-1 text-base font-bold text-slate-900 dark:text-white">{quiz.deskripsi || 'Tanpa Judul'}</h3>
                    <p className="mb-4 text-xs font-medium text-slate-500 dark:text-[#94A3B8]">Level: {quiz.kesulitan}</p>
                    <button 
                      onClick={() => navigate('/student/quiz', { state: { quizId: quiz.id } })}
                      className="w-full rounded-xl bg-[#4285D4] py-2.5 text-[12px] font-bold text-slate-900 dark:text-white transition hover:bg-[#3171BC]"
                    >
                      Mulai Kuis
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* =====================================================
              MASTERY HEADER
          ====================================================== */}

          <section className="mt-9">

            <div className="mb-4 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-[14px]
                    border
                    border-slate-200 dark:border-white/10
                    bg-white dark:bg-white dark:bg-[#0F172A]/60
                    text-[#43A9C3]
                    shadow-sm
                    backdrop-blur-xl
                  "
                >
                  <Brain size={19} />
                </div>

                <div>

                  <h2 className="text-[19px] font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Peta mastery CP / TP
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-[#94A3B8]">
                    Pantau perkembangan kemampuanmu
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() => navigate('/student/materials')}
                className="
                  hidden
                  items-center
                  gap-1
                  rounded-xl
                  border
                  border-slate-200 dark:border-white/10
                  bg-white dark:bg-white dark:bg-[#0F172A]/60
                  px-3
                  py-2
                  text-[11px]
                  font-bold
                  text-[#518498]
                  shadow-sm
                  backdrop-blur-xl
                  transition-all
                  hover:bg-slate-50 dark:bg-white/5
                  sm:flex
                "
              >
                Lihat detail
                <ChevronRight size={13} />
              </button>

            </div>

            {/* =================================================
                MASTERY PANEL
            ================================================== */}

            <div
              className="
                relative
                overflow-hidden
                rounded-[28px]
                border
                border-slate-200 dark:border-white/10
                bg-white dark:bg-white dark:bg-[#0F172A]/60
                p-5
                shadow-[0_15px_40px_rgba(63,130,155,0.08)]
                backdrop-blur-2xl
                sm:p-6
              "
            >

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-16
                  -top-16
                  h-44
                  w-44
                  rounded-full
                  bg-[#80D8EA]/15
                  blur-3xl
                "
              />

              <div className="relative">

                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Perkembangan kompetensi
                    </h3>

                    <p className="mt-1 text-xs text-slate-400 dark:text-[#64748B]">
                      Area belajar berdasarkan tingkat penguasaan.
                    </p>

                  </div>

                  <div
                    className="
                      flex
                      w-fit
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-slate-200 dark:border-white/10
                      bg-slate-50 dark:bg-white/5
                      px-3
                      py-1.5
                      text-[10px]
                      font-bold
                      text-[#478DA2]
                    "
                  >
                    <Sparkles size={12} />
                    Adaptive Learning
                  </div>

                </div>

                <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 py-12 text-center">
                  <div className="mb-3 rounded-full bg-slate-50 dark:bg-white/5 p-3 text-slate-400 dark:text-[#64748B]">
                    <Sparkles size={24} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Belum Ada Pemetaan Kompetensi</h4>
                  <p className="mt-1 text-xs text-slate-500 dark:text-[#94A3B8]">Kerjakan kuis untuk melihat area mana yang sudah kamu kuasai.</p>
                </div>

              </div>

            </div>

          </section>

          {/* =====================================================
              BOTTOM CARDS
          ====================================================== */}

          <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">

            {/* MASTERY MAP */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[28px]
                border
                border-slate-200 dark:border-white/10
                bg-white dark:bg-white dark:bg-[#0F172A]/60
                p-5
                shadow-[0_15px_40px_rgba(63,130,155,0.08)]
                backdrop-blur-2xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-slate-50 dark:bg-white/5
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-[14px]
                    bg-slate-50 dark:bg-white/5
                    text-[#45A9C2]
                  "
                >
                  <TrendingUp size={18} />
                </div>

                <div>

                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Mastery Map
                  </h3>

                  <p className="text-[10px] text-slate-500 dark:text-[#94A3B8]">
                    Visualisasi perkembangan belajar
                  </p>

                </div>

              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">

                <div
                  className="
                    rounded-[17px]
                    border
                    border-[#22C55E]/20
                    bg-[#22C55E]/10
                    p-4
                    text-center
                    transition-all
                    hover:-translate-y-0.5
                  "
                >
                  <p className="text-2xl font-extrabold text-[#22C55E]">
                    0
                  </p>

                  <p className="mt-1 text-[10px] font-semibold text-[#4ADE80]">
                    Mastered
                  </p>
                </div>

                <div
                  className="
                    rounded-[17px]
                    border
                    border-[#F59E0B]/20
                    bg-[#F59E0B]/10
                    p-4
                    text-center
                    transition-all
                    hover:-translate-y-0.5
                  "
                >
                  <p className="text-2xl font-extrabold text-[#F59E0B]">
                    0
                  </p>

                  <p className="mt-1 text-[10px] font-semibold text-[#FBBF24]">
                    Progress
                  </p>
                </div>

                <div
                  className="
                    rounded-[17px]
                    border
                    border-[#EF4444]/20
                    bg-[#EF4444]/10
                    p-4
                    text-center
                    transition-all
                    hover:-translate-y-0.5
                  "
                >
                  <p className="text-2xl font-extrabold text-[#EF4444]">
                    0
                  </p>

                  <p className="mt-1 text-[10px] font-semibold text-[#F87171]">
                    Fokus
                  </p>
                </div>

              </div>

            </div>

            {/* RECOMMENDED QUIZ */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[28px]
                border
                border-slate-200 dark:border-white/10
                bg-white dark:bg-white dark:bg-[#0F172A]/60
                p-5
                shadow-[0_15px_40px_rgba(63,130,155,0.08)]
                backdrop-blur-2xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-slate-50 dark:bg-white/5
              "
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-[14px]
                      bg-slate-50 dark:bg-white/5
                      text-[#A78BFA]
                    "
                  >
                    <Sparkles size={18} />
                  </div>

                  <div>

                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      Rekomendasi Quiz
                    </h3>

                    <p className="text-[10px] text-slate-500 dark:text-[#94A3B8]">
                      Latihan yang sesuai denganmu
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  className="
                    rounded-xl
                    p-2
                    text-slate-500 dark:text-[#94A3B8]
                    transition
                    hover:bg-slate-50 dark:bg-white/5
                    hover:text-slate-900 dark:text-white
                  "
                >
                  <ArrowUpRight size={16} />
                </button>

              </div>

              <div
                className="
                  mt-5
                  rounded-[19px]
                  border
                  border-slate-200 dark:border-white/10
                  bg-slate-50 dark:bg-white/5
                  p-4
                  transition-all
                  duration-300
                  hover:bg-slate-50 dark:bg-white/5
                "
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-[#94A3B8]">
                      Prioritas
                    </p>

                    <h4 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                      Belum Ada Rekomendasi
                    </h4>

                  </div>

                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-[#94A3B8]">
                  Selesaikan kuis untuk mendapatkan rekomendasi AI.
                </p>

                <button
                  type="button"
                  className="
                    mt-4
                    w-full
                    rounded-xl
                    bg-slate-50 dark:bg-white/5
                    py-2.5
                    text-xs
                    font-bold
                    text-slate-900 dark:text-white
                  "
                >
                  Mulai Quiz
                  <ArrowUpRight size={14} />
                </button>

              </div>

            </div>

          </section>

          <div className="h-10" />

        </main>

      </div>
    </StudentLayout>
  );
}