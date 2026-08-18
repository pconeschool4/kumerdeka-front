import { ArrowRight, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import StudentLayout from '../../Layouts/StudentLayout';

// Dummy data structure mirroring Supabase rows for Progress
const DUMMY_PROGRESS = [
  {
    id: 1,
    bab: 'BAB 1 · Aljabar',
    subBab: 'SubBAB 1.1 · Operasi',
    cp: 'CP 3.1',
    tp: 'TP 3.1.1',
    score: 90,
    status: 'Sudah dikuasai',
    colorMode: 'green'
  },
  {
    id: 2,
    bab: 'BAB 1 · Aljabar',
    subBab: 'SubBAB 1.2 · Persamaan',
    cp: 'CP 3.2',
    tp: 'TP 3.2.1',
    score: 75,
    status: 'Perlu latihan',
    colorMode: 'yellow'
  },
  {
    id: 3,
    bab: 'BAB 2 · Fungsi',
    subBab: 'SubBAB 2.1 · Konsep',
    cp: 'CP 3.4',
    tp: 'TP 3.4.1',
    score: 30,
    status: 'Perlu penguatan',
    colorMode: 'red'
  },
  {
    id: 4,
    bab: 'BAB 2 · Fungsi',
    subBab: 'SubBAB 2.2 · Grafik',
    cp: 'CP 3.5',
    tp: 'TP 3.5.2',
    score: 68,
    status: 'Perlu latihan',
    colorMode: 'yellow'
  }
];

export default function Progress() {
  
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
          <h1 className="text-2xl font-bold text-[#172B4D] md:text-3xl">
            Progress Belajar
          </h1>
          <p className="mt-1 font-bold text-[#172B4D]">
            Matematika · Kelas XI
          </p>
          <p className="mt-1 text-sm text-[#718096]">
            Lihat apa yang sudah kamu kuasai dan apa yang perlu diperkuat.
          </p>
        </div>
        <div className="hidden rounded-full bg-[#F5F8FC] px-4 py-1.5 text-xs font-semibold text-[#4285D4] md:block">
          Adaptif · Tidak linear
        </div>
      </div>

      {/* Legend Card */}
      <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="text-xs font-semibold text-[#718096] uppercase tracking-wide">
            Alur mastery
          </p>
          <p className="mt-1 font-bold text-[#172B4D]">
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
      <div className="flex flex-col gap-4">
        {DUMMY_PROGRESS.map((item) => {
          const colors = getColorStyles(item.colorMode);
          
          return (
            <div 
              key={item.id} 
              className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] md:flex-row md:items-center md:px-8 md:py-6"
            >
              {/* Titles */}
              <div className="w-full md:w-48 lg:w-64">
                <p className="text-xs font-medium text-[#A0AEC0]">{item.bab}</p>
                <p className="mt-1 font-bold text-[#172B4D]">{item.subBab}</p>
              </div>

              {/* CP / TP */}
              <div className="flex w-full justify-between gap-6 md:w-auto md:justify-start">
                <span className="text-sm font-bold text-[#172B4D]">{item.cp}</span>
                <span className="text-sm font-medium text-[#718096]">{item.tp}</span>
              </div>

              {/* Progress Bar & Score */}
              <div className="flex flex-1 items-center gap-4">
                <span className="w-10 text-right text-base font-bold text-[#172B4D]">
                  {item.score}%
                </span>
                <div className={`h-2.5 flex-1 overflow-hidden rounded-full ${colors.barBg}`}>
                  <div 
                    className={`h-full rounded-full ${colors.barFill}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>

              {/* Status Badge & Action */}
              <div className="flex w-full items-center justify-between gap-6 border-t border-[#F0F3F8] pt-4 md:w-auto md:border-none md:pt-0">
                <span className={`rounded-full px-4 py-1.5 text-xs font-bold ${colors.badgeBg} ${colors.badgeText}`}>
                  {item.status}
                </span>
                
                <Link 
                  to="/student/materials" 
                  className="flex items-center gap-1.5 text-sm font-bold text-[#4285D4] transition hover:text-[#3171BC]"
                >
                  Lihat TP
                  <ArrowRight size={16} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="mt-8 flex items-start gap-3 px-2">
        <Lightbulb size={20} className="mt-0.5 shrink-0 text-[#D69E2E]" />
        <div>
          <p className="text-sm font-bold text-[#172B4D]">
            Kamu tidak perlu menyelesaikan semua topik secara berurutan.
          </p>
          <p className="text-sm text-[#718096]">
            TRACE memprioritaskan materi berdasarkan bukti penguasaanmu.
          </p>
        </div>
      </div>
      </div>
    </StudentLayout>
  );
}
