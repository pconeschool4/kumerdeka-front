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
      const { data, error } = await supabase
        .from('data_siswa')
        .select('*')
        .order('nama', { ascending: true });

      if (error) throw error;
      setStudents(data || []);
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
          <h1 className="text-2xl font-bold tracking-tight text-[#172B4D] md:text-3xl">
            Daftar Siswa
          </h1>
          <p className="mt-2 text-[#718096]">
            Kelola data siswa, pantau status mereka, dan identifikasi siswa yang berada dalam intervensi mode adaptif.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 focus-within:border-[#4285D4]">
            <Search size={18} className="text-[#A0AEC0]" />
            <input 
              type="text" 
              placeholder="Cari nama siswa..." 
              className="w-full bg-transparent text-sm focus:outline-none" 
            />
          </div>
          <div className="flex gap-3">
            <select className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#718096] focus:border-[#4285D4] focus:outline-none">
              <option>Semua Kelas</option>
              <option>7A</option>
              <option>7B</option>
            </select>
            <button className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#172B4D] transition hover:bg-[#F8FAFC]">
              <Filter size={18} />
              Filter
            </button>
          </div>
        </div>

        {/* Students List */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#4285D4]" />
            </div>
          ) : students.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-[#718096]">
              <User size={40} className="mb-2 text-[#A0AEC0]" />
              <p>Belum ada data siswa.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F8FAFC] text-xs font-semibold uppercase text-[#718096]">
                  <tr>
                    <th className="px-6 py-4">Nama Siswa</th>
                    <th className="px-6 py-4">Kelas</th>
                    <th className="px-6 py-4">Status Mode Adaptif</th>
                    <th className="px-6 py-4">Status Akun</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F3F8]">
                  {students.map((student) => (
                    <tr key={student.id} className="transition hover:bg-[#F5F8FC]/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF4FF] text-[#4285D4]">
                            <User size={18} />
                          </div>
                          <p className="font-bold text-[#172B4D]">{student.nama}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-[#718096] whitespace-nowrap">
                        {student.kelas ? `Kelas ${student.kelas}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex rounded-full bg-[#F0F3F8] px-3 py-1 text-xs font-bold text-[#718096]">
                          Normal
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex rounded-full px-3 py-1 text-xs font-bold bg-[#EEF8F1] text-[#4B8B60]">
                          Aktif
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => { setSelectedStudent(student); setShowProfileModal(true); }}
                            className="rounded-lg p-2 text-[#718096] transition hover:bg-[#F5F8FC] hover:text-[#4285D4]" 
                            title="Lihat Profil"
                          >
                            <Eye size={18} />
                          </button>
                          <button className="rounded-lg p-2 text-[#718096] transition hover:bg-[#F5F8FC] hover:text-[#172B4D]" title="Opsi Lainnya">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Profile Modal */}
        {showProfileModal && selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172B4D]/40 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl md:p-8">
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#EAF4FF] text-3xl font-bold text-[#4285D4]">
                  {selectedStudent.nama.charAt(0)}
                </div>
                <h2 className="text-xl font-bold text-[#172B4D]">{selectedStudent.nama}</h2>
                <p className="text-sm font-medium text-[#718096]">{selectedStudent.kelas ? `Kelas ${selectedStudent.kelas}` : 'Belum ada kelas'}</p>
                <p className="mt-2 text-xs text-[#718096]">{selectedStudent.bio || '-'}</p>
              </div>
              
              <div className="mb-6 space-y-3 rounded-2xl bg-[#F8FAFC] p-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-[#718096]">Status Akun:</span>
                  <span className="text-sm font-bold text-[#172B4D]">Aktif</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-[#718096]">Mode Adaptif:</span>
                  <span className="text-sm font-bold text-[#172B4D]">Normal</span>
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
