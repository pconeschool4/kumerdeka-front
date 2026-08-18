import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import StudentLayout from '../../Layouts/StudentLayout';

// Dummy data to simulate Supabase fetch
const DUMMY_QUESTIONS = [
  {
    id: 1,
    level: 'Sedang',
    question: 'Jika 2x + 5 = 17, berapakah nilai x?',
    options: [
      { id: 'A', text: '4' },
      { id: 'B', text: '5' },
      { id: 'C', text: '6' },
      { id: 'D', text: '7' },
    ],
    answer: 'C'
  },
  // We can add more questions here for a real test
];

export default function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const totalQuestions = 10;
  const currentNumber = currentQuestionIndex + 3; // Hardcoding 3 for visual match with mockup

  const question = DUMMY_QUESTIONS[0];
  const progressPercent = (currentNumber / totalQuestions) * 100;

  const handleSelectOption = (optionId) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionId
    });
  };

  return (
    <StudentLayout>
      <div className="mx-auto w-full">
      
      {/* Quiz Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#172B4D] md:text-3xl">
              Quiz · Persamaan Linear
            </h1>
            <p className="mt-1 text-sm font-medium text-[#718096]">
              CP 3.2 · TP 3.2.1
            </p>
          </div>
          <div className="text-sm font-bold text-[#172B4D]">
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
      <div className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-10">
        
        {/* Difficulty Badge */}
        <div className="mb-6 inline-block rounded-full bg-[#FFF9E6] px-4 py-1.5 text-xs font-bold text-[#D69E2E]">
          {question.level}
        </div>

        {/* Question Text */}
        <h2 className="mb-10 text-2xl font-bold text-[#172B4D] md:text-[28px] md:leading-tight">
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
                    ? 'border-[#4285D4] bg-[#F5F8FC] ring-1 ring-[#4285D4]'
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                }`}
              >
                <span className={`text-sm font-bold ${isSelected ? 'text-[#4285D4]' : 'text-[#718096]'}`}>
                  {opt.id}.
                </span>
                <span className="text-[15px] font-medium text-[#172B4D]">
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between border-t border-[#F0F3F8] pt-6">
          <button className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-semibold text-[#52637A] transition hover:bg-[#F8FAFC]">
            <ArrowLeft size={16} strokeWidth={2.5} />
            Sebelumnya
          </button>
          
          <button 
            onClick={() => setShowSubmitModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#4285D4] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3171BC]"
          >
            Selesai Kumpulkan
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>

      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172B4D]/40 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center">
            <h2 className="mb-2 text-xl font-bold text-[#172B4D]">Kumpulkan Kuis?</h2>
            <p className="mb-6 text-sm text-[#718096]">Pastikan semua jawaban sudah terisi dengan benar. Anda tidak dapat mengubah jawaban setelah dikumpulkan.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowSubmitModal(false)} className="rounded-xl px-5 py-2.5 text-sm font-bold text-[#718096] hover:bg-gray-100">Batal</button>
              <button 
                onClick={() => {
                  setShowSubmitModal(false);
                  window.location.href = '/student/materials';
                }} 
                className="rounded-xl bg-[#4285D4] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#3171BC]"
              >
                Ya, Kumpulkan
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </StudentLayout>
  );
}
