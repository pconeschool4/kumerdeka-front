import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import StudentLayout from '../../Layouts/StudentLayout';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

export default function Quiz() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [quizInfo, setQuizInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    const quizId = location.state?.quizId;
    if (quizId && user?.id) {
      fetchQuizData(quizId);
    } else {
      setLoading(false);
    }
  }, [location.state, user]);

  const fetchQuizData = async (quizId) => {
    try {
      setLoading(true);
      // Fetch quiz info
      const { data: qInfo, error: qError } = await supabase
        .from('kuis')
        .select('id, deskripsi, durasi, subjects(nama), materials(judul, content)')
        .eq('id', quizId)
        .single();
        
      if (!qError && qInfo) setQuizInfo(qInfo);

      // Fetch questions linked to this quiz
      const { data: qSoal, error: qsError } = await supabase
        .from('kuis_soal')
        .select(`
          urutan,
          bank_soal (
            id, pertanyaan, pilihan, jawaban, kesulitan
          )
        `)
        .eq('kuis_id', quizId)
        .order('urutan', { ascending: true });

      if (!qsError && qSoal) {
        const formatted = qSoal.map((item, idx) => {
          const bankData = item.bank_soal;
          // pilihan is assumed to be an object: { a: "opsi A", b: "opsi B", ... }
          let optionsArr = [];
          if (bankData.pilihan) {
            Object.keys(bankData.pilihan).forEach(k => {
              optionsArr.push({
                id: k.toUpperCase(),
                text: bankData.pilihan[k]
              });
            });
          }
          
          return {
            id: idx + 1,
            soal_id: bankData.id,
            level: bankData.kesulitan,
            question: bankData.pertanyaan,
            options: optionsArr,
            answer: bankData.jawaban?.toUpperCase(),
            explanation: "Penjelasan akan muncul setelah submit"
          };
        });
        setQuizData(formatted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalQuestions = quizData.length;
  const currentNumber = currentQuestionIndex + 1;
  const question = quizData[currentQuestionIndex];
  const progressPercent = (currentNumber / (totalQuestions || 1)) * 100;

  const handleSelectOption = (optionId) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionId
    });
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    let correctCount = 0;
    const answerRecords = [];
    
    quizData.forEach((q, idx) => {
      const isCorrect = selectedAnswers[idx] === q.answer;
      if (isCorrect) correctCount++;
      
      answerRecords.push({
        soal_id: q.soal_id,
        jawaban: selectedAnswers[idx] || null,
        is_correct: isCorrect
      });
    });

    const score = Math.round((correctCount / totalQuestions) * 100) || 0;
    
    try {
      // 1. Get or Create data_siswa
      let siswaId = null;
      const { data: siswaData } = await supabase
        .from('data_siswa')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      if (!siswaData) {
        const { data: newSiswa } = await supabase.from('data_siswa').insert({
          user_id: user.id,
          nama: user?.user_metadata?.full_name || 'Siswa',
          kelas: '10A'
        }).select('id').single();
        siswaId = newSiswa?.id;
      } else {
        siswaId = siswaData.id;
      }

      if (!siswaId) throw new Error("Gagal mendapatkan ID Siswa");

      // 2. Insert into hasil_kuis
      const { data: hasilKuis, error: hasilError } = await supabase
        .from('hasil_kuis')
        .insert({
          siswa_id: siswaId,
          kuis_id: quizInfo.id,
          nilai: score,
          status: 'completed',
          finished_at: new Date().toISOString()
        }).select('id').single();
        
      if (hasilError) throw hasilError;

      // 3. Insert into jawaban_siswa
      const jawabanSiswaPayload = answerRecords.map(record => ({
        hasil_kuis_id: hasilKuis.id,
        soal_id: record.soal_id,
        jawaban: record.jawaban,
        benar: record.is_correct
      }));

      const { error: jawabanError } = await supabase
        .from('jawaban_siswa')
        .insert(jawabanSiswaPayload);

      if (jawabanError) throw jawabanError;
      
      // Tampilkan hasil rangkuman
      setShowSubmitModal(false);
      setQuizResult({
        score,
        correctCount,
        totalQuestions,
        summary: score >= 80 ? 'Hebat! Anda sangat menguasai materi ini. Pertahankan prestasinya.' : (score >= 60 ? 'Cukup baik, tapi masih ada beberapa konsep yang perlu Anda ulangi agar lebih matang.' : 'Jangan menyerah! Anda perlu banyak membaca ulang materi ini dan berlatih soal-soal dasar kembali.')
      });
      
    } catch (err) {
      console.error(err);
      alert('Gagal mengumpulkan kuis: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Loader2 className="animate-spin text-[#4285D4]" size={32} />
          <p className="mt-4 text-slate-500 dark:text-[#94A3B8]">Memuat soal kuis...</p>
        </div>
      </StudentLayout>
    );
  }

  if (quizResult) {
    return (
      <StudentLayout>
        <div className="mx-auto max-w-2xl text-center py-12">
          <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-[#10B981]/10 text-[#10B981]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Kuis Selesai!</h2>
          <p className="text-slate-500 dark:text-[#94A3B8] mb-8">Anda telah menyelesaikan {quizInfo?.deskripsi}</p>
          
          <div className="bg-white dark:bg-white dark:bg-[#0F172A]/60 border border-slate-200 dark:border-white/10 rounded-3xl p-8 backdrop-blur-xl mb-8 shadow-2xl">
            <div className="text-[64px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4285D4] to-[#38BDF8] leading-none mb-4">
              {quizResult.score}
            </div>
            <div className="flex justify-center gap-6 text-sm font-medium mb-8">
              <div className="text-[#10B981]">{quizResult.correctCount} Benar</div>
              <div className="text-[#EF4444]">{quizResult.totalQuestions - quizResult.correctCount} Salah</div>
            </div>
            <div className="text-left bg-slate-50 dark:bg-white/5 rounded-2xl p-6 border border-slate-100 dark:border-white/5 mb-8">
              <h4 className="text-slate-900 dark:text-white font-bold mb-2 flex items-center gap-2">
                <Sparkles size={18} className="text-[#38BDF8]" />
                Summary Evaluasi
              </h4>
              <p className="text-slate-500 dark:text-[#94A3B8] text-sm leading-relaxed mb-4">{quizResult.summary}</p>
              
              {quizInfo?.materials?.content && (
                <div className="mt-4 border-t border-slate-200 dark:border-white/10 pt-4">
                  <h4 className="text-slate-900 dark:text-white font-bold mb-2">Penjelasan Materi yang Baru Diajarkan:</h4>
                  <p className="text-slate-500 dark:text-[#94A3B8] text-sm leading-relaxed">
                    {quizInfo.materials.content.length > 500 
                      ? quizInfo.materials.content.substring(0, 500) + '...'
                      : quizInfo.materials.content}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8 text-left">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Review Jawaban</h3>
            <div className="flex flex-col gap-6">
              {quizData.map((q, index) => {
                const isSelectedCorrect = selectedAnswers[index] === q.answer;
                return (
                  <div key={index} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white dark:bg-[#0F172A]/60 p-6 backdrop-blur-xl">
                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                      {index + 1}. {q.question}
                    </p>
                    <div className="flex flex-col gap-3">
                      {q.options.map((opt) => {
                        const isSelected = selectedAnswers[index] === opt.id;
                        const isCorrect = opt.id === q.answer;
                        
                        let borderClass = "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5";
                        if (isCorrect) {
                          borderClass = "border-[#10B981] bg-[#10B981]/10 text-[#10B981]";
                        } else if (isSelected && !isCorrect) {
                          borderClass = "border-[#EF4444] bg-[#EF4444]/10 text-[#EF4444]";
                        }

                        return (
                          <div 
                            key={opt.id} 
                            className={`flex items-center rounded-xl border p-4 ${borderClass}`}
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/10 text-xs font-bold mr-4">
                              {opt.id}
                            </span>
                            <span className="text-sm font-medium">
                              {opt.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            onClick={() => navigate('/student/dashboard')}
            className="rounded-xl bg-[#4285D4] px-8 py-3.5 text-sm font-bold text-slate-900 dark:text-white transition hover:bg-[#3171BC]"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </StudentLayout>
    );
  }

  if (!question) {
    return (
      <StudentLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <button onClick={() => navigate('/student/dashboard')} className="rounded-full bg-slate-50 dark:bg-white/5 p-4 text-slate-400 dark:text-[#64748B] mb-4 hover:bg-slate-100 dark:bg-white/10 transition">
            <ArrowLeft size={32} />
          </button>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tidak ada kuis yang aktif</h2>
          <p className="mt-2 text-slate-500 dark:text-[#94A3B8]">Silakan pilih kuis dari halaman dashboard terlebih dahulu.</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="mx-auto w-full">
      
      {/* Quiz Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
              {quizInfo?.deskripsi || 'Kuis Latihan'}
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-[#94A3B8]">
              {quizInfo?.subjects?.nama || 'Tanpa Mapel'} · {quizInfo?.durasi || '-'} Menit
            </p>
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            {currentNumber} / {totalQuestions}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#E8EEF7]">
          <div 
            className="h-full rounded-full bg-[#4285D4] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Quiz Card */}
      <div className="rounded-3xl bg-white dark:bg-white dark:bg-[#0F172A]/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-10">
        
        {/* Difficulty Badge */}
        <div className="mb-6 inline-block rounded-full bg-[#FFF9E6] px-4 py-1.5 text-xs font-bold text-[#D69E2E]">
          {question.level}
        </div>

        {/* Question Text */}
        <h2 className="mb-10 text-2xl font-bold text-slate-900 dark:text-white md:text-[28px] md:leading-tight">
          {question.question}
        </h2>

        {/* Options */}
        <div className="mb-12 flex flex-col gap-4">
          {question.options.map((opt) => {
            const isSelected = selectedAnswers[currentQuestionIndex] === opt.id;
            
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`flex w-full items-center gap-4 rounded-2xl border px-6 py-4 text-left transition-all ${
                  isSelected
                    ? 'border-[#4285D4] bg-slate-50 dark:bg-white/5 ring-1 ring-[#4285D4]'
                    : 'border-slate-200 dark:border-white/10 hover:border-[#CBD5E1] hover:bg-white dark:bg-white dark:bg-[#0F172A]/60'
                }`}
              >
                <span className={`text-sm font-bold ${isSelected ? 'text-[#4285D4]' : 'text-slate-500 dark:text-[#94A3B8]'}`}>
                  {opt.id}.
                </span>
                <span className="text-[15px] font-medium text-slate-900 dark:text-white">
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between border-t border-[#F0F3F8] pt-6">
          <button 
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white dark:bg-[#0F172A]/60 px-5 py-2.5 text-sm font-semibold text-gray-200 transition hover:bg-slate-50 dark:bg-white/5 disabled:opacity-50"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            Sebelumnya
          </button>
          
          {currentQuestionIndex < totalQuestions - 1 ? (
            <button 
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#4285D4] px-6 py-2.5 text-sm font-semibold text-slate-900 dark:text-white transition hover:bg-[#3171BC]"
            >
              Selanjutnya
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          ) : (
            <button 
              onClick={() => setShowSubmitModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#38BDF8] px-6 py-2.5 text-sm font-semibold text-slate-900 dark:text-white shadow-[0_0_15px_rgba(56,189,248,0.5)] transition hover:bg-[#0284C7]"
            >
              Selesai Kumpulkan
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>

      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172B4D]/40 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-white dark:bg-[#0F172A]/60 p-6 shadow-2xl text-center">
            <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">Kumpulkan Kuis?</h2>
            <p className="mb-6 text-sm text-slate-500 dark:text-[#94A3B8]">Pastikan semua jawaban sudah terisi dengan benar. Anda tidak dapat mengubah jawaban setelah dikumpulkan.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowSubmitModal(false)} className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-500 dark:text-[#94A3B8] hover:bg-gray-100">Batal</button>
              <button 
                onClick={handleSubmitQuiz} 
                disabled={submitting}
                className="rounded-xl bg-[#4285D4] px-5 py-2.5 text-sm font-bold text-slate-900 dark:text-white hover:bg-[#3171BC] disabled:opacity-50"
              >
                {submitting ? 'Mengumpulkan...' : 'Ya, Kumpulkan'}
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </StudentLayout>
  );
}
