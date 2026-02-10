
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PAPER_1_QUESTIONS, PAPER_3_QUESTIONS } from './data/questions';
import { Question, QuizState, Result, MaterialType } from './types';
import Header from './components/Header';
import QuestionCard from './components/QuestionCard';
import ResultView from './components/ResultView';
import PaperSelection from './components/PaperSelection';
import SubjectSelection from './components/SubjectSelection';
import MaterialTypeSelection from './components/MaterialTypeSelection';
import { ClipboardList, PlayCircle, LogOut, UserCircle, Camera, GraduationCap, Trophy, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';

const QUIZ_DURATION = 60 * 60; // 60 minutes in seconds

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [state, setState] = useState<QuizState>({
    studentName: '',
    cnic: '',
    profilePicture: null,
    examCategory: null,
    studentClass: null,
    studentBoard: null,
    selectedSubject: null,
    selectedMaterialType: null,
    hasMultipleAttemptPermission: true, 
    selectedPaperId: null,
    answers: {},
    isFinished: false,
    timeRemaining: QUIZ_DURATION,
    isStarted: false,
  });

  const [cnicInput, setCnicInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatCnic = (val: string) => {
    const cleaned = val.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 5) formatted = cleaned.slice(0, 5) + '-' + cleaned.slice(5);
    if (cleaned.length > 12) formatted = formatted.slice(0, 13) + '-' + cleaned.slice(12, 13);
    return formatted.slice(0, 15);
  };

  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCnicInput(formatCnic(e.target.value));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePaperSelect = (paperId: number) => {
    let paperQuestions: Question[] = [];
    if (paperId === 1) paperQuestions = PAPER_1_QUESTIONS;
    else if (paperId === 3) paperQuestions = PAPER_3_QUESTIONS;
    
    if (paperQuestions.length === 0) {
      alert("No questions available for this paper yet. Please try another.");
      return;
    }

    setQuestions(paperQuestions);
    setState(prev => ({ 
      ...prev, 
      selectedPaperId: paperId, 
      isStarted: true,
      isFinished: false,
      timeRemaining: QUIZ_DURATION,
      answers: {} 
    }));
    setCurrentQuestionIndex(0);
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answerIndex }
    }));
  };

  const handleAccessPortal = () => {
    if (nameInput.trim() && cnicInput.length === 15) {
      setState(prev => ({ ...prev, studentName: nameInput, cnic: cnicInput, profilePicture: previewImage }));
    } else {
      alert("Please enter a valid Name and CNIC (00000-0000000-0)");
    }
  };

  const calculateResult = (): Result => {
    let attempted = 0;
    let correct = 0;
    let wrong = 0;

    questions.forEach(q => {
      const userAns = state.answers[q.id];
      if (userAns !== undefined && userAns !== null) {
        attempted++;
        if (userAns === q.correctAnswer) {
          correct++;
        } else {
          wrong++;
        }
      }
    });

    const unattempted = questions.length - attempted;
    const score = correct - (wrong * 0.25);

    return {
      totalQuestions: questions.length,
      attempted,
      correct,
      wrong,
      score,
      unattempted
    };
  };

  const finishQuiz = useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setState(prev => ({ ...prev, isFinished: true }));
  }, []);

  const resetSelection = () => {
    setState(prev => ({
      ...prev,
      examCategory: null,
      studentClass: null,
      studentBoard: null,
      selectedSubject: null,
      selectedMaterialType: null,
      selectedPaperId: null,
      isStarted: false,
      isFinished: false
    }));
  };

  const goBack = () => {
    if (state.isFinished) {
      resetSelection();
      return;
    }
    if (state.selectedPaperId) {
      setState(s => ({ ...s, selectedPaperId: null, isStarted: false }));
    } else if (state.selectedMaterialType) {
      setState(s => ({ ...s, selectedMaterialType: null }));
    } else if (state.selectedSubject) {
      setState(s => ({ ...s, selectedSubject: null }));
    } else if (state.studentBoard || state.studentClass) {
      setState(s => ({ ...s, studentBoard: null, studentClass: null }));
    } else if (state.examCategory) {
      setState(s => ({ ...s, examCategory: null }));
    }
  };

  useEffect(() => {
    if (state.isStarted && !state.isFinished && state.timeRemaining > 0) {
      timerRef.current = window.setInterval(() => {
        setState(prev => {
          if (prev.timeRemaining <= 1) {
            finishQuiz();
            return { ...prev, timeRemaining: 0 };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [state.isStarted, state.isFinished, finishQuiz]);

  const getActivePaperTitle = () => {
    if (state.selectedPaperId === 1) return "Paper 1 (PMS GK 2019 & Sub-Inspector 2019)";
    if (state.selectedPaperId === 3) return "Paper 3 (Anti-Corruption Specialist 2020)";
    return state.selectedSubject ? `${state.selectedSubject} Quiz` : "Secure Assessment";
  };

  if (!state.studentName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 relative">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 float-animation"><ClipboardList className="w-8 h-8 text-white" /></div>
          </div>
          <h1 className="text-3xl font-black text-center text-slate-900 mb-2">Sir Nadir</h1>
          <p className="text-center text-slate-500 mb-6 font-medium uppercase tracking-widest text-[10px]">Student Access Portal</p>
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-3 mb-6">
              <div onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-all overflow-hidden relative">
                {previewImage ? <img src={previewImage} alt="Preview" className="w-full h-full object-cover" /> : <div className="flex flex-col items-center text-slate-400"><Camera className="w-8 h-8 mb-1" /><span className="text-[8px] font-black uppercase">Add Photo</span></div>}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="Ahmad Ali" className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-semibold" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CNIC (00000-0000000-0)</label>
              <input type="text" value={cnicInput} onChange={handleCnicChange} placeholder="35201-1234567-1" className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-mono font-bold" />
            </div>
            <button onClick={handleAccessPortal} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-blue-200 mt-4 flex items-center justify-center gap-2">Enter Portal <PlayCircle className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    );
  }

  if (!state.examCategory) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome, {state.studentName}</h2>
        <p className="text-slate-500 mb-12 uppercase tracking-[0.2em] font-bold text-xs">Choose Your Learning Path</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          <button onClick={() => setState(s => ({ ...s, examCategory: 'competitive' }))} className="group bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-blue-500 transition-all text-left relative">
            <div className="p-4 bg-blue-600 rounded-2xl w-fit mb-6 text-white"><Trophy className="w-10 h-10" /></div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Competitive Exams</h3>
            <p className="text-slate-500 text-sm">PPSC, FPSC, CSS, NTS, and Specialized Recruitment Assessments.</p>
            <ChevronRight className="absolute bottom-10 right-10 w-8 h-8 text-blue-100 group-hover:text-blue-500 transition-all" />
          </button>
          <button onClick={() => setState(s => ({ ...s, examCategory: 'board' }))} className="group bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-indigo-500 transition-all text-left relative">
            <div className="p-4 bg-indigo-600 rounded-2xl w-fit mb-6 text-white"><GraduationCap className="w-10 h-10" /></div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Board Exams</h3>
            <p className="text-slate-500 text-sm">Punjab Board & Federal Board Materials for 9th, 10th, 11th & 12th Classes.</p>
            <ChevronRight className="absolute bottom-10 right-10 w-8 h-8 text-indigo-100 group-hover:text-indigo-500 transition-all" />
          </button>
        </div>
      </div>
    );
  }

  if (state.examCategory === 'board' && (!state.studentClass || !state.studentBoard)) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center">
        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
           <button onClick={goBack} className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase mb-8 hover:text-slate-600"><ArrowLeft className="w-4 h-4" /> Go Back</button>
           <h2 className="text-3xl font-black text-slate-900 mb-12 text-center">Select Academic Level</h2>
           <div className="space-y-12">
              <section>
                <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-6">1. Choose Your Class</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['9th', '10th', '11th (1st Year)', '12th (2nd Year)'].map(c => (
                    <button key={c} onClick={() => setState(s => ({ ...s, studentClass: c }))} 
                    className={`p-6 rounded-2xl border-2 font-black text-sm transition-all ${state.studentClass === c ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-indigo-300'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </section>
              <section className={!state.studentClass ? 'opacity-20 pointer-events-none' : ''}>
                <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-6">2. Choose Your Board</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['Punjab Board', 'Federal Board'].map(b => (
                    <button key={b} onClick={() => setState(s => ({ ...s, studentBoard: b }))} 
                    className={`p-8 rounded-3xl border-2 font-black text-xl transition-all flex items-center justify-between ${state.studentBoard === b ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-indigo-300'}`}>
                      {b} <ChevronRight className="w-6 h-6" />
                    </button>
                  ))}
                </div>
              </section>
           </div>
        </div>
      </div>
    );
  }

  if (state.examCategory === 'board' && !state.selectedSubject) {
    return (
      <div className="min-h-screen bg-slate-50">
        <SubjectSelection 
          studentClass={state.studentClass!} 
          studentBoard={state.studentBoard!} 
          onSelect={(sub) => setState(s => ({ ...s, selectedSubject: sub }))}
          onBack={goBack}
        />
      </div>
    );
  }

  if (state.examCategory === 'board' && !state.selectedMaterialType) {
    return (
      <div className="min-h-screen bg-slate-50">
        <MaterialTypeSelection 
          subject={state.selectedSubject!}
          classTitle={state.studentClass!}
          onSelect={(type) => setState(s => ({ ...s, selectedMaterialType: type }))}
          onBack={goBack}
        />
      </div>
    );
  }

  if (!state.selectedPaperId && (state.examCategory === 'competitive' || state.selectedMaterialType === 'quiz')) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 py-4 shadow-sm">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
               <button onClick={goBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"><ArrowLeft className="w-6 h-6" /></button>
               <span className="font-black text-xl text-slate-900">Sir Nadir Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={resetSelection} className="text-[10px] font-black uppercase bg-slate-100 px-4 py-2 rounded-full text-slate-600 hover:bg-slate-200">Main Menu</button>
            </div>
          </div>
        </header>
        <PaperSelection 
          category={state.examCategory} 
          studentClass={state.studentClass} 
          studentBoard={state.studentBoard} 
          subject={state.selectedSubject}
          materialType={state.selectedMaterialType}
          onSelect={handlePaperSelect} 
        />
      </div>
    );
  }

  if (state.isFinished) {
    const result = calculateResult();
    const paperLabel = getActivePaperTitle();
    const syllabus = state.selectedPaperId === 1 ? ["PMS GK 2019", "Sub Inspector 2019"] : ["Anti-Corruption Specialized Exam Pattern", "High-Yield Recruitment MCQs"];
    
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <ResultView 
          result={result} 
          studentName={state.studentName} 
          cnic={state.cnic} 
          profilePicture={state.profilePicture}
          questions={questions} 
          answers={state.answers} 
          onRestart={resetSelection}
          paperName={paperLabel} 
          syllabus={syllabus}
          boardInfo={state.studentBoard ? `${state.studentClass} • ${state.studentBoard} (${state.selectedSubject})` : 'Competitive Recruitment Portal'}
        />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!state.isFinished && state.isStarted && (!currentQuestion || questions.length === 0)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Preparing Secure Exam Instance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header 
        timeRemaining={state.timeRemaining} 
        studentName={state.studentName} 
        totalQuestions={questions.length} 
        currentQuestionIndex={currentQuestionIndex} 
        onFinish={finishQuiz} 
        paperName={getActivePaperTitle()} 
      />
      <main className="flex-1 container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <QuestionCard 
            question={currentQuestion} 
            selectedOption={state.answers[currentQuestion.id] ?? null} 
            onSelect={(idx) => handleAnswerSelect(currentQuestion.id, idx)} 
            currentIndex={currentQuestionIndex} 
            totalQuestions={questions.length} 
            onNext={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))} 
            onPrev={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))} 
          />
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-28">
            <h3 className="text-xs font-black mb-4 text-slate-400 uppercase tracking-widest border-b pb-2">Navigation</h3>
            <div className="grid grid-cols-6 gap-2 max-h-[420px] overflow-y-auto custom-scrollbar p-1">
              {questions.map((q, idx) => (
                <button 
                  key={q.id} 
                  onClick={() => setCurrentQuestionIndex(idx)} 
                  className={`w-8 h-8 rounded-lg text-[10px] font-black flex items-center justify-center transition-all ${idx === currentQuestionIndex ? 'ring-2 ring-blue-500 ring-offset-2' : ''} ${state.answers[q.id] !== undefined ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'bg-slate-100 text-slate-400'}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
               <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400">
                 <span>Answered</span>
                 <span className="text-blue-600">{Object.keys(state.answers).length} / {questions.length}</span>
               </div>
               <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${(Object.keys(state.answers).length / questions.length) * 100}%` }}></div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
