import { useState } from 'react';
import { Plus, Sparkles, FileText, Trash2, Edit } from 'lucide-react';
import TeacherLayout from '../../Layouts/TeacherLayout';

// Dummy data structure mirroring Supabase bank_soal
const DUMMY_QUESTIONS = [
  { id: 1, question: 'Jika 2x + 5 = 17, berapakah nilai x?', cp: 'CP 3.2', level: 'Sedang', source: 'Manual', date: '18 Agt' },
  { id: 2, question: 'Apa yang dimaksud dengan variabel dalam persamaan linear?', cp: 'CP 3.1', level: 'Mudah', source: 'AI Generated', date: '17 Agt' },
  { id: 3, question: 'Sebuah mobil bergerak dengan kecepatan x km/jam. Jika...', cp: 'CP 3.4', level: 'Sulit', source: 'AI Generated', date: '15 Agt' },
];

export default function TeacherQuestions() {
  const [showManualModal, setShowManualModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  return (
    <TeacherLayout>
      <div className="mx-auto w-full">
        
        {/* Header & Actions */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#172B4D] md:text-3xl">
              Bank Soal
            </h1>
            <p className="mt-2 text-[#718096]">
              Kelola kumpulan soal. Anda dapat membuat soal secara manual atau otomatis dikonversi oleh AI dari file materi.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowManualModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-semibold text-[#172B4D] transition hover:bg-[#F8FAFC]"
            >
              <Plus size={18} />
              Buat Manual
            </button>
            <button 
              onClick={() => setShowAiModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#7C3AED]"
            >
              <Sparkles size={18} />
              Generate AI
            </button>
          </div>
        </div>

        {/* Filters Area (Optional placeholder for future) */}
        <div className="mb-6 flex gap-4">
          <select className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#718096] focus:border-[#4285D4] focus:outline-none">
            <option>Semua Mata Pelajaran</option>
            <option>Matematika</option>
          </select>
          <select className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#718096] focus:border-[#4285D4] focus:outline-none">
            <option>Semua Tingkat Kesulitan</option>
            <option>Mudah</option>
            <option>Sedang</option>
            <option>Sulit</option>
          </select>
        </div>

        {/* Questions List */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F8FAFC] text-xs font-semibold uppercase text-[#718096]">
                <tr>
                  <th className="px-6 py-4">Pertanyaan</th>
                  <th className="px-6 py-4">CP / Topik</th>
                  <th className="px-6 py-4">Kesulitan</th>
                  <th className="px-6 py-4">Sumber</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F3F8]">
                {DUMMY_QUESTIONS.map((q) => (
                  <tr key={q.id} className="transition hover:bg-[#F5F8FC]/50">
                    <td className="px-6 py-4">
                      <div className="flex max-w-md flex-col">
                        <p className="truncate font-medium text-[#172B4D]">{q.question}</p>
                        <p className="mt-0.5 text-xs text-[#A0AEC0]">Dibuat: {q.date}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#172B4D] whitespace-nowrap">
                      {q.cp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                        q.level === 'Mudah' ? 'bg-[#EEF8F1] text-[#4B8B60]' :
                        q.level === 'Sedang' ? 'bg-[#FFF9E6] text-[#D69E2E]' :
                        'bg-[#FFF5F5] text-[#E53E3E]'
                      }`}>
                        {q.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {q.source === 'Manual' ? (
                        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                          {q.source}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3E8FF] px-3 py-1 text-xs font-bold text-[#8B5CF6]">
                          <Sparkles size={12} />
                          {q.source}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="rounded-lg p-2 text-[#718096] transition hover:bg-[#F5F8FC] hover:text-[#4285D4]">
                          <Edit size={18} />
                        </button>
                        <button className="rounded-lg p-2 text-[#718096] transition hover:bg-[#FFF5F5] hover:text-[#E53E3E]">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals Simulation */}
        {showManualModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172B4D]/40 p-4">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl md:p-8">
              <h2 className="mb-6 text-xl font-bold text-[#172B4D]">Buat Soal Manual</h2>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-[#718096]">Pertanyaan</label>
                <textarea className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm focus:border-[#4285D4] focus:outline-none" rows="3" placeholder="Ketik pertanyaan di sini..."></textarea>
              </div>
              {/* Opsi dummy */}
              <div className="mb-6 space-y-3">
                <label className="block text-sm font-medium text-[#718096]">Pilihan Jawaban (A, B, C, D)</label>
                {['A', 'B', 'C', 'D'].map(opt => (
                  <div key={opt} className="flex items-center gap-3">
                    <input type="radio" name="correct" className="h-4 w-4 text-[#4285D4]" />
                    <input type="text" placeholder={`Opsi ${opt}`} className="flex-1 rounded-lg border border-[#E2E8F0] p-2.5 text-sm focus:border-[#4285D4] focus:outline-none" />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowManualModal(false)} className="rounded-xl px-5 py-2.5 text-sm font-bold text-[#718096] hover:bg-gray-100">Batal</button>
                <button onClick={() => setShowManualModal(false)} className="rounded-xl bg-[#4285D4] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#3171BC]">Simpan Soal</button>
              </div>
            </div>
          </div>
        )}

        {showAiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172B4D]/40 p-4">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3E8FF] text-[#8B5CF6]">
                  <Sparkles size={20} />
                </div>
                <h2 className="text-xl font-bold text-[#172B4D]">Konversi File dengan AI</h2>
              </div>
              
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-[#718096]">Pilih File Materi Sumber</label>
                <select className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm focus:border-[#8B5CF6] focus:outline-none">
                  <option>Pilih file yang sudah diupload...</option>
                  <option>Modul_Aljabar_Dasar.pdf</option>
                  <option>Fungsi_Grafik_Bab2.docx</option>
                </select>
              </div>

              <div className="mb-8">
                <label className="mb-2 block text-sm font-medium text-[#718096]">Jumlah Soal yang Dihasilkan</label>
                <input type="number" defaultValue={10} className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm focus:border-[#8B5CF6] focus:outline-none" />
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setShowAiModal(false)} className="rounded-xl px-5 py-2.5 text-sm font-bold text-[#718096] hover:bg-gray-100">Batal</button>
                <button onClick={() => setShowAiModal(false)} className="inline-flex items-center gap-2 rounded-xl bg-[#8B5CF6] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#7C3AED]">
                  <Sparkles size={16} /> Generate Soal
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </TeacherLayout>
  );
}
