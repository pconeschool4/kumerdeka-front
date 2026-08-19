import { useState, useEffect } from 'react';
import { Search, User, Filter, MoreVertical, Eye, Loader2 } from 'lucide-react';
import TeacherLayout from '../../Layouts/TeacherLayout';
import { supabase } from '../../lib/supabaseClient';

export default function TeacherStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data: siswaData, error: siswaError } = await supabase
        .from('data_siswa')
        .select('*')
        .order('nama', { ascending: true });

      if (siswaError) throw siswaError;

      const { data: results, error: resultsError } = await supabase
        .from('hasil_kuis')
        .select('siswa_id, nilai');

      if (resultsError) throw resultsError;

      const formatted = (siswaData || []).map(s => {
        const studentResults = (results || []).filter(r => r.siswa_id === s.id);
        
        let avg = 0;
        let status = "Menunggu Data";
        
        if (studentResults.length > 0) {
          const sum = studentResults.reduce((acc, r) => acc + (r.nilai || 0), 0);
          avg = Math.round(sum / studentResults.length);
          
          if (avg >= 80) status = "Sangat Baik";
          else if (avg >= 60) status = "Aman";
          else status = "Butuh Intervensi";
        }

        return {
          ...s,
          mastery: avg,
          status: status
        };
      });

      setStudents(formatted);
    } catch (error) {
      console.error("Error fetching students:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TeacherLayout>
      <div className="mx-auto w-full">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">
            Daftar Siswa
          </h1>
          <p className="mt-2 text-slate-500 dark:text-[#94A3B8]">
            Kelola data siswa, pantau status mereka, dan identifikasi siswa yang berada dalam intervensi mode adaptif.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0F172A]/60 px-3 py-2.5 focus-within:border-blue-500 dark:focus-within:border-[#4285D4]">
            <Search size={18} className="text-slate-400 dark:text-[#64748B]" />
            <input 
              type="text" 
              placeholder="Cari nama siswa..." 
              className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none" 
            />
          </div>
          <div className="flex gap-3">
            <select className="rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0F172A]/60 px-4 py-2.5 text-sm text-slate-600 dark:text-[#94A3B8] focus:border-blue-500 dark:focus:border-[#4285D4] focus:outline-none">
              <option>Semua Kelas</option>
              <option>7A</option>
              <option>7B</option>
            </select>
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0F172A]/60 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-white transition hover:bg-slate-50 dark:hover:bg-[#0F172A]/60">
              <Filter size={18} />
              Filter
            </button>
          </div>
        </div>

        {/* Students List */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:border-none dark:bg-[#0F172A]/60">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 dark:text-[#4285D4]" />
            </div>
          ) : students.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-slate-500 dark:text-[#94A3B8]">
              <User size={40} className="mb-2 text-slate-400 dark:text-[#64748B]" />
              <p>Belum ada data siswa.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-[#0F172A]/60 text-xs font-semibold uppercase text-slate-500 dark:text-[#94A3B8]">
                  <tr>
                    <th className="px-6 py-4">Nama Siswa</th>
                    <th className="px-6 py-4">Kelas</th>
                    <th className="px-6 py-4">Status Mode Adaptif</th>
                    <th className="px-6 py-4">Status Akun</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#F0F3F8]/10">
                  {students.map((student) => {
                    let badgeColor = "bg-green-50 text-green-700 dark:bg-[#EEF8F1]/10 dark:text-[#4B8B60]";
                    if (student.status === 'Butuh Intervensi') {
                      badgeColor = "bg-red-50 text-red-700 dark:bg-[#FFF5F5]/10 dark:text-[#E53E3E]";
                    } else if (student.status === 'Menunggu Data') {
                      badgeColor = "bg-slate-100 text-slate-600 dark:bg-[#F8FAFC]/10 dark:text-[#64748B]";
                    }

                    return (
                      <tr key={student.id} className="transition hover:bg-slate-50 dark:hover:bg-white/5 border-b border-slate-100 dark:border-white/5 last:border-0">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-white/10 text-blue-600 dark:text-[#4285D4]">
                              <User size={18} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">{student.nama}</p>
                              <p className="text-[11px] text-slate-500 dark:text-[#64748B]">ID: {student.id.substring(0,8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-slate-100 dark:bg-[#1E293B] px-3 py-1 text-xs font-semibold text-slate-600 dark:text-[#94A3B8]">
                            Kelas {student.kelas || 'Umum'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${badgeColor}`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 dark:bg-[#EEF8F1]/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-green-700 dark:text-[#4B8B60]">
                            Aktif
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            className="inline-flex h-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-white/5 px-3 text-sm font-medium text-blue-600 dark:text-[#4285D4] transition hover:bg-blue-100 dark:hover:bg-white/10"
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowProfileModal(true);
                            }}
                          >
                            <Eye size={14} className="mr-1.5" /> Profil
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Profile Modal */}
        {showProfileModal && selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-[#172B4D]/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0F172A]/80 p-6 shadow-2xl md:p-8 backdrop-blur-xl">
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 dark:bg-white/10 text-3xl font-bold text-blue-600 dark:text-[#4285D4]">
                  {selectedStudent.nama.charAt(0)}
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedStudent.nama}</h2>
                <p className="text-sm font-medium text-slate-500 dark:text-[#94A3B8]">{selectedStudent.kelas ? `Kelas ${selectedStudent.kelas}` : 'Belum ada kelas'}</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-[#94A3B8]">{selectedStudent.bio || '-'}</p>
              </div>
              
              <div className="mb-6 space-y-3 rounded-2xl border border-slate-100 bg-slate-50 dark:border-white/5 dark:bg-[#0F172A]/60 p-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-[#94A3B8]">Skor Mastery</p>
                  <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{selectedStudent?.mastery}%</p>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-500 dark:text-[#94A3B8]">Mode Adaptif:</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Normal</span>
                </div>
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={() => setShowProfileModal(false)} 
                  className="rounded-xl bg-[#4285D4] px-8 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#3171BC]"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </TeacherLayout>
  );
}
