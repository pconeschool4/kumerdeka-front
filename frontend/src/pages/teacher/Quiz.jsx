import { useState } from 'react';
import { Plus, Users, Clock, Settings, Search, CheckSquare } from 'lucide-react';
import TeacherLayout from '../../Layouts/TeacherLayout';

// Dummy data structure mirroring Supabase kuis
const DUMMY_QUIZZES = [
  { id: 1, title: 'Quiz Persamaan Linear 1', subject: 'Matematika', duration: '30 Menit', status: 'Aktif', participants: 32 },
  { id: 2, title: 'Quiz Aljabar Dasar', subject: 'Matematika', duration: '45 Menit', status: 'Selesai', participants: 40 },
];

export default function TeacherQuiz() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <TeacherLayout>
      <div className="mx-auto w-full">
        
        {/* Header & Actions */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#172B4D] md:text-3xl">
              Manajemen Kuis
            </h1>
            <p className="mt-2 text-[#718096]">
              Rakit kuis baru dari bank soal dan pantau aktivitas kuis yang sedang berjalan.
            </p>
          </div>
          <div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#4285D4] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3171BC]"
            >
              <Plus size={18} />
              Buat Kuis Baru
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF8F1] text-[#4B8B60]">
              <CheckSquare size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#718096]">Kuis Aktif</p>
              <p className="text-2xl font-bold text-[#172B4D]">1</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF4FF] text-[#4285D4]">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#718096]">Siswa Berpartisipasi</p>
              <p className="text-2xl font-bold text-[#172B4D]">72</p>
            </div>
          </div>
        </div>

        {/* Quizzes List */}
        <div>
          <h3 className="mb-6 text-xl font-bold text-[#172B4D]">Daftar Kuis</h3>
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F8FAFC] text-xs font-semibold uppercase text-[#718096]">
                  <tr>
                    <th className="px-6 py-4">Nama Kuis</th>
                    <th className="px-6 py-4">Mata Pelajaran</th>
                    <th className="px-6 py-4">Durasi</th>
                    <th className="px-6 py-4">Peserta</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F3F8]">
                  {DUMMY_QUIZZES.map((quiz) => (
                    <tr key={quiz.id} className="transition hover:bg-[#F5F8FC]/50">
                      <td className="px-6 py-4 font-bold text-[#172B4D] whitespace-nowrap">
                        {quiz.title}
                      </td>
                      <td className="px-6 py-4 font-medium text-[#718096] whitespace-nowrap">
                        {quiz.subject}
                      </td>
                      <td className="px-6 py-4 font-medium text-[#718096] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock size={16} className="text-[#A0AEC0]" />
                          {quiz.duration}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-[#718096] whitespace-nowrap">
                        {quiz.participants} Siswa
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          quiz.status === 'Aktif' ? 'bg-[#EEF8F1] text-[#4B8B60]' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {quiz.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="rounded-lg p-2 text-[#718096] transition hover:bg-[#F5F8FC] hover:text-[#4285D4]">
                          <Settings size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Create Quiz Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#172B4D]/40 p-4">
            <div className="my-8 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl md:p-8">
              <h2 className="mb-6 text-xl font-bold text-[#172B4D]">Buat Kuis Baru</h2>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#718096]">Judul Kuis</label>
                  <input type="text" className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm focus:border-[#4285D4] focus:outline-none" placeholder="Contoh: Kuis Harian Aljabar" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#718096]">Durasi (Menit)</label>
                  <input type="number" defaultValue={30} className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm focus:border-[#4285D4] focus:outline-none" />
                </div>
              </div>

              <div className="my-6">
                <label className="mb-3 block text-sm font-medium text-[#718096]">Pilih Soal dari Bank Soal</label>
                
                {/* Search Bar */}
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
                  <Search size={18} className="text-[#A0AEC0]" />
                  <input type="text" placeholder="Cari berdasarkan topik atau kata kunci..." className="w-full bg-transparent text-sm focus:outline-none" />
                </div>

                {/* Dummy Question Selection List */}
                <div className="max-h-48 overflow-y-auto rounded-xl border border-[#E2E8F0] divide-y divide-[#F0F3F8]">
                  {[1, 2, 3].map((num) => (
                    <label key={num} className="flex cursor-pointer items-start gap-3 p-4 transition hover:bg-[#F5F8FC]">
                      <input type="checkbox" className="mt-1 h-4 w-4 rounded border-[#E2E8F0] text-[#4285D4] focus:ring-[#4285D4]" />
                      <div>
                        <p className="text-sm font-bold text-[#172B4D]">Soal Nomor {num}: Persamaan Linear Dasar</p>
                        <p className="text-xs text-[#718096]">Level: Sedang | CP 3.2</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#F0F3F8] pt-6">
                <button onClick={() => setShowCreateModal(false)} className="rounded-xl px-5 py-2.5 text-sm font-bold text-[#718096] hover:bg-gray-100">Batal</button>
                <button onClick={() => setShowCreateModal(false)} className="rounded-xl bg-[#4285D4] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#3171BC]">
                  Terbitkan Kuis
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </TeacherLayout>
  );
}
