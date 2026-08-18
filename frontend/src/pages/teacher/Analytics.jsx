import { BarChart3, TrendingUp, AlertCircle, BookOpen } from 'lucide-react';
import TeacherLayout from '../../Layouts/TeacherLayout';

// Dummy data for analytics
const DUMMY_MASTERY = [
  { id: 1, name: 'Andi Saputra', mastery: 85, weakTopic: 'Fungsi Kuadrat', status: 'Aman' },
  { id: 2, name: 'Budi Raharjo', mastery: 45, weakTopic: 'Persamaan Linear (TP 3.2.1)', status: 'Butuh Intervensi' },
  { id: 3, name: 'Citra Lestari', mastery: 92, weakTopic: '-', status: 'Sangat Baik' },
  { id: 4, name: 'Dewi Sartika', mastery: 60, weakTopic: 'Geometri Dasar', status: 'Perlu Perhatian' },
];

export default function TeacherAnalytics() {
  return (
    <TeacherLayout>
      <div className="mx-auto w-full">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[#172B4D] md:text-3xl">
            Analitik Kelas
          </h1>
          <p className="mt-2 text-[#718096]">
            Pantau ringkasan performa kelas, identifikasi topik yang sulit, dan lihat tingkat penguasaan setiap siswa.
          </p>
        </div>

        {/* Stats Row */}
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF4FF] text-[#4285D4]">
              <TrendingUp size={24} />
            </div>
            <p className="text-sm font-semibold text-[#718096]">Rata-rata Kelas</p>
            <p className="mt-1 text-3xl font-bold text-[#172B4D]">76.5</p>
          </div>
          
          <div className="rounded-3xl bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF5F5] text-[#E53E3E]">
              <AlertCircle size={24} />
            </div>
            <p className="text-sm font-semibold text-[#718096]">Siswa Butuh Bantuan</p>
            <p className="mt-1 text-3xl font-bold text-[#172B4D]">4 <span className="text-base text-[#718096]">Siswa</span></p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF9E6] text-[#D69E2E]">
              <BookOpen size={24} />
            </div>
            <p className="text-sm font-semibold text-[#718096]">Topik Tersulit (Bulan ini)</p>
            <p className="mt-1 text-lg font-bold text-[#172B4D]">Persamaan Linear</p>
          </div>
          
          <div className="rounded-3xl bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF8F1] text-[#4B8B60]">
              <BarChart3 size={24} />
            </div>
            <p className="text-sm font-semibold text-[#718096]">Total Kuis Selesai</p>
            <p className="mt-1 text-3xl font-bold text-[#172B4D]">12</p>
          </div>
        </div>

        {/* Visualisasi Kesulitan Topik (Dummy Bar Chart using divs) */}
        <div className="mb-10">
          <h3 className="mb-6 text-xl font-bold text-[#172B4D]">Topik dengan Tingkat Kesalahan Tertinggi</h3>
          <div className="rounded-3xl bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] md:p-8">
            <div className="space-y-6">
              
              {/* Bar 1 */}
              <div>
                <div className="mb-2 flex items-center justify-between text-sm font-bold text-[#172B4D]">
                  <span>Persamaan Linear Satu Variabel (TP 3.2.1)</span>
                  <span className="text-[#E53E3E]">65% Salah</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-[#F0F3F8]">
                  <div className="h-full rounded-full bg-[#E53E3E]" style={{ width: '65%' }}></div>
                </div>
              </div>

              {/* Bar 2 */}
              <div>
                <div className="mb-2 flex items-center justify-between text-sm font-bold text-[#172B4D]">
                  <span>Operasi Pecahan Aljabar (TP 3.1.2)</span>
                  <span className="text-[#D69E2E]">42% Salah</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-[#F0F3F8]">
                  <div className="h-full rounded-full bg-[#D69E2E]" style={{ width: '42%' }}></div>
                </div>
              </div>

              {/* Bar 3 */}
              <div>
                <div className="mb-2 flex items-center justify-between text-sm font-bold text-[#172B4D]">
                  <span>Sifat-sifat Bangun Datar (TP 3.3.1)</span>
                  <span className="text-[#4B8B60]">15% Salah</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-[#F0F3F8]">
                  <div className="h-full rounded-full bg-[#4B8B60]" style={{ width: '15%' }}></div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Mastery Table */}
        <div>
          <h3 className="mb-6 text-xl font-bold text-[#172B4D]">Tingkat Penguasaan Materi (Mastery) per Siswa</h3>
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F8FAFC] text-xs font-semibold uppercase text-[#718096]">
                  <tr>
                    <th className="px-6 py-4">Nama Siswa</th>
                    <th className="px-6 py-4">Skor Penguasaan</th>
                    <th className="px-6 py-4">Topik Paling Lemah</th>
                    <th className="px-6 py-4">Status / Rekomendasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F3F8]">
                  {DUMMY_MASTERY.map((student) => (
                    <tr key={student.id} className="transition hover:bg-[#F5F8FC]/50">
                      <td className="px-6 py-4 font-bold text-[#172B4D] whitespace-nowrap">
                        {student.name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 overflow-hidden rounded-full bg-[#F0F3F8]">
                            <div 
                              className={`h-2 rounded-full ${
                                student.mastery >= 80 ? 'bg-[#4B8B60]' : 
                                student.mastery >= 60 ? 'bg-[#D69E2E]' : 'bg-[#E53E3E]'
                              }`}
                              style={{ width: `${student.mastery}%` }}
                            ></div>
                          </div>
                          <span className="font-bold text-[#172B4D]">{student.mastery}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-[#718096]">
                        {student.weakTopic}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          student.status === 'Sangat Baik' || student.status === 'Aman' ? 'bg-[#EEF8F1] text-[#4B8B60]' :
                          student.status === 'Butuh Intervensi' ? 'bg-[#FFF5F5] text-[#E53E3E]' :
                          'bg-[#FFF9E6] text-[#D69E2E]'
                        }`}>
                          {student.status}
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
    </TeacherLayout>
  );
}
