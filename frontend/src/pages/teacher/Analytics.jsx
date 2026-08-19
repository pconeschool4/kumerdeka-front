import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertCircle, BookOpen, Sparkles } from 'lucide-react';
import TeacherLayout from '../../Layouts/TeacherLayout';
import { supabase } from '../../lib/supabaseClient';

// Dummy data for analytics
const DUMMY_MASTERY = [
  { id: 1, name: 'Andi Saputra', mastery: 85, weakTopic: 'Fungsi Kuadrat', status: 'Aman' },
  { id: 2, name: 'Budi Raharjo', mastery: 45, weakTopic: 'Persamaan Linear (TP 3.2.1)', status: 'Butuh Intervensi' },
  { id: 3, name: 'Citra Lestari', mastery: 92, weakTopic: '-', status: 'Sangat Baik' },
  { id: 4, name: 'Dewi Sartika', mastery: 60, weakTopic: 'Geometri Dasar', status: 'Perlu Perhatian' },
];

export default function TeacherAnalytics() {
  const [aiInsights, setAiInsights] = useState("");
  const [loadingAi, setLoadingAi] = useState(true);
  const [masteryData, setMasteryData] = useState([]);
  const [loadingMastery, setLoadingMastery] = useState(true);
  
  const [stats, setStats] = useState({
    classAverage: 0,
    studentsNeedingHelp: 0,
    hardestTopic: "-",
    totalQuizzes: 0
  });

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch('http://localhost:5000/api/ai/insights/teacher', {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        });
        const data = await res.json();
        setAiInsights(data.insights || "Tidak ada insight.");
      } catch (e) {
        console.error(e);
        setAiInsights("Gagal memuat AI Insights.");
      } finally {
        setLoadingAi(false);
      }
    };
    
    const fetchMastery = async () => {
      try {
        setLoadingMastery(true);
        // Fetch students
        const { data: siswa, error: siswaErr } = await supabase
          .from('data_siswa')
          .select('*');
        if (siswaErr) throw siswaErr;

        // Fetch results
        const { data: results, error: resultsErr } = await supabase
          .from('hasil_kuis')
          .select('siswa_id, nilai, kuis(subjects(nama))');
        if (resultsErr) throw resultsErr;

        let totalClassScore = 0;
        let studentsNeedingHelp = 0;
        let totalQuizzes = results ? results.length : 0;
        
        const subjectScores = {};

        const formattedData = (siswa || []).map(s => {
          const studentResults = (results || []).filter(r => r.siswa_id === s.id);
          let mastery = 0;
          let status = "Belum Ada Data";
          let weakTopic = "-";

          if (studentResults.length > 0) {
            const sum = studentResults.reduce((a, b) => a + (b.nilai || 0), 0);
            mastery = Math.round(sum / studentResults.length);
            totalClassScore += mastery;

            if (mastery >= 80) status = 'Sangat Baik';
            else if (mastery >= 60) status = 'Aman';
            else {
              status = 'Butuh Intervensi';
              studentsNeedingHelp++;
            }

            const studSubjectScores = {};
            studentResults.forEach(r => {
              const subj = r.kuis?.subjects?.nama || 'Umum';
              if (!studSubjectScores[subj]) studSubjectScores[subj] = { total: 0, count: 0 };
              studSubjectScores[subj].total += (r.nilai || 0);
              studSubjectScores[subj].count += 1;

              if (!subjectScores[subj]) subjectScores[subj] = { total: 0, count: 0 };
              subjectScores[subj].total += (r.nilai || 0);
              subjectScores[subj].count += 1;
            });

            let lowest = 101;
            Object.keys(studSubjectScores).forEach(subj => {
              const subAvg = studSubjectScores[subj].total / studSubjectScores[subj].count;
              if (subAvg < lowest) {
                lowest = subAvg;
                weakTopic = subj;
              }
            });
          }

          return {
            id: s.id,
            name: s.nama,
            mastery,
            weakTopic,
            status
          };
        });

        // Determine overall hardest topic
        let hardestTopic = "-";
        let lowestClassAvg = 101;
        Object.keys(subjectScores).forEach(subj => {
          const avg = subjectScores[subj].total / subjectScores[subj].count;
          if (avg < lowestClassAvg) {
            lowestClassAvg = avg;
            hardestTopic = subj;
          }
        });

        const classAverage = siswa && siswa.length > 0 
          ? Math.round(totalClassScore / siswa.length) 
          : 0;

        setStats({
          classAverage,
          studentsNeedingHelp,
          hardestTopic,
          totalQuizzes
        });

        // Sort by mastery ascending so those needing help are on top
        formattedData.sort((a, b) => a.mastery - b.mastery);
        
        setMasteryData(formattedData);
      } catch (e) {
        console.error('Error fetching mastery:', e.message);
      } finally {
        setLoadingMastery(false);
      }
    };

    fetchInsights();
    fetchMastery();
  }, []);

  return (
    <TeacherLayout>
      <div className="mx-auto w-full">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">
            Analitik Kelas
          </h1>
          <p className="mt-2 text-slate-500 dark:text-[#94A3B8]">
            Pantau ringkasan performa kelas, identifikasi topik yang sulit, dan lihat tingkat penguasaan setiap siswa.
          </p>
        </div>

        {/* AI Insight Card */}
        <div className="mb-10 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 dark:from-[#0F172A]/80 dark:to-[#1E293B]/80 dark:border-[#38BDF8]/20 p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
             <Sparkles size={100} className="text-blue-500 dark:text-white" />
          </div>
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-[#38BDF8]/10 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-[#38BDF8]">
              <Sparkles size={14} />
              AI Class Insights
            </div>
            {loadingAi ? (
              <div className="animate-pulse flex flex-col gap-2">
                <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-1/2"></div>
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-slate-800 dark:text-white whitespace-pre-line">
                {aiInsights}
              </p>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl bg-white dark:bg-[#0F172A]/60 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 dark:border-white/5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-white/10 text-blue-600 dark:text-[#4285D4]">
              <TrendingUp size={24} />
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-[#94A3B8]">Rata-rata Kelas</p>
            <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{stats.classAverage}%</p>
          </div>
          
          <div className="rounded-3xl bg-white dark:bg-[#0F172A]/60 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 dark:border-white/5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-[#FFF5F5]/10 text-red-500 dark:text-[#E53E3E]">
              <AlertCircle size={24} />
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-[#94A3B8]">Siswa Butuh Bantuan</p>
            <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{stats.studentsNeedingHelp} <span className="text-base text-slate-500 dark:text-[#94A3B8]">Siswa</span></p>
          </div>

          <div className="rounded-3xl bg-white dark:bg-[#0F172A]/60 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 dark:border-white/5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 dark:bg-[#FFF9E6]/10 text-amber-500 dark:text-[#D69E2E]">
              <BookOpen size={24} />
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-[#94A3B8]">Topik Tersulit (Bulan ini)</p>
            <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{stats.hardestTopic}</p>
          </div>
          
          <div className="rounded-3xl bg-white dark:bg-[#0F172A]/60 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 dark:border-white/5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 dark:bg-[#EEF8F1]/10 text-green-600 dark:text-[#4B8B60]">
              <BarChart3 size={24} />
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-[#94A3B8]">Total Kuis Selesai</p>
            <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{stats.totalQuizzes}</p>
          </div>
        </div>

        {/* Visualisasi Kesulitan Topik (Dummy Bar Chart using divs) */}
        <div className="mb-10">
          <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">Topik dengan Tingkat Kesalahan Tertinggi</h3>
          <div className="flex flex-col gap-6">
            
            <div className="rounded-xl border border-slate-200 dark:border-white/10 p-6 text-center bg-white dark:bg-transparent">
              <p className="text-sm text-slate-500 dark:text-[#718096]">Belum ada data kuis yang diselesaikan oleh siswa.</p>
            </div>

          </div>
        </div>

        {/* Mastery Table */}
        <div>
          <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">Tingkat Penguasaan Materi (Mastery) per Siswa</h3>
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:border-none dark:bg-[#0F172A]/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-[#0F172A]/60 text-xs font-semibold uppercase text-slate-500 dark:text-[#94A3B8]">
                  <tr>
                    <th className="px-6 py-4">Nama Siswa</th>
                    <th className="px-6 py-4">Skor Penguasaan</th>
                    <th className="px-6 py-4">Topik Paling Lemah</th>
                    <th className="px-6 py-4">Status / Rekomendasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#F0F3F8]/10">
                  {masteryData.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-slate-500 dark:text-[#64748B]">
                        {loadingMastery ? 'Memuat data penguasaan...' : 'Belum ada data siswa.'}
                      </td>
                    </tr>
                  ) : (
                    masteryData.map((item) => {
                    let badgeColor = "bg-green-50 text-green-700 dark:bg-[#EEF8F1]/10 dark:text-[#4B8B60]";
                    if (item.status === 'Perlu Perhatian' || item.status === 'Butuh Intervensi') {
                      badgeColor = "bg-red-50 text-red-700 dark:bg-[#FFF5F5]/10 dark:text-[#E53E3E]";
                    } else if (item.status === 'Aman' || item.status === 'Belum Ada Data') {
                      badgeColor = "bg-slate-100 text-slate-600 dark:bg-[#F8FAFC]/10 dark:text-[#94A3B8]";
                    }

                    return (
                      <tr key={item.id} className="transition hover:bg-slate-50 dark:hover:bg-white/5 border-b border-slate-100 dark:border-white/5 last:border-0">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                              <div 
                                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-sky-400 dark:from-[#4285D4] dark:to-[#38BDF8]"
                                style={{ width: `${item.mastery}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-slate-900 dark:text-white">{item.mastery}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-500 dark:text-[#94A3B8] truncate max-w-[200px]">{item.weakTopic}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${badgeColor}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </TeacherLayout>
  );
}
