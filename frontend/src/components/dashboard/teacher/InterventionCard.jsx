import { Lightbulb, ArrowRight, BookOpen, Sparkles, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function InterventionCard() {
  const [recommendations, setRecommendations] = useState([]);
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterventions();
  }, []);

  const fetchInterventions = async () => {
    try {
      setLoading(true);
      const { data: siswaData, error: siswaError } = await supabase.from('data_siswa').select('*');
      if (siswaError) throw siswaError;

      const { data: results, error: resultsError } = await supabase
        .from('hasil_kuis')
        .select('siswa_id, nilai, kuis(subjects(nama))');
      if (resultsError) throw resultsError;

      const weakStudents = [];
      
      (siswaData || []).forEach(s => {
        const studentResults = (results || []).filter(r => r.siswa_id === s.id);
        if (studentResults.length > 0) {
          const totalScore = studentResults.reduce((sum, r) => sum + (r.nilai || 0), 0);
          const avg = Math.round(totalScore / studentResults.length);
          
          if (avg < 60) {
            // Temukan weak topic
            const topicScores = {};
            studentResults.forEach(r => {
              const subj = r.kuis?.subjects?.nama || 'Umum';
              if (!topicScores[subj]) topicScores[subj] = { total: 0, count: 0 };
              topicScores[subj].total += (r.nilai || 0);
              topicScores[subj].count += 1;
            });
            
            let weakTopic = "-";
            let lowest = 101;
            Object.keys(topicScores).forEach(subj => {
              const subAvg = topicScores[subj].total / topicScores[subj].count;
              if (subAvg < lowest) {
                lowest = subAvg;
                weakTopic = subj;
              }
            });
            
            weakStudents.push({
              id: s.id,
              student: s.nama,
              avg,
              weakTopic,
              issue: `Kesulitan dalam memahami materi ${weakTopic} (Rata-rata: ${avg}%)`,
              action: `Berikan latihan tambahan tentang ${weakTopic}`
            });
          }
        }
      });
      
      setRecommendations(weakStudents.slice(0, 3)); // Ambil 3 terlemah

      if (weakStudents.length > 0) {
        setAiSummary(`AI mendeteksi ada ${weakStudents.length} siswa yang berada di bawah standar ketuntasan (<60%). Sebagian besar mengalami kesulitan pada topik spesifik yang memerlukan pendampingan lebih lanjut.`);
      } else {
        setAiSummary("Seluruh siswa terpantau memiliki pemahaman yang baik di atas standar. Pertahankan performa kelas ini!");
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#0F172A]/60 p-5 dark:shadow-[0_4px_18px_rgba(36,74,120,0.04)] backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 dark:border-white/10 dark:bg-white/5">
            <Lightbulb size={20} className="text-amber-500 dark:text-[#F59E0B]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Rekomendasi Intervensi
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">Siswa yang butuh bantuan ekstra</p>
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] p-4 text-white shadow-inner">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-[#38BDF8]">
          <Sparkles size={14} />
          <span>AI Insight</span>
        </div>
        {loading ? (
           <div className="flex h-10 items-center justify-center">
             <Loader2 size={16} className="animate-spin text-[#38BDF8]" />
           </div>
        ) : (
           <p className="text-[13px] leading-relaxed text-[#94A3B8]">
             {aiSummary}
           </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="group cursor-pointer rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-slate-200 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/10"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[13px] font-semibold text-slate-900 dark:text-white">{rec.student}</p>
                <p className="mt-1 text-[13px] text-slate-500 dark:text-[#94A3B8]">{rec.issue}</p>
              </div>
              <ArrowRight size={16} className="text-slate-400 transition group-hover:text-blue-500 dark:text-[#94A3B8] dark:group-hover:text-[#38BDF8]" />
            </div>
            
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 dark:border-white/10 dark:bg-white/5">
              <BookOpen size={14} className="text-blue-600 dark:text-[#38BDF8]" />
              <span className="text-xs font-medium text-blue-600 dark:text-[#38BDF8]">{rec.action}</span>
            </div>
          </div>
        ))}
        
        {loading ? (
          <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-white/20 p-6 text-center">
            <Loader2 size={24} className="mb-2 animate-spin text-slate-400 dark:text-[#94A3B8]" />
            <p className="text-sm text-slate-500 dark:text-[#94A3B8]">Menganalisis performa...</p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 dark:border-white/20 p-6 text-center">
            <p className="text-sm text-slate-500 dark:text-[#94A3B8]">Semua siswa dalam performa yang baik!</p>
          </div>
        ) : null}
      </div>

      <button className="mt-4 w-full rounded-xl border border-slate-200 bg-white py-2.5 text-[13px] font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
        Lihat Semua Rekomendasi
      </button>
    </div>
  );
}
