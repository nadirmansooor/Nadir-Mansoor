
import React from 'react';
import { Timer, User, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  timeRemaining: number;
  studentName: string;
  totalQuestions: number;
  currentQuestionIndex: number;
  onFinish: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  timeRemaining, 
  studentName, 
  totalQuestions, 
  currentQuestionIndex,
  onFinish 
}) => {
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const isTimeLow = timeRemaining < 300; // Less than 5 mins

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 leading-none">{studentName}</h2>
              <p className="text-sm text-slate-500 mt-1">Candidate ID: 2024-{studentName.substring(0, 3).toUpperCase()}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${isTimeLow ? 'bg-red-50 border-red-200 text-red-600' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
              <Timer className={`w-5 h-5 ${isTimeLow ? 'animate-pulse' : ''}`} />
              <span className="font-mono text-xl font-bold">{formatTime(timeRemaining)}</span>
            </div>

            <button
              onClick={onFinish}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-100"
            >
              <CheckCircle2 className="w-5 h-5" />
              Finish
            </button>
          </div>
        </div>
      </div>
      <div className="w-full h-1 bg-slate-100 overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-300" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
};

export default Header;
