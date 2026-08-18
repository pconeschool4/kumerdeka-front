import { useState, useEffect } from 'react';
import { Plus, ChevronDown, ChevronRight, BookOpen, Target, Settings2, Loader2 } from 'lucide-react';
import TeacherLayout from '../../Layouts/TeacherLayout';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

export default function TeacherSubjects() {
  const { user } = useAuth();
  const [curriculum, setCurriculum] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [expandedCPs, setExpandedCPs] = useState({});

  // Modals state
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showCPModal, setShowCPModal] = useState(false);
  const [showTPModal, setShowTPModal] = useState(false);

  // Form Data
  const [newSubject, setNewSubject] = useState('');
  const [newCP, setNewCP] = useState({ subject_id: null, kode: '', judul: '' });
  const [newTP, setNewTP] = useState({ cp_id: null, kode: '', judul: '' });

  useEffect(() => {
    fetchCurriculum();
  }, []);

  const fetchCurriculum = async () => {
    try {
      setLoading(true);
      // Fetch subjects, related CPs, and related TPs
      const { data, error } = await supabase
        .from('subjects')
        .select(`
          id,
          nama,
          deskripsi,
          cp (
            id,
            kode,
            judul,
            tp (
              id,
              kode,
              judul
            )
          )
        `)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setCurriculum(data || []);

      // Auto expand first subject and CP if they exist
      if (data && data.length > 0) {
        setExpandedSubjects({ [data[0].id]: true });
        if (data[0].cp && data[0].cp.length > 0) {
          setExpandedCPs({ [data[0].cp[0].id]: true });
        }
      }
    } catch (error) {
      console.error("Error fetching curriculum:", error.message);
      alert("Gagal memuat kurikulum: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubject.trim()) return;
    try {
      setSaving(true);
      const { error } = await supabase.from('subjects').insert([
        { nama: newSubject, pembuat: user?.id }
      ]);
      if (error) throw error;
      
      setNewSubject('');
      setShowSubjectModal(false);
      fetchCurriculum();
    } catch (error) {
      console.error("Error adding subject:", error.message);
      alert("Gagal menambahkan mata pelajaran.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddCP = async () => {
    if (!newCP.kode.trim() || !newCP.judul.trim() || !newCP.subject_id) return;
    try {
      setSaving(true);
      const { error } = await supabase.from('cp').insert([
        { 
          subject_id: newCP.subject_id, 
          kode: newCP.kode, 
          judul: newCP.judul 
        }
      ]);
      if (error) throw error;
      
      setNewCP({ subject_id: null, kode: '', judul: '' });
      setShowCPModal(false);
      // Auto expand the subject where CP was added
      setExpandedSubjects(prev => ({ ...prev, [newCP.subject_id]: true }));
      fetchCurriculum();
    } catch (error) {
      console.error("Error adding CP:", error.message);
      alert("Gagal menambahkan Capaian Pembelajaran.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddTP = async () => {
    if (!newTP.kode.trim() || !newTP.judul.trim() || !newTP.cp_id) return;
    try {
      setSaving(true);
      const { error } = await supabase.from('tp').insert([
        { 
          cp_id: newTP.cp_id, 
          kode: newTP.kode, 
          judul: newTP.judul 
        }
      ]);
      if (error) throw error;
      
      setNewTP({ cp_id: null, kode: '', judul: '' });
      setShowTPModal(false);
      // Auto expand the CP where TP was added
      setExpandedCPs(prev => ({ ...prev, [newTP.cp_id]: true }));
      fetchCurriculum();
    } catch (error) {
      console.error("Error adding TP:", error.message);
      alert("Gagal menambahkan Tujuan Pembelajaran.");
    } finally {
      setSaving(false);
    }
  };

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

        {/* Loading State */}
        {loading && (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#4285D4]" />
          </div>
        )}

        {/* Empty State */}
        {!loading && curriculum.length === 0 && (
          <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC]">
            <BookOpen size={48} className="mb-4 text-[#A0AEC0]" />
            <h3 className="mb-2 text-lg font-bold text-[#172B4D]">Belum ada Mata Pelajaran</h3>
            <p className="mb-4 text-sm text-[#718096]">Mulai dengan menambahkan mata pelajaran pertama Anda.</p>
            <button 
              onClick={() => setShowSubjectModal(true)}
              className="rounded-xl bg-[#4285D4] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#3171BC]"
            >
              Tambah Mata Pelajaran
            </button>
          </div>
        )}

        {/* Curriculum Tree */}
        {!loading && curriculum.length > 0 && (
          <div className="space-y-4">
            {curriculum.map((sub) => (
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
                      <h2 className="text-lg font-bold text-[#172B4D]">{sub.nama}</h2>
                      <p className="text-sm font-medium text-[#718096]">{(sub.cp || []).length} Capaian Pembelajaran</p>
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
                {expandedSubjects[sub.id] && (sub.cp || []).length > 0 && (
                  <div className="bg-[#F8FAFC] p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#718096]">Daftar Capaian Pembelajaran (CP)</h3>
                      <button onClick={() => { setNewCP({...newCP, subject_id: sub.id}); setShowCPModal(true); }} className="text-sm font-semibold text-[#4285D4] hover:underline">
                        + Tambah CP
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {(sub.cp || []).map((itemCp) => (
                        <div key={itemCp.id} className="rounded-2xl border border-[#E2E8F0] bg-white">
                          {/* CP Header */}
                          <div 
                            className="flex cursor-pointer items-center justify-between p-4 transition hover:bg-[#F5F8FC]"
                            onClick={() => toggleCP(itemCp.id)}
                          >
                            <div className="flex items-center gap-3">
                              {expandedCPs[itemCp.id] ? <ChevronDown size={18} className="text-[#718096]" /> : <ChevronRight size={18} className="text-[#718096]" />}
                              <span className="rounded bg-[#F0F3F8] px-2 py-1 text-xs font-bold text-[#718096]">{itemCp.kode}</span>
                              <p className="font-bold text-[#172B4D]">{itemCp.judul}</p>
                            </div>
                            <button className="text-[#A0AEC0] hover:text-[#4285D4]">
                              <Settings2 size={16} />
                            </button>
                          </div>

                          {/* TPs inside CP */}
                          {expandedCPs[itemCp.id] && (
                            <div className="border-t border-[#F0F3F8] bg-[#FAFCFF] p-4 pl-12">
                              <div className="mb-3 flex items-center justify-between">
                                <p className="text-xs font-semibold text-[#718096]">Tujuan Pembelajaran (TP)</p>
                                <button onClick={() => { setNewTP({...newTP, cp_id: itemCp.id}); setShowTPModal(true); }} className="text-xs font-semibold text-[#4285D4] hover:underline">
                                  + Tambah TP
                                </button>
                              </div>
                              <ul className="space-y-2">
                                {(itemCp.tp || []).map((itemTp) => (
                                  <li key={itemTp.id} className="flex items-start gap-3 rounded-xl border border-[#F0F3F8] bg-white p-3">
                                    <Target size={16} className="mt-0.5 text-[#A0AEC0]" />
                                    <div className="flex-1">
                                      <span className="mr-2 rounded bg-[#EEF8F1] px-1.5 py-0.5 text-[10px] font-bold text-[#4B8B60]">{itemTp.kode}</span>
                                      <span className="text-sm text-[#172B4D]">{itemTp.judul}</span>
                                    </div>
                                  </li>
                                ))}
                                {(itemCp.tp || []).length === 0 && (
                                  <li className="text-xs text-[#718096]">Belum ada TP untuk CP ini.</li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Empty state for CPs */}
                {expandedSubjects[sub.id] && (sub.cp || []).length === 0 && (
                  <div className="bg-[#F8FAFC] p-8 text-center">
                    <p className="text-sm text-[#718096]">Belum ada Capaian Pembelajaran untuk mata pelajaran ini.</p>
                    <button onClick={() => { setNewCP({...newCP, subject_id: sub.id}); setShowCPModal(true); }} className="mt-3 text-sm font-semibold text-[#4285D4] hover:underline">
                      + Tambah CP Pertama
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modals */}
        {showSubjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172B4D]/40 p-4">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl md:p-8">
              <h2 className="mb-6 text-xl font-bold text-[#172B4D]">Tambah Mata Pelajaran Baru</h2>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-[#718096]">Nama Mata Pelajaran</label>
                <input 
                  type="text" 
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm focus:border-[#4285D4] focus:outline-none" 
                  placeholder="Contoh: Fisika" 
                />
              </div>
              <div className="flex justify-end gap-3">
                <button disabled={saving} onClick={() => setShowSubjectModal(false)} className="rounded-xl px-5 py-2.5 text-sm font-bold text-[#718096] hover:bg-gray-100 disabled:opacity-50">Batal</button>
                <button disabled={saving || !newSubject.trim()} onClick={handleAddSubject} className="rounded-xl bg-[#4285D4] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#3171BC] disabled:opacity-50">
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
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
                <input 
                  type="text" 
                  value={newCP.kode}
                  onChange={(e) => setNewCP({...newCP, kode: e.target.value})}
                  className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm focus:border-[#4285D4] focus:outline-none" 
                  placeholder="Contoh: CP 3.4" 
                />
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-[#718096]">Judul/Deskripsi Singkat</label>
                <textarea 
                  value={newCP.judul}
                  onChange={(e) => setNewCP({...newCP, judul: e.target.value})}
                  className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm focus:border-[#4285D4] focus:outline-none" 
                  rows="2" 
                  placeholder="Contoh: Trigonometri Dasar..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button disabled={saving} onClick={() => setShowCPModal(false)} className="rounded-xl px-5 py-2.5 text-sm font-bold text-[#718096] hover:bg-gray-100 disabled:opacity-50">Batal</button>
                <button disabled={saving || !newCP.kode.trim() || !newCP.judul.trim()} onClick={handleAddCP} className="rounded-xl bg-[#4285D4] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#3171BC] disabled:opacity-50">
                  {saving ? 'Menyimpan...' : 'Simpan CP'}
                </button>
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
                <input 
                  type="text" 
                  value={newTP.kode}
                  onChange={(e) => setNewTP({...newTP, kode: e.target.value})}
                  className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm focus:border-[#4285D4] focus:outline-none" 
                  placeholder="Contoh: TP 3.4.1" 
                />
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-[#718096]">Tujuan Spesifik</label>
                <textarea 
                  value={newTP.judul}
                  onChange={(e) => setNewTP({...newTP, judul: e.target.value})}
                  className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm focus:border-[#4285D4] focus:outline-none" 
                  rows="2" 
                  placeholder="Siswa dapat menghitung..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button disabled={saving} onClick={() => setShowTPModal(false)} className="rounded-xl px-5 py-2.5 text-sm font-bold text-[#718096] hover:bg-gray-100 disabled:opacity-50">Batal</button>
                <button disabled={saving || !newTP.kode.trim() || !newTP.judul.trim()} onClick={handleAddTP} className="rounded-xl bg-[#4285D4] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#3171BC] disabled:opacity-50">
                  {saving ? 'Menyimpan...' : 'Simpan TP'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </TeacherLayout>
  );
}
