import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../../Layouts/StudentLayout';
import { supabase } from '../../lib/supabaseClient';

export default function Recommendations() {
  const navigate = useNavigate();
  
  const [difficulty, setDifficulty] = useState('Sedang');
  const [questionCount, setQuestionCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleStartPractice = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      // Dapatkan token JWT dari session Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('http://localhost:5000/api/ai/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ 
          topik: 'Matematika - Persamaan Linear', 
          difficulty, 
          questionCount 
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Gagal membuat kuis');
      }

      // Berpindah ke Quiz.jsx dengan membawa data JSON Kuis hasil AI
      navigate('/student/quiz', { state: { quizData: data.quiz, topik: 'Matematika - Persamaan Linear' } });
    } catch (error) {
      console.error(error);
      setErrorMsg("Koneksi ke AI gagal. Pastikan Backend menyala dan API Key valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">
          Latihan yang disesuaikan untukmu
        </h1>
        <p className="mt-2 text-slate-500 dark:text-[#94A3B8]">
          TRACE menemukan area yang paling membutuhkan latihan tambahan.
        </p>
      </div>

      {/* AI Recommendation Card */}
      <div className="mb-6 rounded-3xl bg-white dark:bg-[#0F172A]/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          
          {/* Left Side */}
          <div className="flex-1">
            <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
              Belum Ada Rekomendasi Khusus
            </h2>
            <p className="text-slate-500 dark:text-[#94A3B8]">
              Kerjakan kuis terlebih dahulu agar AI dapat mendeteksi area kelemahanmu.
            </p>
          </div>

          {/* Right Side (Reasoning) */}
          <div className="flex-1 lg:max-w-md">
            <div>
              <p className="mb-1 text-sm font-semibold text-gray-200">
                Latihan Umum
              </p>
              <p className="text-sm leading-relaxed text-slate-900 dark:text-white">
                Kamu tetap bisa melakukan latihan umum. Atur tingkat kesulitan dan jumlah soal di bawah ini.
              </p>
            </div>
          </div>
          
        </div>
      </div>

      {/* Configuration & Action Area */}
      <div>
        <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Atur latihan</h3>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          {/* Atur Latihan (Settings) */}
          <div className="rounded-3xl bg-white dark:bg-[#0F172A]/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8">
            {/* Tingkat Kesulitan */}
            <div className="mb-8">
            <label className="mb-4 block text-sm font-medium text-slate-500 dark:text-[#94A3B8]">
              Tingkat kesulitan
            </label>
            <div className="flex flex-wrap gap-3">
              {['Mudah', 'Sedang', 'Sulit'].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                    difficulty === level
                      ? 'bg-[#4285D4] text-slate-900 dark:text-white shadow-sm'
                      : 'bg-white dark:bg-[#0F172A]/60 text-slate-500 dark:text-[#94A3B8] hover:bg-slate-50 dark:bg-white/5'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Jumlah Soal */}
          <div>
            <label className="mb-4 block text-sm font-medium text-slate-500 dark:text-[#94A3B8]">
              Jumlah soal
            </label>
            <div className="flex flex-wrap gap-3">
              {[5, 10, 15].map((num) => (
                <button
                  key={num}
                  onClick={() => setQuestionCount(num)}
                  className={`flex h-10 w-12 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                    questionCount === num
                      ? 'bg-[#4285D4] text-slate-900 dark:text-white shadow-sm'
                      : 'bg-white dark:bg-[#0F172A]/60 text-slate-500 dark:text-[#94A3B8] hover:bg-slate-50 dark:bg-white/5'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Latihan Summary */}
        <div className="flex flex-col justify-center rounded-3xl bg-white dark:bg-[#0F172A]/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8">
          <p className="mb-2 text-sm font-medium text-slate-500 dark:text-[#94A3B8]">
            Kamu akan mendapatkan
          </p>
          <h3 className="mb-3 text-2xl font-bold leading-tight text-slate-900 dark:text-white md:text-3xl">
            {questionCount} soal latihan {difficulty.toLowerCase()}
          </h3>
          <p className="mb-8 text-slate-500 dark:text-[#94A3B8]">
            Latihan umum tanpa penyesuaian area kelemahan (karena belum ada data).
          </p>

          <button 
            onClick={handleStartPractice}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#4285D4] px-6 py-3.5 text-sm font-semibold text-slate-900 dark:text-white transition hover:bg-[#3171BC]"
          >
            Mulai Latihan
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>
        </div>
      </div>
      </div>
    </StudentLayout>
  );
}
