
import React from 'react';
import { Result, Question } from '../types';
import { Trophy, RefreshCcw, AlertCircle, CheckCircle, XCircle, MinusCircle, ArrowRight } from 'lucide-react';

interface ResultViewProps {
  result: Result;
  studentName: string;
  questions: Question[];
  answers: Record<number, number | null>;
  onRestart: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ result, studentName, questions, answers, onRestart }) => {
  const percentage = Math.round((result.correct / result.totalQuestions) * 100);
  
  const wrongQuestions = questions.filter(q => {
    const userAns = answers[q.id];
    return userAns !== undefined && userAns !== null && userAns !== q.correctAnswer;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Hero Score Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-blue-600 p-8 md:p-12 text-center text-white relative">
          <div className="absolute top-4 right-4 opacity-10">
            <Trophy className="w-32 h-32" />
          </div>
          <p className="text-blue-100 font-medium mb-2 uppercase tracking-widest">Assessment Complete</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Congratulations, {studentName}!</h1>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 min-w-[160px]">
              <p className="text-blue-200 text-sm mb-1 uppercase">Final Score</p>
              <p className="text-5xl font-black">{result.score.toFixed(2)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 min-w-[160px]">
              <p className="text-blue-200 text-sm mb-1 uppercase">Accuracy</p>
              <p className="text-5xl font-black">{percentage}%</p>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl text-center">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-slate-500 text-xs uppercase font-bold">Correct</p>
            <p className="text-2xl font-bold text-slate-800">{result.correct}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl text-center">
            <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-slate-500 text-xs uppercase font-bold">Incorrect</p>
            <p className="text-2xl font-bold text-slate-800">{result.wrong}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl text-center">
            <MinusCircle className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-500 text-xs uppercase font-bold">Skipped</p>
            <p className="text-2xl font-bold text-slate-800">{result.unattempted}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl text-center">
            <AlertCircle className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <p className="text-slate-500 text-xs uppercase font-bold">Attempted</p>
            <p className="text-2xl font-bold text-slate-800">{result.attempted}</p>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Error Review ({wrongQuestions.length})</h2>
          <button 
            onClick={onRestart}
            className="flex items-center gap-2 text-blue-600 font-bold hover:underline"
          >
            <RefreshCcw className="w-4 h-4" />
            Restart Quiz
          </button>
        </div>

        {wrongQuestions.length === 0 ? (
          <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center">
            <Trophy className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800">Perfect Score!</h3>
            <p className="text-green-600">You didn't make any mistakes. Incredible job!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {wrongQuestions.map((q, idx) => (
              <div key={q.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Question #{q.id}</span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded uppercase">-0.25 Points</span>
                </div>
                <div className="p-6">
                  <p className="text-lg font-semibold text-slate-800 mb-4">{q.question}</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl border border-red-200 bg-red-50">
                      <p className="text-[10px] font-bold text-red-400 uppercase mb-1">Your Answer</p>
                      <p className="text-red-700 font-medium flex items-center gap-2">
                        <XCircle className="w-4 h-4 shrink-0" />
                        {q.options[answers[q.id] as number]}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-green-200 bg-green-50">
                      <p className="text-[10px] font-bold text-green-400 uppercase mb-1">Correct Answer</p>
                      <p className="text-green-700 font-medium flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        {q.options[q.correctAnswer]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center pt-8 pb-12">
        <button
          onClick={onRestart}
          className="bg-slate-800 hover:bg-black text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 mx-auto transition-all shadow-xl"
        >
          <RefreshCcw className="w-5 h-5" />
          Retake Examination
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ResultView;
