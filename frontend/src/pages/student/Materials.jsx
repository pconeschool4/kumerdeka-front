import { useState, useEffect } from 'react';
import { Sparkles, BookOpen, Clock, ArrowRight } from 'lucide-react';
import StudentLayout from '../../Layouts/StudentLayout';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

export default function Materials() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      // Dapatkan siswa_id terlebih dahulu
      const { data: siswaData } = await supabase
        .from('data_siswa')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      if (!siswaData) {
        setLoading(false);
        return;
      }

      // Ambil hasil_kuis beserta nama kuis & subjects
      const { data, error } = await supabase
        .from('hasil_kuis')
        .select('id, nilai, finished_at, kuis(deskripsi, subjects(nama))')
        .eq('siswa_id', siswaData.id)
        .order('finished_at', { ascending: false });

      if (data && !error) {
        const formattedHistory = data.map(item => {
          let statusStr = '';
          let color = '';
          if (item.nilai >= 80) {
            statusStr = 'Sangat Baik';
            color = 'green';
          } else if (item.nilai >= 60) {
            statusStr = 'Cukup';
            color = 'yellow';
          } else {
            statusStr = 'Perlu Peningkatan';
            color = 'red';
          }

          return {
            id: item.id,
            date: new Date(item.finished_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            topic: item.kuis?.deskripsi || 'Kuis Latihan',
            subject: item.kuis?.subjects?.nama || '-',
            score: item.nilai,
            status: statusStr,
            colorMode: color
          };
        });
        setHistory(formattedHistory);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  // Helper for status badge colors
  const getBadgeStyles = (mode) => {
    switch (mode) {
      case 'green': return 'bg-[#EEF8F1] text-[#4B8B60]';
      case 'yellow': return 'bg-[#FFF9E6] text-[#D69E2E]';
      case 'red': return 'bg-[#FFF5F5] text-[#E53E3E]';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <StudentLayout>
      <div className="mx-auto w-full">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">
            Riwayat & Rangkuman Belajar
          </h1>
          <p className="mt-2 text-slate-500 dark:text-[#94A3B8]">
            Review materi dari kuis terakhirmu dan pahami penjelasan konsepnya.
          </p>
        </div>

        {/* Highlight Kuis Terakhir */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-white dark:bg-white dark:bg-[#0F172A]/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="border-b border-[#F0F3F8]/10 p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                {history.length > 0 ? (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white md:text-2xl">
                      Kuis Terakhir: {history[0].topic}
                    </h2>
                    <p className="mt-1 font-medium text-slate-500 dark:text-[#94A3B8]">Skor: {history[0].score} ({history[0].status}) • {history[0].subject}</p>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white md:text-2xl">
                      Belum Ada Riwayat Belajar
                    </h2>
                    <p className="mt-1 font-medium text-slate-500 dark:text-[#94A3B8]">Ikuti kuis pertamamu untuk melihat analisis dan materi di sini.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Histori Kuis */}
        <div>
          <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">Riwayat Historis</h3>
          <div className="overflow-hidden rounded-3xl bg-white dark:bg-white dark:bg-[#0F172A]/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white dark:bg-white dark:bg-[#0F172A]/60 text-xs font-semibold uppercase text-slate-500 dark:text-[#94A3B8]">
                  <tr>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Topik Kuis</th>
                    <th className="px-6 py-4">Skor</th>
                    <th className="px-6 py-4">Status Penguasaan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F3F8]/10">
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-slate-400 dark:text-[#64748B]">
                        Belum ada riwayat kuis.
                      </td>
                    </tr>
                  ) : (
                    history.map((item) => (
                    <tr key={item.id} className="transition hover:bg-slate-50 dark:bg-white/5/50">
                      <td className="px-6 py-4 font-medium text-slate-500 dark:text-[#94A3B8] whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {item.topic}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        {item.score}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getBadgeStyles(item.colorMode)}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </StudentLayout>
  );
}
