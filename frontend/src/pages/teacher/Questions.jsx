import { useState, useEffect } from 'react';
import { Plus, Sparkles, FileText, Trash2, Edit } from 'lucide-react';
import TeacherLayout from '../../Layouts/TeacherLayout';
import { supabase } from '../../lib/supabaseClient';

export default function TeacherQuestions() {
  const [showManualModal, setShowManualModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // AI Generation State
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
  const [generating, setGenerating] = useState(false);

  // Manual Add State
  const [manualForm, setManualForm] = useState({
    pertanyaan: '',
    topik: '',
    kesulitan: 'Sedang',
    options: ['A', 'B', 'C', 'D'].map(opt => ({ label: opt, text: '' })),
    correct_answer: 'A'
  });

  useEffect(() => {
    fetchQuestions();
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('id, judul, subject_id')
        .order('created_at', { ascending: false });
      if (!error && data) setMaterials(data);
    } catch (err) {
      console.error('Error fetching materials:', err);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bank_soal')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setQuestions(data || []);
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus soal ini?')) return;
    try {
      const { error } = await supabase.from('bank_soal').delete().eq('id', id);
      if (error) throw error;
      setQuestions(questions.filter(q => q.id !== id));
    } catch (err) {
      console.error('Error deleting question:', err);
      alert('Gagal menghapus soal');
    }
  };

  const handleGenerateAI = async () => {
    if (!selectedMaterial) {
      alert('Silakan pilih materi referensi terlebih dahulu');
      return;
    }

    setGenerating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const mat = materials.find(m => m.id === selectedMaterial);
      const topik = mat?.judul || '';

      const response = await fetch('http://localhost:5000/api/ai/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          topik: topik,
          jumlah_soal: parseInt(numQuestions),
          material_id: selectedMaterial
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Gagal generate soal');

      alert(`Berhasil generate ${result.count} soal dari AI!`);
      setShowAiModal(false);
      fetchQuestions(); // Refresh list
    } catch (err) {
      console.error(err);
      alert(err.message || 'Terjadi kesalahan saat generate AI');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveManual = async () => {
    if (!manualForm.pertanyaan.trim()) {
      alert("Pertanyaan tidak boleh kosong");
      return;
    }
    try {
      const formattedOptions = manualForm.options.map(o => o.text);
      
      const newQuestion = {
        pertanyaan: manualForm.pertanyaan,
        topik: manualForm.topik || 'Umum',
        kesulitan: manualForm.kesulitan,
        sumber: 'Manual',
        options: formattedOptions,
        correct_answer: manualForm.options.find(o => o.label === manualForm.correct_answer)?.text || manualForm.options[0].text
      };

      const { error } = await supabase.from('bank_soal').insert([newQuestion]);
      if (error) throw error;
      
      alert("Soal berhasil ditambahkan!");
      setShowManualModal(false);
      setManualForm({
        pertanyaan: '',
        topik: '',
        kesulitan: 'Sedang',
        options: ['A', 'B', 'C', 'D'].map(opt => ({ label: opt, text: '' })),
        correct_answer: 'A'
      });
      fetchQuestions();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan soal");
    }
  };

  return (
    <TeacherLayout>
      <div className="mx-auto w-full">
        
        {/* Header & Actions */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">
              Bank Soal
            </h1>
            <p className="mt-2 text-slate-500 dark:text-[#94A3B8]">
              Kelola kumpulan soal. Anda dapat membuat soal secara manual atau otomatis dikonversi oleh AI dari file materi.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowManualModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white dark:bg-[#0F172A]/60 px-5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white transition hover:bg-white dark:bg-white dark:bg-[#0F172A]/60"
            >
              <Plus size={18} />
              Buat Manual
            </button>
            <button 
              onClick={() => setShowAiModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white shadow-sm transition hover:bg-[#7C3AED]"
            >
              <Sparkles size={18} />
              Generate AI
            </button>
          </div>
        </div>

        {/* Filters Area (Optional placeholder for future) */}
        <div className="mb-6 flex gap-4">
          <select className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white dark:bg-[#0F172A]/60 px-4 py-2.5 text-sm text-slate-500 dark:text-[#94A3B8] focus:border-[#4285D4] focus:outline-none">
            <option>Semua Mata Pelajaran</option>
            <option>Matematika</option>
          </select>
          <select className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white dark:bg-[#0F172A]/60 px-4 py-2.5 text-sm text-slate-500 dark:text-[#94A3B8] focus:border-[#4285D4] focus:outline-none">
            <option>Semua Tingkat Kesulitan</option>
            <option>Mudah</option>
            <option>Sedang</option>
            <option>Sulit</option>
          </select>
        </div>

        {/* Questions List */}
        <div className="overflow-hidden rounded-3xl bg-white dark:bg-white dark:bg-[#0F172A]/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white dark:bg-white dark:bg-[#0F172A]/60 text-xs font-semibold uppercase text-slate-500 dark:text-[#94A3B8]">
                <tr>
                  <th className="px-6 py-4">Pertanyaan</th>
                  <th className="px-6 py-4">CP / Topik</th>
                  <th className="px-6 py-4">Kesulitan</th>
                  <th className="px-6 py-4">Sumber</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F3F8]">
                  {questions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-slate-400 dark:text-[#64748B]">
                        {loading ? 'Memuat bank soal...' : 'Belum ada soal.'}
                      </td>
                    </tr>
                  ) : (
                    questions.map((q) => (
                    <tr key={q.id} className="transition hover:bg-slate-50 dark:bg-white/5/50">
                      <td className="px-6 py-4">
                        <p className="line-clamp-2 font-medium text-slate-900 dark:text-white">
                          {q.pertanyaan || q.question}
                        </p>
                        <p className="mt-1 text-xs text-slate-400 dark:text-[#64748B]">Dibuat pada {new Date(q.created_at).toLocaleDateString('id-ID')}</p>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#A78BFA] whitespace-nowrap">
                        {q.topik || '-'}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-500 dark:text-[#94A3B8]">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          q.kesulitan === 'Sulit' ? 'bg-[#FFF5F5] text-[#E53E3E]' :
                          q.kesulitan === 'Sedang' ? 'bg-[#FEF8F2] text-[#DD6B20]' :
                          'bg-[#EEF8F1] text-[#4B8B60]'
                        }`}>
                          {q.kesulitan || 'Sedang'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-[#94A3B8]">
                        {q.sumber === 'Manual' ? 'Manual' : (
                          <span className="flex items-center gap-1.5 text-[#8B5CF6]">
                            <Sparkles size={14} /> AI Generated
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="rounded-lg p-2 text-slate-500 dark:text-[#94A3B8] transition hover:bg-slate-50 dark:bg-white/5 hover:text-[#4285D4]">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(q.id)} className="rounded-lg p-2 text-slate-500 dark:text-[#94A3B8] transition hover:bg-[#FFF5F5] hover:text-[#E53E3E]">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals Simulation */}
        {showManualModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172B4D]/40 p-4">
            <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-white dark:bg-[#0F172A]/60 p-6 shadow-2xl md:p-8">
              <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">Buat Soal Manual</h2>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-slate-500 dark:text-[#94A3B8]">Pertanyaan</label>
                <textarea 
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 p-3 text-sm focus:border-blue-500 focus:outline-none dark:bg-transparent dark:text-white" 
                  rows="3" 
                  placeholder="Ketik pertanyaan di sini..."
                  value={manualForm.pertanyaan}
                  onChange={(e) => setManualForm({...manualForm, pertanyaan: e.target.value})}
                />
              </div>
              
              <div className="mb-4 flex gap-4">
                <div className="flex-1">
                  <label className="mb-2 block text-sm font-medium text-slate-500 dark:text-[#94A3B8]">Topik / CP</label>
                  <input 
                    type="text" 
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 p-2.5 text-sm focus:border-blue-500 focus:outline-none dark:bg-transparent dark:text-white" 
                    placeholder="Contoh: Aljabar"
                    value={manualForm.topik}
                    onChange={(e) => setManualForm({...manualForm, topik: e.target.value})}
                  />
                </div>
                <div className="w-1/3">
                  <label className="mb-2 block text-sm font-medium text-slate-500 dark:text-[#94A3B8]">Kesulitan</label>
                  <select 
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 p-2.5 text-sm focus:border-blue-500 focus:outline-none dark:bg-[#0F172A] dark:text-white"
                    value={manualForm.kesulitan}
                    onChange={(e) => setManualForm({...manualForm, kesulitan: e.target.value})}
                  >
                    <option value="Mudah">Mudah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Sulit">Sulit</option>
                  </select>
                </div>
              </div>

              <div className="mb-6 space-y-3">
                <label className="block text-sm font-medium text-slate-500 dark:text-[#94A3B8]">Pilihan Jawaban (A, B, C, D)</label>
                {manualForm.options.map((opt, i) => (
                  <div key={opt.label} className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="correct" 
                      className="h-4 w-4 text-blue-500" 
                      checked={manualForm.correct_answer === opt.label}
                      onChange={() => setManualForm({...manualForm, correct_answer: opt.label})}
                    />
                    <input 
                      type="text" 
                      placeholder={`Opsi ${opt.label}`} 
                      className="flex-1 rounded-lg border border-slate-200 dark:border-white/10 p-2.5 text-sm focus:border-blue-500 focus:outline-none dark:bg-transparent dark:text-white" 
                      value={opt.text}
                      onChange={(e) => {
                        const newOpts = [...manualForm.options];
                        newOpts[i].text = e.target.value;
                        setManualForm({...manualForm, options: newOpts});
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowManualModal(false)} className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:text-[#94A3B8] dark:hover:bg-white/5">Batal</button>
                <button onClick={handleSaveManual} className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-600">Simpan Soal</button>
              </div>
            </div>
          </div>
        )}

        {showAiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172B4D]/40 p-4">
            <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-white dark:bg-[#0F172A]/60 p-6 shadow-2xl md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3E8FF] text-[#8B5CF6]">
                  <Sparkles size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Konversi File dengan AI</h2>
              </div>
              
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-slate-500 dark:text-[#94A3B8]">Pilih File Materi Sumber</label>
                <select 
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 p-3 text-sm focus:border-[#8B5CF6] focus:outline-none bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white"
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                >
                  <option value="" className="text-black">Pilih file yang sudah diupload...</option>
                  {materials.length === 0 ? (
                    <option value="" disabled className="text-black">Belum ada materi. Upload materi dulu di halaman Kelola Materi.</option>
                  ) : materials.map(m => (
                    <option key={m.id} value={m.id} className="text-black">
                      {m.judul}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-8">
                <label className="mb-2 block text-sm font-medium text-slate-500 dark:text-[#94A3B8]">Jumlah Soal yang Dihasilkan</label>
                <input 
                  type="number" 
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                  min="1" max="20"
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 p-3 text-sm focus:border-[#8B5CF6] focus:outline-none bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white" 
                />
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setShowAiModal(false)} disabled={generating} className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-500 dark:text-[#94A3B8] hover:bg-slate-50 dark:bg-white/5 disabled:opacity-50">Batal</button>
                <button onClick={handleGenerateAI} disabled={generating} className="inline-flex items-center gap-2 rounded-xl bg-[#8B5CF6] px-5 py-2.5 text-sm font-bold text-slate-900 dark:text-white hover:bg-[#7C3AED] disabled:opacity-50">
                  {generating ? (
                    <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div> Memproses...</>
                  ) : (
                    <><Sparkles size={16} /> Generate Soal</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </TeacherLayout>
  );
}
