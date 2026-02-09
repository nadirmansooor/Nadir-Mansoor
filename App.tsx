
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QUIZ_QUESTIONS } from './data/questions';
import { Question, QuizState, Result } from './types';
import Header from './components/Header';
import QuestionCard from './components/QuestionCard';
import ResultView from './components/ResultView';
import { PlayCircle, ClipboardList, Info } from 'lucide-react';

const QUIZ_DURATION = 60 * 60; // 60 minutes in seconds

const App: React.FC = () => {
  const [questions] = useState<Question[]>(QUIZ_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [state, setState] = useState<QuizState>({
    studentName: '',
    answers: {},
    isFinished: false,
    timeRemaining: QUIZ_DURATION,
    isStarted: false,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const finishQuiz = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState(prev => ({ ...prev, isFinished: true }));
  }, []);

  useEffect(() => {
    if (state.isStarted && !state.isFinished && state.timeRemaining > 0) {
      timerRef.current = setInterval(() => {
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
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.isStarted, state.isFinished, finishQuiz]);

  const handleStart = (name: string) => {
    if (!name.trim()) return;
    setState(prev => ({ ...prev, studentName: name, isStarted: true }));
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

  if (!state.isStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-blue-50 rounded-full">
              <ClipboardList className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">AceQuiz Pro</h1>
          <p className="text-center text-slate-500 mb-8">Ultimate 96 MCQ Evaluation</p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 text-sm text-slate-600">
              <div className="p-1 bg-blue-100 rounded">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
              </div>
              <div>
                <p><span className="font-semibold text-slate-800">Timer:</span> 60 Minutes total</p>
                <p><span className="font-semibold text-slate-800">Marking:</span> +1 per correct, -0.25 per wrong</p>
                <p><span className="font-semibold text-slate-800">Review:</span> Detailed error analysis after submission</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-slate-700 font-medium">Student Full Name</span>
              <input
                type="text"
                placeholder="Enter your name to unlock the quiz"
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={state.studentName}
                onChange={(e) => setState(prev => ({ ...prev, studentName: e.target.value }))}
              />
            </label>
            <button
              onClick={() => handleStart(state.studentName)}
              disabled={!state.studentName.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-95"
            >
              <PlayCircle className="w-5 h-5" />
              Begin Quiz (96 MCQs)
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state.isFinished) {
    const result = calculateResult();
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <ResultView 
          result={result} 
          studentName={state.studentName} 
          questions={questions} 
          answers={state.answers} 
          onRestart={() => window.location.reload()}
        />
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
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 border-b pb-2">Navigation</h3>
            <div className="grid grid-cols-6 gap-2 max-h-[400px] overflow-y-auto custom-scrollbar p-1">
              {questions.map((q, idx) => {
                const isAnswered = state.answers[q.id] !== undefined;
                const isCurrent = idx === currentQuestionIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`
                      w-8 h-8 rounded text-xs font-medium flex items-center justify-center transition-all
                      ${isCurrent ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                      ${isAnswered ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}
                    `}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-6 space-y-2 text-xs text-slate-500 border-t pt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-100 rounded"></div>
                <span>Unattempted</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
