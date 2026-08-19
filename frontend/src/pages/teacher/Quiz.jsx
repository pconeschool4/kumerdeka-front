import { useState, useEffect } from 'react';
import { Plus, Users, Clock, Settings, Search, CheckSquare, BookOpen, AlertCircle } from 'lucide-react';
import TeacherLayout from '../../Layouts/TeacherLayout';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

export default function TeacherQuiz() {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [bankSoal, setBankSoal] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [guruProfileId, setGuruProfileId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [newQuiz, setNewQuiz] = useState({
    subject_id: '',
    deskripsi: '',
    durasi: 30,
    kesulitan: 'Sedang'
  });
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      
      // Fetch Quizzes
      const { data: qData, error: qError } = await supabase
        .from('kuis')
        .select(`
          id, deskripsi, durasi, kesulitan, subject_id,
          subjects (nama)
        `)
        .eq('pembuat', user.id)
        .order('id', { ascending: false });
        
      if (!qError && qData) setQuizzes(qData);

      // Fetch Bank Soal
      const { data: bData, error: bError } = await supabase
        .from('bank_soal')
        .select(`id, pertanyaan, kesulitan, subject_id, subjects(nama)`)
        .eq('pembuat', user.id);
        
      if (!bError && bData) setBankSoal(bData);

      // Fetch Subjects
      const { data: sData, error: sError } = await supabase
        .from('subjects')
        .select('id, nama')
        .eq('pembuat', user.id);
        
      if (!sError && sData) setSubjects(sData);

      // Fetch guru profile ID to fix fk_kuis_guru
      if (user.email) {
        const { data: guruData } = await supabase
          .from('data_guru')
          .select('id')
          .eq('email', user.email)
          .single();
        if (guruData) {
          setGuruProfileId(guruData.id);
        } else {
          // Fallback to the first available guru profile if this user doesn't have one
          const { data: anyGuru } = await supabase.from('data_guru').select('id').limit(1).single();
          if (anyGuru) setGuruProfileId(anyGuru.id);
        }
      } else {
        const { data: anyGuru } = await supabase.from('data_guru').select('id').limit(1).single();
        if (anyGuru) setGuruProfileId(anyGuru.id);
      }

    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async () => {
    if (!newQuiz.subject_id) return alert("Pilih Mata Pelajaran");
    if (!newQuiz.deskripsi) return alert("Isi Judul/Deskripsi Kuis");
    if (selectedQuestions.length === 0) return alert("Pilih minimal 1 soal");
    
    setIsSubmitting(true);
    try {
      // 1. Insert kuis
      const { data: insertedKuis, error: kuisError } = await supabase
        .from('kuis')
        .insert({
          guru_id: guruProfileId || user.id,
          pembuat: user.id, // Some schema versions use pembuat, some guru_id. Provide both just in case.
          subject_id: newQuiz.subject_id,
          deskripsi: newQuiz.deskripsi,
          durasi: parseInt(newQuiz.durasi),
          kesulitan: newQuiz.kesulitan
        })
        .select()
        .single();
        
      if (kuisError) throw kuisError;

      // 2. Insert kuis_soal
      const soalToInsert = selectedQuestions.map((soal_id, idx) => ({
        kuis_id: insertedKuis.id,
        soal_id: soal_id,
        urutan: idx + 1
      }));

      const { error: soalError } = await supabase
        .from('kuis_soal')
        .insert(soalToInsert);

      if (soalError) throw soalError;

      alert("Kuis berhasil diterbitkan!");
      setShowCreateModal(false);
      setSelectedQuestions([]);
      setNewQuiz({ subject_id: '', deskripsi: '', durasi: 30, kesulitan: 'Sedang' });
      fetchData(); // refresh

    } catch (err) {
      console.error(err);
      alert("Gagal membuat kuis: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleQuestion = (id) => {
    setSelectedQuestions(prev => 
      prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]
    );
  };


  return (
    <TeacherLayout>
      <div className="mx-auto w-full">
        
        {/* Header & Actions */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">
              Manajemen Kuis
            </h1>
            <p className="mt-2 text-slate-500 dark:text-[#94A3B8]">
              Rakit kuis baru dari bank soal dan pantau aktivitas kuis yang sedang berjalan.
            </p>
          </div>
          <div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#4285D4] px-5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white shadow-sm transition hover:bg-[#3171BC]"
            >
              <Plus size={18} />
              Buat Kuis Baru
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-4 rounded-3xl bg-white dark:bg-white dark:bg-[#0F172A]/60 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF8F1] text-[#4B8B60]">
              <CheckSquare size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-[#94A3B8]">Kuis Dibuat</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{quizzes.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-3xl bg-white dark:bg-white dark:bg-[#0F172A]/60 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/10 text-[#4285D4]">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-[#94A3B8]">Siswa Berpartisipasi</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">0</p>
            </div>
          </div>
        </div>

        {/* Quizzes List */}
        <div>
          <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">Daftar Kuis</h3>
          <div className="overflow-hidden rounded-3xl bg-white dark:bg-white dark:bg-[#0F172A]/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white dark:bg-white dark:bg-[#0F172A]/60 text-xs font-semibold uppercase text-slate-500 dark:text-[#94A3B8]">
                  <tr>
                    <th className="px-6 py-4">Nama Kuis</th>
                    <th className="px-6 py-4">Mata Pelajaran</th>
                    <th className="px-6 py-4">Durasi</th>
                    <th className="px-6 py-4">Peserta</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F3F8]/10">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-slate-400 dark:text-[#64748B]">
                        Memuat data...
                      </td>
                    </tr>
                  ) : quizzes.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-slate-400 dark:text-[#64748B]">
                        Belum ada kuis yang dibuat.
                      </td>
                    </tr>
                  ) : (
                    quizzes.map((quiz) => (
                    <tr key={quiz.id} className="transition hover:bg-slate-50 dark:bg-white/5/50">
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {quiz.deskripsi || 'Tanpa Judul'}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-500 dark:text-[#94A3B8] whitespace-nowrap">
                        {quiz.subjects?.nama || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-500 dark:text-[#94A3B8] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock size={16} className="text-slate-400 dark:text-[#64748B]" />
                          {quiz.durasi} Menit
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-500 dark:text-[#94A3B8] whitespace-nowrap">
                        -
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex rounded-full px-3 py-1 text-xs font-bold bg-[#EEF8F1] text-[#4B8B60]">
                          Aktif
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="rounded-lg p-2 text-slate-500 dark:text-[#94A3B8] transition hover:bg-slate-50 dark:bg-white/5 hover:text-[#4285D4]">
                          <Settings size={18} />
                        </button>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Create Quiz Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#172B4D]/60 p-4 backdrop-blur-sm">
            <div className="my-8 w-full max-w-2xl rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 p-6 shadow-2xl md:p-8">
              <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">Buat Kuis Baru</h2>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-500 dark:text-[#94A3B8]">Mata Pelajaran</label>
                  <select 
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-[#1E293B] p-3 text-sm text-slate-900 dark:text-white focus:border-[#4285D4] focus:outline-none"
                    value={newQuiz.subject_id}
                    onChange={(e) => setNewQuiz({...newQuiz, subject_id: e.target.value})}
                  >
                    <option value="">Pilih Mata Pelajaran</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.nama}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-500 dark:text-[#94A3B8]">Judul/Topik Kuis</label>
                  <input 
                    type="text" 
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-[#1E293B] p-3 text-sm text-slate-900 dark:text-white focus:border-[#4285D4] focus:outline-none" 
                    placeholder="Contoh: Kuis Harian Aljabar" 
                    value={newQuiz.deskripsi}
                    onChange={(e) => setNewQuiz({...newQuiz, deskripsi: e.target.value})}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-500 dark:text-[#94A3B8]">Tingkat Kesulitan</label>
                  <select 
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-[#1E293B] p-3 text-sm text-slate-900 dark:text-white focus:border-[#4285D4] focus:outline-none"
                    value={newQuiz.kesulitan}
                    onChange={(e) => setNewQuiz({...newQuiz, kesulitan: e.target.value})}
                  >
                    <option value="Mudah">Mudah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Sulit">Sulit</option>
                    <option value="Campuran">Campuran</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-500 dark:text-[#94A3B8]">Durasi (Menit)</label>
                  <input 
                    type="number" 
                    min="1"
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-[#1E293B] p-3 text-sm text-slate-900 dark:text-white focus:border-[#4285D4] focus:outline-none" 
                    value={newQuiz.durasi}
                    onChange={(e) => setNewQuiz({...newQuiz, durasi: e.target.value})}
                  />
                </div>
              </div>

              <div className="my-6">
                <div className="mb-3 flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-500 dark:text-[#94A3B8]">Pilih Soal dari Bank Soal</label>
                  <span className="text-xs font-bold text-[#4285D4] bg-[#4285D4]/10 px-2 py-1 rounded-full">
                    {selectedQuestions.length} Terpilih
                  </span>
                </div>
                
                {/* Search Bar */}
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-[#1E293B] px-3 py-2">
                  <Search size={18} className="text-slate-400 dark:text-[#64748B]" />
                  <input type="text" placeholder="Cari berdasarkan topik atau kata kunci..." className="w-full bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none" />
                </div>

                {/* Question Selection List */}
                <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 dark:border-white/10 divide-y divide-[#F0F3F8]/10 bg-[#1E293B]/50">
                  {bankSoal.length === 0 ? (
                    <div className="p-6 text-center text-sm text-slate-500 dark:text-[#94A3B8]">
                      <BookOpen className="mx-auto mb-2 text-slate-900 dark:text-white/20" size={24} />
                      Bank soal masih kosong. Silakan generate soal dari materi terlebih dahulu.
                    </div>
                  ) : bankSoal.map((soal) => {
                    const isSelected = selectedQuestions.includes(soal.id);
                    // Filter based on selected subject if any
                    if (newQuiz.subject_id && soal.subject_id !== newQuiz.subject_id) return null;
                    
                    return (
                      <label key={soal.id} className={`flex cursor-pointer items-start gap-3 p-4 transition hover:bg-slate-50 dark:bg-white/5 ${isSelected ? 'bg-slate-50 dark:bg-white/5' : ''}`}>
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => toggleQuestion(soal.id)}
                          className="mt-1 h-4 w-4 rounded border-slate-200 dark:border-white/10 text-[#4285D4] focus:ring-[#4285D4] bg-white dark:bg-[#0F172A]" 
                        />
                        <div>
                          <p className={`text-sm font-bold ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white/80'}`}>
                            {soal.pertanyaan}
                          </p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-[#94A3B8]">
                            Level: <span className="text-[#D69E2E]">{soal.kesulitan}</span> | Mapel: {soal.subjects?.nama || 'Unknown'}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-white/10 pt-6">
                <button 
                  onClick={() => setShowCreateModal(false)} 
                  className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-500 dark:text-[#94A3B8] hover:bg-slate-50 dark:bg-white/5 transition"
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button 
                  onClick={handleCreateQuiz} 
                  disabled={isSubmitting || selectedQuestions.length === 0 || !newQuiz.subject_id}
                  className="rounded-xl bg-[#4285D4] px-5 py-2.5 text-sm font-bold text-slate-900 dark:text-white hover:bg-[#3171BC] transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? 'Menerbitkan...' : 'Terbitkan Kuis'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </TeacherLayout>
  );
}
