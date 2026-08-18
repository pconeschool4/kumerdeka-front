import { useState } from 'react';
import { UploadCloud, FileText, Trash2, Eye, Sparkles } from 'lucide-react';
import TeacherLayout from '../../Layouts/TeacherLayout';

// Dummy data structure mirroring Supabase materials
const DUMMY_MATERIALS = [
  { id: 1, title: 'Modul_Aljabar_Dasar.pdf', subject: 'Matematika', size: '2.4 MB', uploadDate: '18 Agt 2026', status: 'Selesai' },
  { id: 2, title: 'Data_Nilai_Soal.csv', subject: 'Matematika', size: '150 KB', uploadDate: '17 Agt 2026', status: 'Selesai' },
  { id: 3, title: 'Fungsi_Grafik_Bab2.docx', subject: 'Matematika', size: '1.1 MB', uploadDate: '18 Agt 2026', status: 'Memproses AI' },
];

export default function TeacherMaterials() {
  const [isDragging, setIsDragging] = useState(false);

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
    // Logic for handling file upload will go here
    console.log("Files dropped");
  };

  return (
    <TeacherLayout>
      <div className="mx-auto w-full">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[#172B4D] md:text-3xl">
            Kelola Materi & Dokumen
          </h1>
          <p className="mt-2 text-[#718096]">
            Unggah file PDF, DOCX, CSV, atau Excel untuk dijadikan referensi belajar dan sumber pembuatan soal oleh AI.
          </p>
        </div>

        {/* Upload Area */}
        <div className="mb-10">
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 transition-colors ${
              isDragging 
                ? 'border-[#4285D4] bg-[#F5F8FC]' 
                : 'border-[#CBD5E1] bg-white hover:border-[#4285D4] hover:bg-[#F8FAFC]'
            }`}
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF4FF] text-[#4285D4]">
              <UploadCloud size={32} />
            </div>
            <h3 className="mb-1 text-lg font-bold text-[#172B4D]">
              Tarik dan lepas file di sini
            </h3>
            <p className="mb-6 text-sm text-[#718096]">
              Atau klik untuk memilih dari perangkat Anda. (Max. 10MB)
            </p>
            <input 
              type="file" 
              id="fileUpload" 
              className="hidden" 
              onChange={(e) => {
                if(e.target.files.length > 0) {
                  console.log("File selected:", e.target.files[0].name);
                }
              }} 
            />
            <label 
              htmlFor="fileUpload" 
              className="cursor-pointer rounded-xl bg-[#4285D4] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3171BC]"
            >
              Pilih File
            </label>
          </div>
        </div>

        {/* Material List */}
        <div>
          <h3 className="mb-6 text-xl font-bold text-[#172B4D]">Daftar File Tersimpan</h3>
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F8FAFC] text-xs font-semibold uppercase text-[#718096]">
                  <tr>
                    <th className="px-6 py-4">Nama File</th>
                    <th className="px-6 py-4">Mata Pelajaran</th>
                    <th className="px-6 py-4">Ukuran</th>
                    <th className="px-6 py-4">Status AI</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F3F8]">
                  {DUMMY_MATERIALS.map((file) => (
                    <tr key={file.id} className="transition hover:bg-[#F5F8FC]/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5F8FC] text-[#52637A]">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-[#172B4D]">{file.title}</p>
                            <p className="text-xs text-[#A0AEC0]">Diunggah pada {file.uploadDate}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-[#718096] whitespace-nowrap">
                        {file.subject}
                      </td>
                      <td className="px-6 py-4 font-medium text-[#718096]">
                        {file.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {file.status === 'Selesai' ? (
                          <span className="inline-flex rounded-full bg-[#EEF8F1] px-3 py-1 text-xs font-bold text-[#4B8B60]">
                            {file.status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3E8FF] px-3 py-1 text-xs font-bold text-[#8B5CF6]">
                            <Sparkles size={12} />
                            {file.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="rounded-lg p-2 text-[#718096] transition hover:bg-[#F5F8FC] hover:text-[#4285D4]">
                            <Eye size={18} />
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
        </div>

      </div>
    </TeacherLayout>
  );
}
