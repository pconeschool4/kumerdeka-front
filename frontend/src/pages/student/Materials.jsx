import { Sparkles, BookOpen, Clock, AlertTriangle, ArrowRight, Video } from 'lucide-react';
import StudentLayout from '../../Layouts/StudentLayout';
import { Link } from 'react-router-dom';

// Dummy data structure simulating Supabase fetch for history
const DUMMY_HISTORY = [
  { id: 1, date: '18 Agt 2026', topic: 'Persamaan Linear (SubBAB 1.2)', score: 75, status: 'Perlu latihan', colorMode: 'yellow' },
  { id: 2, date: '15 Agt 2026', topic: 'Operasi Aljabar (SubBAB 1.1)', score: 90, status: 'Sudah dikuasai', colorMode: 'green' },
  { id: 3, date: '10 Agt 2026', topic: 'Konsep Fungsi (SubBAB 2.1)', score: 30, status: 'Perlu penguatan', colorMode: 'red' },
];

export default function Materials() {
  
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
          <h1 className="text-2xl font-bold tracking-tight text-[#172B4D] md:text-3xl">
            Riwayat & Rangkuman Belajar
          </h1>
          <p className="mt-2 text-[#718096]">
            Review materi dari kuis terakhirmu dan pahami penjelasan konsepnya.
          </p>
        </div>

        {/* Highlight Kuis Terakhir */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="border-b border-[#F0F3F8] p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#FFF9E6] px-3 py-1 text-xs font-bold text-[#D69E2E]">
                  <Clock size={14} />
                  Kuis Terakhir: Hari ini
                </div>
                <h2 className="text-xl font-bold text-[#172B4D] md:text-2xl">
                  Persamaan Linear
                </h2>
                <p className="mt-1 font-medium text-[#718096]">CP 3.2 · TP 3.2.1</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm font-semibold text-[#718096]">Skor kamu</p>
                <p className="text-3xl font-bold text-[#172B4D]">75<span className="text-xl text-[#A0AEC0]">/100</span></p>
              </div>
            </div>
          </div>
          
          {/* AI Insight Box */}
          <div className="bg-[#FAF5FF] p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F3E8FF] text-[#8B5CF6]">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="mb-1 text-sm font-bold text-[#8B5CF6] uppercase tracking-wider">
                  Analisis Kelemahan (AI)
                </h3>
                <p className="font-medium leading-relaxed text-[#172B4D]">
                  "Kamu sudah menguasai penjumlahan variabel dengan sangat baik, namun kamu masih sering terkecoh pada perpindahan konstanta negatif ke ruas kanan. Ingat bahwa tanda negatif akan berubah menjadi positif saat berpindah ruas."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ringkasan Materi */}
        <div className="mb-10">
          <div className="mb-6 flex items-center gap-2">
            <BookOpen size={20} className="text-[#4285D4]" />
            <h3 className="text-xl font-bold text-[#172B4D]">Materi yang perlu direview</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Kartu Materi 1 */}
            <div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] md:p-8">
              <div>
                <h4 className="mb-3 text-lg font-bold text-[#172B4D]">
                  Aturan Pindah Ruas (Transposisi)
                </h4>
                <p className="mb-4 text-sm leading-relaxed text-[#52637A]">
                  Saat memindahkan angka (konstanta) atau variabel melewati tanda sama dengan (=), operasinya akan terbalik. Penjumlahan menjadi pengurangan, dan perkalian menjadi pembagian.
                </p>
                <div className="mb-6 rounded-2xl bg-[#F5F8FC] p-4 font-mono text-sm text-[#172B4D]">
                  <p>2x <span className="font-bold text-[#E53E3E]">- 5</span> = 15</p>
                  <p>2x = 15 <span className="font-bold text-[#4B8B60]">+ 5</span></p>
                  <p>2x = 20</p>
                </div>
              </div>
            </div>

            {/* Kartu Materi 2 */}
            <div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] md:p-8">
              <div>
                <h4 className="mb-3 text-lg font-bold text-[#172B4D]">
                  Pembagian Variabel
                </h4>
                <p className="mb-4 text-sm leading-relaxed text-[#52637A]">
                  Langkah terakhir dalam menyelesaikan persamaan linear satu variabel adalah membagi kedua ruas dengan koefisien variabel tersebut agar menyisakan x saja.
                </p>
                <div className="mb-6 rounded-2xl bg-[#F5F8FC] p-4 font-mono text-sm text-[#172B4D]">
                  <p>2x = 20</p>
                  <p>x = 20 / 2</p>
                  <p>x = 10</p>
                </div>
              </div>
              <Link 
                to="/student/recommendations" 
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4285D4] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3171BC]"
              >
                Latih Pemahaman Ini
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Histori Kuis */}
        <div>
          <h3 className="mb-6 text-xl font-bold text-[#172B4D]">Riwayat Historis</h3>
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F8FAFC] text-xs font-semibold uppercase text-[#718096]">
                  <tr>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Topik Kuis</th>
                    <th className="px-6 py-4">Skor</th>
                    <th className="px-6 py-4">Status Penguasaan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F3F8]">
                  {DUMMY_HISTORY.map((item) => (
                    <tr key={item.id} className="transition hover:bg-[#F5F8FC]/50">
                      <td className="px-6 py-4 font-medium text-[#718096] whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="px-6 py-4 font-bold text-[#172B4D] whitespace-nowrap">
                        {item.topic}
                      </td>
                      <td className="px-6 py-4 font-bold text-[#172B4D]">
                        {item.score}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getBadgeStyles(item.colorMode)}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </StudentLayout>
  );
}
