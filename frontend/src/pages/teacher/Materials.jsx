import { useState, useEffect } from 'react';
import { UploadCloud, FileText, Trash2 } from 'lucide-react';
import TeacherLayout from '../../Layouts/TeacherLayout';
import { supabase } from '../../lib/supabaseClient';

export default function TeacherMaterials() {
  const [isDragging, setIsDragging] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  
  // Relational data states
  const [curriculum, setCurriculum] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedCP, setSelectedCP] = useState('');
  const [selectedTP, setSelectedTP] = useState('');

  useEffect(() => {
    fetchMaterials();
    fetchCurriculum();
  }, []);

  const fetchCurriculum = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select(`
          id,
          nama,
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
      if (!error && data) setCurriculum(data);
    } catch (err) {
      console.error('Error fetching curriculum:', err);
    }
  };

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMaterials(data || []);
    } catch (err) {
      console.error('Error fetching materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus materi ini?')) return;
    try {
      const { error } = await supabase.from('materials').delete().eq('id', id);
      if (error) throw error;
      setMaterials(materials.filter(m => m.id !== id));
    } catch (err) {
      console.error('Error deleting material:', err);
      alert('Gagal menghapus materi');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const f = e.target.files[0];
      const MAX_MB = 50;
      if (f.size > MAX_MB * 1024 * 1024) {
        alert(`File terlalu besar! Maksimal ${MAX_MB}MB. File Anda: ${(f.size/1024/1024).toFixed(1)}MB`);
        document.getElementById('fileUpload').value = '';
        return;
      }
      setSelectedFile(f);
    }
  };

  const handleUploadConfirm = async () => {
    if (!selectedFile) return;
    
    // Validasi: harus pilih kurikulum dulu
    if (!selectedSubject || !selectedCP || !selectedTP) {
      alert('Lengkapi pilihan Mata Pelajaran, CP, dan TP terlebih dahulu sebelum upload!');
      return;
    }
    
    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (uploadTitle) formData.append('judul', uploadTitle);
      if (selectedSubject) formData.append('subject_id', selectedSubject);
      if (selectedCP) formData.append('cp_id', selectedCP);
      if (selectedTP) formData.append('tp_id', selectedTP);

      const response = await fetch('http://localhost:5000/api/ai/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: formData
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Gagal mengunggah materi');
      }

      alert('Berhasil mengunggah materi!');
      setSelectedFile(null);
      setUploadTitle('');
      setSelectedSubject('');
      setSelectedCP('');
      setSelectedTP('');
      fetchMaterials(); // Refresh list
    } catch (err) {
      console.error(err);
      alert(err.message || 'Terjadi kesalahan saat mengunggah');
    } finally {
      setUploading(false);
      // Reset input file agar bisa pilih file yg sama lagi jika gagal
      document.getElementById('fileUpload').value = '';
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setUploadTitle('');
    setSelectedSubject('');
    setSelectedCP('');
    setSelectedTP('');
    document.getElementById('fileUpload').value = '';
  };

  return (
    <TeacherLayout>
      <div className="mx-auto w-full">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">
            Kelola Materi & Dokumen
          </h1>
          <p className="mt-2 text-slate-500 dark:text-[#94A3B8]">
            Unggah file PDF, DOCX, CSV, atau Excel untuk dijadikan referensi belajar dan sumber pembuatan soal oleh AI.
          </p>
        </div>

        {/* Warning: Curriculum kosong */}
        {curriculum.length === 0 && !loading && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4">
            <span className="text-yellow-400 text-xl">⚠️</span>
            <div>
              <p className="font-semibold text-yellow-300">Kurikulum belum diisi!</p>
              <p className="mt-1 text-sm text-yellow-200/70">
                Anda perlu menambahkan Mata Pelajaran, CP, dan TP terlebih dahulu di halaman{' '}
                <a href="/teacher/subjects" className="underline font-bold hover:text-yellow-100">Kelola Kurikulum</a>{' '}
                sebelum bisa mengupload materi.
              </p>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div className="mb-10">
          {!selectedFile ? (
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 transition-colors ${
                isDragging 
                  ? 'border-[#4285D4] bg-slate-50 dark:bg-white/5' 
                  : 'border-[#CBD5E1] bg-white dark:bg-white dark:bg-[#0F172A]/60 hover:border-[#4285D4] hover:bg-white dark:bg-white dark:bg-[#0F172A]/60'
              }`}
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 text-[#4285D4]">
                <UploadCloud size={32} />
              </div>
              <h3 className="mb-1 text-lg font-bold text-slate-900 dark:text-white">
                Tarik dan lepas file di sini
              </h3>
              <p className="mb-6 text-sm text-slate-500 dark:text-[#94A3B8]">
                Atau klik untuk memilih dari perangkat Anda. (Max. 10MB)
              </p>
              <input 
                type="file" 
                id="fileUpload" 
                className="hidden" 
                onChange={handleFileChange} 
              />
              <label 
                htmlFor="fileUpload" 
                className="cursor-pointer rounded-xl bg-[#4285D4] px-6 py-3 text-sm font-semibold text-slate-900 dark:text-white shadow-sm transition hover:bg-[#3171BC]"
              >
                Pilih File
              </label>
            </div>
          ) : (
            <div className="rounded-3xl bg-slate-50 dark:bg-white/5 p-8 border border-slate-200 dark:border-white/10 backdrop-blur-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4285D4]/20 text-[#4285D4]">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedFile.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-[#94A3B8]">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                {!uploading && (
                  <button 
                    onClick={handleCancelUpload}
                    className="text-slate-500 dark:text-[#94A3B8] hover:text-[#EF4444]"
                  >
                    Batal
                  </button>
                )}
              </div>
              
              <div className="mt-6 flex flex-col gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900 dark:text-white">Judul Materi / Keterangan</label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="Contoh: Modul Ajar Matematika"
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-slate-900 dark:text-white placeholder-white/30 focus:border-[#4285D4] focus:outline-none focus:ring-1 focus:ring-[#4285D4]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900 dark:text-white">Mata Pelajaran</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => {
                      setSelectedSubject(e.target.value);
                      setSelectedCP('');
                      setSelectedTP('');
                    }}
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-slate-900 dark:text-white focus:border-[#4285D4] focus:outline-none focus:ring-1 focus:ring-[#4285D4]"
                  >
                    <option value="" className="text-black">Pilih Mata Pelajaran...</option>
                    {curriculum.map(sub => (
                      <option key={sub.id} value={sub.id} className="text-black">{sub.nama}</option>
                    ))}
                  </select>
                </div>

                {selectedSubject && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900 dark:text-white">Capaian Pembelajaran (CP)</label>
                    <select
                      value={selectedCP}
                      onChange={(e) => {
                        setSelectedCP(e.target.value);
                        setSelectedTP('');
                      }}
                      className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-slate-900 dark:text-white focus:border-[#4285D4] focus:outline-none focus:ring-1 focus:ring-[#4285D4]"
                    >
                      <option value="" className="text-black">Pilih Capaian Pembelajaran...</option>
                      {curriculum.find(s => s.id === selectedSubject)?.cp?.map(c => (
                        <option key={c.id} value={c.id} className="text-black">{c.kode} - {c.judul}</option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedCP && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900 dark:text-white">Tujuan Pembelajaran (TP)</label>
                    <select
                      value={selectedTP}
                      onChange={(e) => setSelectedTP(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-slate-900 dark:text-white focus:border-[#4285D4] focus:outline-none focus:ring-1 focus:ring-[#4285D4]"
                    >
                      <option value="" className="text-black">Pilih Tujuan Pembelajaran...</option>
                      {curriculum.find(s => s.id === selectedSubject)?.cp?.find(c => c.id === selectedCP)?.tp?.map(t => (
                        <option key={t.id} value={t.id} className="text-black">{t.kode} - {t.judul}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleUploadConfirm}
                  disabled={uploading}
                  className={`flex items-center gap-2 rounded-xl bg-[#4285D4] px-6 py-3 text-sm font-bold text-slate-900 dark:text-white transition-all hover:bg-[#3367D6] ${
                    uploading ? 'cursor-not-allowed opacity-70' : ''
                  }`}
                >
                  {uploading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Memproses AI...
                    </>
                  ) : (
                    'Mulai Proses AI'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Material List */}
        <div>
          <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">Daftar File Tersimpan</h3>
          <div className="overflow-hidden rounded-3xl bg-white dark:bg-white dark:bg-[#0F172A]/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white dark:bg-white dark:bg-[#0F172A]/60 text-xs font-semibold uppercase text-slate-500 dark:text-[#94A3B8]">
                  <tr>
                    <th className="px-6 py-4">Judul Materi</th>
                    <th className="px-6 py-4">Mata Pelajaran</th>
                    <th className="px-6 py-4">Tanggal Upload</th>
                    <th className="px-6 py-4">Status AI</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F3F8]">
                  {materials.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-slate-400 dark:text-[#64748B]">
                        {loading ? 'Memuat data materi...' : 'Belum ada materi yang diunggah.'}
                      </td>
                    </tr>
                  ) : (
                    materials.map((file) => (
                    <tr key={file.id} className="transition hover:bg-slate-50 dark:bg-white/5/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 dark:bg-white/5 text-gray-200">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{file.judul || 'Tanpa Judul'}</p>
                            <p className="text-xs text-slate-400 dark:text-[#64748B]">Diunggah pada {new Date(file.created_at).toLocaleDateString('id-ID')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-500 dark:text-[#94A3B8] whitespace-nowrap">
                        {file.subject_id ? 'Terhubung ke Kurikulum' : '-'}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-500 dark:text-[#94A3B8] whitespace-nowrap">
                        {new Date(file.created_at).toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'})}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF8F1] px-3 py-1 text-xs font-bold text-[#4B8B60]">
                          Terproses AI
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleDelete(file.id)} className="rounded-lg p-2 text-slate-500 dark:text-[#94A3B8] transition hover:bg-[#FFF5F5] hover:text-[#E53E3E]">
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
        </div>

      </div>
    </TeacherLayout>
  );
}
