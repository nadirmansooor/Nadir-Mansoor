
import React, { useState } from 'react';
import { FileText, Lock, ArrowRight, Star, ShieldCheck, X } from 'lucide-react';
import { Paper } from '../types';

interface PaperSelectionProps {
  onSelect: (paperId: number) => void;
}

const PAPERS: Paper[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `Paper ${i + 1}`,
  isAvailable: i === 0 || i === 1 || i === 2, // Papers 1, 2, and 3 are available
  totalQuestions: i === 0 ? 96 : (i === 1 ? 20 : (i === 2 ? 95 : 0))
}));

const PaperSelection: React.FC<PaperSelectionProps> = ({ onSelect }) => {
  const [showPasswordPrompt, setShowPasswordPrompt] = useState<number | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleCardClick = (paper: Paper) => {
    if (!paper.isAvailable) return;
    
    if (paper.id === 3) {
      setShowPasswordPrompt(3);
    } else {
      onSelect(paper.id);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Paper3') {
      onSelect(3);
      setShowPasswordPrompt(null);
      setPassword('');
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 relative">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Select Examination Paper</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Choose an available paper to begin your 60-minute assessment. 
          Each correct answer earns 1 mark, with 0.25 negative marking for incorrect choices.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {PAPERS.map((paper) => (
          <div 
            key={paper.id}
            onClick={() => handleCardClick(paper)}
            className={`
              relative group rounded-2xl p-6 transition-all duration-300 border-2
              ${paper.isAvailable 
                ? 'bg-white border-blue-100 hover:border-blue-500 hover:shadow-2xl cursor-pointer hover:-translate-y-2' 
                : 'bg-slate-50 border-slate-100 opacity-80 cursor-not-allowed'}
            `}
          >
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center mb-4
              ${paper.isAvailable ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-200 text-slate-400'}
            `}>
              {paper.isAvailable ? (paper.id === 3 ? <ShieldCheck className="w-6 h-6" /> : <FileText className="w-6 h-6" />) : <Lock className="w-5 h-5" />}
            </div>

            <h3 className={`text-xl font-bold mb-1 ${paper.isAvailable ? 'text-slate-900' : 'text-slate-400'}`}>
              {paper.title}
            </h3>
            
            {paper.isAvailable ? (
              <>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">
                  {paper.id === 1 ? 'General Syllabus' : (paper.id === 2 ? 'Math: Ratio & Prop.' : 'SECURED: Paper 3')}
                </p>
                <p className="text-slate-400 text-xs mb-6">{paper.totalQuestions} MCQs • 60 Mins</p>
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  {paper.id === 3 ? 'Unlock Paper' : 'Start Paper'} <ArrowRight className="w-4 h-4" />
                </div>
              </>
            ) : (
              <span className="inline-block px-3 py-1 bg-slate-200 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest mt-4">
                Coming Soon
              </span>
            )}

            {(paper.id === 1 || paper.id === 2 || paper.id === 3) && (
              <div className={`absolute -top-3 -right-3 p-2 rounded-full shadow-lg ${paper.id === 1 ? 'bg-amber-400' : (paper.id === 2 ? 'bg-blue-400' : 'bg-indigo-600')} text-white`}>
                <Star className="w-4 h-4 fill-current" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Password Prompt Modal */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 animate-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <button onClick={() => setShowPasswordPrompt(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 mb-2">Secure Entry</h2>
            <p className="text-slate-500 text-sm mb-6">Paper 3 is protected. Please enter the authorized access key to continue.</p>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Password</label>
                <input
                  autoFocus
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className={`w-full px-5 py-4 rounded-xl border-2 outline-none transition-all font-bold tracking-widest
                    ${error ? 'border-red-500 bg-red-50' : 'border-slate-100 focus:border-indigo-500 bg-slate-50'}`}
                />
                {error && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 animate-pulse uppercase">Access Denied: Invalid Key</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-indigo-100 active:scale-95 uppercase tracking-widest text-xs"
              >
                Authenticate
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaperSelection;
