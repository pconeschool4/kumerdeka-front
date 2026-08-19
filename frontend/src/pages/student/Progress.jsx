import { useState, useEffect } from 'react';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import StudentLayout from '../../Layouts/StudentLayout';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

export default function Progress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProgressData();
    }
  }, [user]);

  const fetchProgressData = async () => {
    try {
      // Dapatkan siswa_id
      const { data: siswaData } = await supabase
        .from('data_siswa')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      if (!siswaData) {
        setLoading(false);
        return;
      }

      // Ambil hasil kuis
      const { data, error } = await supabase
        .from('hasil_kuis')
        .select('nilai, kuis(subjects(nama))')
        .eq('siswa_id', siswaData.id);

      if (data && !error) {
        // Kelompokkan berdasarkan mata pelajaran
        const subjectStats = {};
        data.forEach(item => {
          const subject = item.kuis?.subjects?.nama || 'Lainnya';
          if (!subjectStats[subject]) {
            subjectStats[subject] = { total: 0, count: 0 };
          }
          subjectStats[subject].total += (item.nilai || 0);
          subjectStats[subject].count += 1;
        });

        // Ubah menjadi array untuk UI
        const progressArray = Object.keys(subjectStats).map((subject, idx) => {
          const avg = Math.round(subjectStats[subject].total / subjectStats[subject].count);
          let status = '';
          let color = '';
          let message = '';

          if (avg >= 80) {
            status = 'Sangat Menguasai';
            color = 'green';
            message = 'Pertahankan prestasimu!';
          } else if (avg >= 60) {
            status = 'Cukup Menguasai';
            color = 'yellow';
            message = 'Review kembali beberapa materi yang sulit.';
          } else {
            status = 'Perlu Perhatian';
            color = 'red';
            message = 'Banyak berlatih latihan dasar.';
          }

          return {
            id: idx + 1,
            topic: subject,
            mastery: avg,
            status: status,
            colorMode: color,
            message: message
          };
        });

        setProgress(progressArray);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  
  // Helper for colors
  const getColorStyles = (mode) => {
    switch (mode) {
      case 'green':
        return {
          barBg: 'bg-[#D1FAE5]',
          barFill: 'bg-[#34D399]',
          badgeBg: 'bg-[#EEF8F1]',
          badgeText: 'text-[#4B8B60]'
        };
      case 'yellow':
        return {
          barBg: 'bg-[#FEF3C7]',
          barFill: 'bg-[#FBBF24]',
          badgeBg: 'bg-[#FFF9E6]',
          badgeText: 'text-[#D69E2E]'
        };
      case 'red':
        return {
          barBg: 'bg-[#FEE2E2]',
          barFill: 'bg-[#F87171]',
          badgeBg: 'bg-[#FFF5F5]',
          badgeText: 'text-[#E53E3E]'
        };
      default:
        return {
          barBg: 'bg-gray-100',
          barFill: 'bg-gray-400',
          badgeBg: 'bg-gray-100',
          badgeText: 'text-gray-600'
        };
    }
  };

  return (
    <StudentLayout>
      <div className="mx-auto w-full">
      
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
            Progress Belajar
          </h1>
          <p className="mt-1 font-bold text-slate-900 dark:text-white">
            Peta Semua Mata Pelajaran
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-[#94A3B8]">
            Lihat apa yang sudah kamu kuasai dan apa yang perlu diperkuat berdasarkan kuis yang sudah dikerjakan.
          </p>
        </div>
        <div className="hidden rounded-full bg-slate-50 dark:bg-white/5 px-4 py-1.5 text-xs font-semibold text-[#4285D4] md:block">
          Adaptif · Tidak linear
        </div>
      </div>

      {/* Legend Card */}
      <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white dark:bg-[#0F172A]/60 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wide">
            Alur mastery
          </p>
          <p className="mt-1 font-bold text-slate-900 dark:text-white">
            SubBAB → CP → TP
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="rounded-full bg-[#EEF8F1] px-4 py-1.5 text-xs font-bold text-[#4B8B60]">
            Sudah dikuasai
          </span>
          <span className="rounded-full bg-[#FFF9E6] px-4 py-1.5 text-xs font-bold text-[#D69E2E]">
            Sedang berkembang
          </span>
          <span className="rounded-full bg-[#FFF5F5] px-4 py-1.5 text-xs font-bold text-[#E53E3E]">
            Perlu perhatian
          </span>
        </div>
      </div>

      {/* Progress List */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {progress.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A]/60 p-6 text-center text-slate-500 dark:text-[#94A3B8] backdrop-blur-xl">
              Belum ada data progress. Kerjakan kuis untuk melihat perkembanganmu di sini.
            </div>
          ) : (
            progress.map((item) => {
            const colors = getColorStyles(item.colorMode);
            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-[#F0F3F8]/10 bg-white dark:bg-[#0F172A]/60 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all hover:-translate-y-1 hover:border-[#4285D4]/30 hover:shadow-[0_8px_30px_rgb(66,133,212,0.1)]"
              >
                {/* Header Card */}
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white">{item.topic}</h3>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${colors.badgeBg} ${colors.badgeText}`}>
                    {item.status}
                  </span>
                </div>

                {/* Progress Bar & Persentase */}
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500 dark:text-[#94A3B8]">Penguasaan</span>
                    <span className="font-bold text-slate-900 dark:text-white">{item.mastery}%</span>
                  </div>
                  <div className={`h-2.5 w-full overflow-hidden rounded-full ${colors.barBg}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${colors.barFill}`}
                      style={{ width: `${item.mastery}%` }}
                    />
                  </div>
                </div>

                {/* Rekomendasi Khusus */}
                <div className="rounded-2xl border border-slate-200 dark:border-[#F0F3F8]/5 bg-slate-50 dark:bg-white/5 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Lightbulb size={16} className="text-[#F59E0B]" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Saran AI</span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-[#94A3B8]">
                    {item.message}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Note */}
      <div className="mt-8 flex items-start gap-3 px-2">
        <Lightbulb size={20} className="mt-0.5 shrink-0 text-[#D69E2E]" />
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            Kamu tidak perlu menyelesaikan semua topik secara berurutan.
          </p>
          <p className="text-sm text-slate-500 dark:text-[#94A3B8]">
            TRACE memprioritaskan materi berdasarkan bukti penguasaanmu.
          </p>
        </div>
      </div>
      </div>
    </StudentLayout>
  );
}
