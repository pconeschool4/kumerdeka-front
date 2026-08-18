import { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, BookOpen, Target, Settings2 } from 'lucide-react';
import TeacherLayout from '../../Layouts/TeacherLayout';

// Dummy data structure mirroring Supabase subjects, cp, tp
const DUMMY_CURRICULUM = [
  {
    id: 1, 
    subject: 'Matematika', 
    cps: [
      {
        id: 101,
        kode: 'CP 3.2',
        judul: 'Persamaan Linear dan Aljabar',
        tps: [
          { id: 1001, kode: 'TP 3.2.1', judul: 'Memahami konsep variabel' },
          { id: 1002, kode: 'TP 3.2.2', judul: 'Menyelesaikan persamaan satu variabel' },
        ]
      },
      {
        id: 102,
        kode: 'CP 3.3',
        judul: 'Geometri Dasar',
        tps: [
          { id: 1003, kode: 'TP 3.3.1', judul: 'Menghitung luas bangun datar' },
        ]
      }
    ]
  },
  {
    id: 2, 
    subject: 'Ilmu Pengetahuan Alam', 
    cps: []
  }
];

export default function TeacherSubjects() {
  const [expandedSubjects, setExpandedSubjects] = useState({ 1: true });
  const [expandedCPs, setExpandedCPs] = useState({ 101: true });

  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showCPModal, setShowCPModal] = useState(false);
  const [showTPModal, setShowTPModal] = useState(false);

  const toggleSubject = (id) => {
    setExpandedSubjects(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCP = (id) => {
    setExpandedCPs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <TeacherLayout>
      <div className="mx-auto w-full">
        
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#172B4D] md:text-3xl">
              Kurikulum & Mata Pelajaran
            </h1>
            <p className="mt-2 text-[#718096]">
              Kelola struktur kurikulum dari tingkat Mata Pelajaran, Capaian Pembelajaran (CP), hingga Tujuan Pembelajaran (TP).
            </p>
          </div>
          <div>
            <button 
              onClick={() => setShowSubjectModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#4285D4] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3171BC]"
            >
              <Plus size={18} />
              Tambah Mata Pelajaran
            </button>
          </div>
        </div>

        {/* Curriculum Tree */}
        <div className="space-y-4">
          {DUMMY_CURRICULUM.map((sub) => (
            <div key={sub.id} className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
              {/* Subject Header */}
              <div 
                className="flex cursor-pointer items-center justify-between border-b border-[#F0F3F8] p-6 transition hover:bg-[#F8FAFC]"
                onClick={() => toggleSubject(sub.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF4FF] text-[#4285D4]">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#172B4D]">{sub.subject}</h2>
                    <p className="text-sm font-medium text-[#718096]">{sub.cps.length} Capaian Pembelajaran</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-[#A0AEC0] hover:text-[#4285D4]" onClick={(e) => { e.stopPropagation(); }}>
                    <Settings2 size={20} />
                  </button>
                  {expandedSubjects[sub.id] ? <ChevronDown size={24} className="text-[#718096]" /> : <ChevronRight size={24} className="text-[#718096]" />}
                </div>
              </div>

              {/* CPs inside Subject */}
              {expandedSubjects[sub.id] && sub.cps.length > 0 && (
                <div className="bg-[#F8FAFC] p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#718096]">Daftar Capaian Pembelajaran (CP)</h3>
                    <button onClick={() => setShowCPModal(true)} className="text-sm font-semibold text-[#4285D4] hover:underline">+ Tambah CP</button>
                  </div>
                  
                  <div className="space-y-4">
                    {sub.cps.map((cp) => (
                      <div key={cp.id} className="rounded-2xl border border-[#E2E8F0] bg-white">
                        {/* CP Header */}
                        <div 
                          className="flex cursor-pointer items-center justify-between p-4 transition hover:bg-[#F5F8FC]"
                          onClick={() => toggleCP(cp.id)}
                        >
                          <div className="flex items-center gap-3">
                            {expandedCPs[cp.id] ? <ChevronDown size={18} className="text-[#718096]" /> : <ChevronRight size={18} className="text-[#718096]" />}
                            <span className="rounded bg-[#F0F3F8] px-2 py-1 text-xs font-bold text-[#718096]">{cp.kode}</span>
                            <p className="font-bold text-[#172B4D]">{cp.judul}</p>
                          </div>
                          <button className="text-[#A0AEC0] hover:text-[#4285D4]">
                            <Settings2 size={16} />
                          </button>
                        </div>

                        {/* TPs inside CP */}
                        {expandedCPs[cp.id] && (
                          <div className="border-t border-[#F0F3F8] bg-[#FAFCFF] p-4 pl-12">
                            <div className="mb-3 flex items-center justify-between">
                              <p className="text-xs font-semibold text-[#718096]">Tujuan Pembelajaran (TP)</p>
                              <button onClick={() => setShowTPModal(true)} className="text-xs font-semibold text-[#4285D4] hover:underline">+ Tambah TP</button>
                            </div>
                            <ul className="space-y-2">
                              {cp.tps.map((tp) => (
                                <li key={tp.id} className="flex items-start gap-3 rounded-xl border border-[#F0F3F8] bg-white p-3">
                                  <Target size={16} className="mt-0.5 text-[#A0AEC0]" />
                                  <div className="flex-1">
                                    <span className="mr-2 rounded bg-[#EEF8F1] px-1.5 py-0.5 text-[10px] font-bold text-[#4B8B60]">{tp.kode}</span>
                                    <span className="text-sm text-[#172B4D]">{tp.judul}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Empty state for CPs */}
              {expandedSubjects[sub.id] && sub.cps.length === 0 && (
                <div className="bg-[#F8FAFC] p-8 text-center">
                  <p className="text-sm text-[#718096]">Belum ada Capaian Pembelajaran untuk mata pelajaran ini.</p>
                  <button onClick={() => setShowCPModal(true)} className="mt-3 text-sm font-semibold text-[#4285D4] hover:underline">+ Tambah CP Pertama</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modals */}
        {showSubjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172B4D]/40 p-4">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl md:p-8">
              <h2 className="mb-6 text-xl font-bold text-[#172B4D]">Tambah Mata Pelajaran Baru</h2>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-[#718096]">Nama Mata Pelajaran</label>
                <input type="text" className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm focus:border-[#4285D4] focus:outline-none" placeholder="Contoh: Fisika" />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowSubjectModal(false)} className="rounded-xl px-5 py-2.5 text-sm font-bold text-[#718096] hover:bg-gray-100">Batal</button>
                <button onClick={() => setShowSubjectModal(false)} className="rounded-xl bg-[#4285D4] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#3171BC]">Simpan</button>
              </div>
            </div>
          </div>
        )}

        {showCPModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172B4D]/40 p-4">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl md:p-8">
              <h2 className="mb-6 text-xl font-bold text-[#172B4D]">Tambah Capaian Pembelajaran (CP)</h2>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-[#718096]">Kode CP</label>
                <input type="text" className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm focus:border-[#4285D4] focus:outline-none" placeholder="Contoh: CP 3.4" />
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-[#718096]">Judul/Deskripsi Singkat</label>
                <textarea className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm focus:border-[#4285D4] focus:outline-none" rows="2" placeholder="Contoh: Trigonometri Dasar..."></textarea>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowCPModal(false)} className="rounded-xl px-5 py-2.5 text-sm font-bold text-[#718096] hover:bg-gray-100">Batal</button>
                <button onClick={() => setShowCPModal(false)} className="rounded-xl bg-[#4285D4] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#3171BC]">Simpan CP</button>
              </div>
            </div>
          </div>
        )}

        {showTPModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172B4D]/40 p-4">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl md:p-8">
              <h2 className="mb-6 text-xl font-bold text-[#172B4D]">Tambah Tujuan Pembelajaran (TP)</h2>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-[#718096]">Kode TP</label>
                <input type="text" className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm focus:border-[#4285D4] focus:outline-none" placeholder="Contoh: TP 3.4.1" />
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-[#718096]">Tujuan Spesifik</label>
                <textarea className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm focus:border-[#4285D4] focus:outline-none" rows="2" placeholder="Siswa dapat menghitung..."></textarea>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowTPModal(false)} className="rounded-xl px-5 py-2.5 text-sm font-bold text-[#718096] hover:bg-gray-100">Batal</button>
                <button onClick={() => setShowTPModal(false)} className="rounded-xl bg-[#4285D4] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#3171BC]">Simpan TP</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </TeacherLayout>
  );
}
