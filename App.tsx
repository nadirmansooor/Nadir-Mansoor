
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PAPER_1_QUESTIONS, PAPER_2_QUESTIONS, PAPER_3_QUESTIONS } from './data/questions';
import { Question, QuizState, Result } from './types';
import Header from './components/Header';
import QuestionCard from './components/QuestionCard';
import ResultView from './components/ResultView';
import PaperSelection from './components/PaperSelection';
import { ClipboardList, Info, PlayCircle, LogOut } from 'lucide-react';

const QUIZ_DURATION = 60 * 60; // 60 minutes in seconds

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [state, setState] = useState<QuizState>({
    studentName: '',
    selectedPaperId: null,
    answers: {},
    isFinished: false,
    timeRemaining: QUIZ_DURATION,
    isStarted: false,
  });

  const timerRef = useRef<number | null>(null);

  const finishQuiz = useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setState(prev => ({ ...prev, isFinished: true }));
  }, []);

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
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [state.isStarted, state.isFinished, finishQuiz]);

  const handlePaperSelect = (paperId: number) => {
    let paperQuestions: Question[] = [];
    if (paperId === 1) paperQuestions = PAPER_1_QUESTIONS;
    else if (paperId === 2) paperQuestions = PAPER_2_QUESTIONS;
    else if (paperId === 3) paperQuestions = PAPER_3_QUESTIONS;
    
    setQuestions(paperQuestions);
    setState(prev => ({ 
      ...prev, 
      selectedPaperId: paperId, 
      isStarted: true,
      timeRemaining: QUIZ_DURATION,
      answers: {} 
    }));
    setCurrentQuestionIndex(0);
  };

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: optionIndex }
    }));
  };

  const calculateResult = (): Result => {
    let correct = 0;
    let wrong = 0;
    let attempted = 0;

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

    const score = (correct * 1) - (wrong * 0.25);
    const unattempted = questions.length - attempted;

    return {
      totalQuestions: questions.length,
      attempted,
      correct,
      wrong,
      score,
      unattempted
    };
  };

  if (!state.studentName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 overflow-hidden relative">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full opacity-50"></div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 float-animation">
                <ClipboardList className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl font-black text-center text-slate-900 mb-2">AceQuiz Pro</h1>
            <p className="text-center text-slate-500 mb-8 font-medium">Digital Examination System</p>
            
            <div className="bg-slate-50 rounded-2xl p-5 mb-8 border border-slate-100 space-y-3">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <Info className="w-4 h-4 text-blue-600" /> System Rules
              </div>
              <ul className="text-xs text-slate-500 space-y-2 pl-2">
                <li className="flex items-center gap-2">• Correct Answer: <span className="text-green-600 font-bold">+1.00</span></li>
                <li className="flex items-center gap-2">• Incorrect Answer: <span className="text-red-600 font-bold">-0.25</span></li>
                <li className="flex items-center gap-2">• Session Limit: <span className="text-slate-800 font-bold">60 Minutes</span></li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Student Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-blue-500 focus:ring-0 outline-none transition-all font-semibold text-slate-800 placeholder:text-slate-300"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) setState(prev => ({ ...prev, studentName: e.currentTarget.value }));
                  }}
                  id="name-input"
                />
              </div>
              <button
                onClick={() => {
                  const input = document.getElementById('name-input') as HTMLInputElement;
                  if (input.value) setState(prev => ({ ...prev, studentName: input.value }));
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-200 active:scale-95"
              >
                Access Portal
                <PlayCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!state.selectedPaperId) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 py-4 shadow-sm">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <ClipboardList className="w-5 h-5" />
              </div>
              <span className="font-black text-xl text-slate-900">AceQuiz Pro</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Logged In As</p>
                <p className="font-bold text-slate-800">{state.studentName}</p>
              </div>
              <button 
                onClick={() => setState(prev => ({ ...prev, studentName: '' }))}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>
        <PaperSelection onSelect={handlePaperSelect} />
      </div>
    );
  }

  if (state.isFinished) {
    const result = calculateResult();
    const paperLabel = state.selectedPaperId === 1 ? 'Paper 1' : (state.selectedPaperId === 2 ? 'Paper 2 (Math)' : 'Paper 3 (Special)');
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <ResultView 
          result={result} 
          studentName={state.studentName} 
          questions={questions} 
          answers={state.answers} 
          onRestart={() => setState(prev => ({ ...prev, selectedPaperId: null, isFinished: false, isStarted: false }))}
          paperName={paperLabel}
        />
      </div>
    );
  }

  const paperLabel = state.selectedPaperId === 1 ? 'Paper 1' : (state.selectedPaperId === 2 ? 'Paper 2 (Math)' : 'Paper 3 (Special)');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header 
        timeRemaining={state.timeRemaining} 
        studentName={state.studentName} 
        totalQuestions={questions.length}
        currentQuestionIndex={currentQuestionIndex}
        onFinish={finishQuiz}
        paperName={paperLabel}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <QuestionCard
            question={questions[currentQuestionIndex]}
            selectedOption={state.answers[questions[currentQuestionIndex].id] ?? null}
            onSelect={(idx) => handleAnswerSelect(questions[currentQuestionIndex].id, idx)}
            currentIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            onNext={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
            onPrev={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          />
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-28">
            <h3 className="text-xs font-black mb-4 text-slate-400 uppercase tracking-widest border-b pb-2">Question Matrix</h3>
            <div className="grid grid-cols-6 gap-2 max-h-[420px] overflow-y-auto custom-scrollbar p-1">
              {questions.map((q, idx) => {
                const isAnswered = state.answers[q.id] !== undefined;
                const isCurrent = idx === currentQuestionIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`
                      w-8 h-8 rounded-lg text-[10px] font-black flex items-center justify-center transition-all
                      ${isCurrent ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                      ${isAnswered ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}
                    `}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-8 space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-slate-400">Answered</span>
                <span className="text-blue-600 font-black">{Object.keys(state.answers).length} / {questions.length}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300" 
                  style={{ width: `${(Object.keys(state.answers).length / questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
