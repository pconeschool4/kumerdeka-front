import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../../Layouts/StudentLayout';

export default function Recommendations() {
  const navigate = useNavigate();
  
  // State for interactivity (ready to be hooked to Supabase / Backend later)
  const [difficulty, setDifficulty] = useState('Sedang');
  const [questionCount, setQuestionCount] = useState(10);

  const handleStartPractice = () => {
    // Navigate to the quiz page passing parameters if needed
    navigate('/student/quiz');
  };

  return (
    <StudentLayout>
      <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#172B4D] md:text-3xl">
          Latihan yang disesuaikan untukmu
        </h1>
        <p className="mt-2 text-[#718096]">
          TRACE menemukan area yang paling membutuhkan latihan tambahan.
        </p>
      </div>

      {/* AI Recommendation Card */}
      <div className="mb-6 rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          
          {/* Left Side */}
          <div className="flex-1">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#F3E8FF] px-3 py-1 text-xs font-semibold text-[#8B5CF6]">
              <Sparkles size={14} />
              AI · RAG + JSON
            </div>
            <h2 className="mb-2 text-2xl font-bold text-[#172B4D] md:text-3xl">
              CP 3.4 · TP 3.4.2
            </h2>
            <p className="text-[#718096]">
              Materi: Fungsi dan grafik
            </p>
          </div>

          {/* Right Side (Reasoning) */}
          <div className="flex-1 lg:max-w-md">
            <div className="mb-4 inline-block rounded-full bg-[#FFF5F5] px-4 py-1.5 text-xs font-bold text-[#E53E3E]">
              30% · Perlu penguatan
            </div>
            <div>
              <p className="mb-1 text-sm font-semibold text-[#52637A]">
                Kenapa direkomendasikan?
              </p>
              <p className="text-sm leading-relaxed text-[#172B4D]">
                Karena hasil quiz terakhir menunjukkan kesulitan pada konsep dasar topik ini.
              </p>
            </div>
          </div>
          
        </div>
      </div>

      {/* Configuration & Action Area */}
      <div>
        <h3 className="mb-4 text-xl font-bold text-[#172B4D]">Atur latihan</h3>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          {/* Atur Latihan (Settings) */}
          <div className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8">
            {/* Tingkat Kesulitan */}
            <div className="mb-8">
            <label className="mb-4 block text-sm font-medium text-[#718096]">
              Tingkat kesulitan
            </label>
            <div className="flex flex-wrap gap-3">
              {['Mudah', 'Sedang', 'Sulit'].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                    difficulty === level
                      ? 'bg-[#4285D4] text-white shadow-sm'
                      : 'bg-white text-[#718096] hover:bg-[#F5F8FC]'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Jumlah Soal */}
          <div>
            <label className="mb-4 block text-sm font-medium text-[#718096]">
              Jumlah soal
            </label>
            <div className="flex flex-wrap gap-3">
              {[5, 10, 15].map((num) => (
                <button
                  key={num}
                  onClick={() => setQuestionCount(num)}
                  className={`flex h-10 w-12 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                    questionCount === num
                      ? 'bg-[#4285D4] text-white shadow-sm'
                      : 'bg-white text-[#718096] hover:bg-[#F5F8FC]'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Latihan Summary */}
        <div className="flex flex-col justify-center rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8">
          <p className="mb-2 text-sm font-medium text-[#718096]">
            Kamu akan mendapatkan
          </p>
          <h3 className="mb-3 text-2xl font-bold leading-tight text-[#172B4D] md:text-3xl">
            {questionCount} soal {difficulty.toLowerCase()} baru yang fokus pada TP 3.4.2.
          </h3>
          <p className="mb-8 text-[#718096]">
            Tanpa mengulang materi yang sudah kamu kuasai.
          </p>

          <button 
            onClick={handleStartPractice}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#4285D4] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#3171BC]"
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
