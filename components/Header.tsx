
import React from 'react';
import { Timer, User, CheckCircle2, ClipboardList } from 'lucide-react';

interface HeaderProps {
  timeRemaining: number;
  studentName: string;
  totalQuestions: number;
  currentQuestionIndex: number;
  onFinish: () => void;
  paperName: string;
}

const Header: React.FC<HeaderProps> = ({ 
  timeRemaining, 
  studentName, 
  totalQuestions, 
  currentQuestionIndex,
  onFinish,
  paperName
}) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const isTimeLow = timeRemaining < 300; // Less than 5 mins

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-lg shadow-blue-100">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 leading-none">{paperName}</h2>
                <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded uppercase tracking-tighter">Live Session</span>
              </div>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{studentName}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <div className={`flex flex-col items-center justify-center px-6 py-2 rounded-2xl border-2 transition-colors ${isTimeLow ? 'bg-red-50 border-red-200 text-red-600' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">Time Left</span>
              <div className="flex items-center gap-2">
                <Timer className={`w-4 h-4 ${isTimeLow ? 'animate-pulse' : ''}`} />
                <span className="font-mono text-2xl font-black leading-none">{formatTime(timeRemaining)}</span>
              </div>
            </div>

            <button
              onClick={onFinish}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl shadow-green-100 hover:-translate-y-0.5 active:translate-y-0"
            >
              <CheckCircle2 className="w-5 h-5" />
              Submit Test
            </button>
          </div>
        </div>
      </div>
      <div className="w-full h-1.5 bg-slate-100 overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
};

export default Header;
