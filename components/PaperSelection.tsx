
import React, { useState } from 'react';
import { FileText, Lock, ArrowRight, ShieldCheck, X, GraduationCap, Clock, CheckCircle2 } from 'lucide-react';
import { Paper, MaterialType } from '../types';

interface PaperSelectionProps {
  category: 'competitive' | 'board' | null;
  studentClass: string | null;
  studentBoard: string | null;
  subject: string | null;
  materialType: MaterialType | null;
  onSelect: (paperId: number) => void;
}

const PAPERS: Paper[] = [
  { 
    id: 1, 
    title: `Paper 1 (PMS GK 2019 & Sub-Inspector 2019)`, 
    isAvailable: true, 
    totalQuestions: 96, 
    category: 'competitive' 
  },
  { 
    id: 3, 
    title: `Paper 3 (Anti-Corruption Specialist 2020)`, 
    isAvailable: true, 
    totalQuestions: 96, 
    category: 'competitive' 
  }
];

const PaperSelection: React.FC<PaperSelectionProps> = ({ category, studentClass, studentBoard, subject, materialType, onSelect }) => {
  const [showPasswordPrompt, setShowPasswordPrompt] = useState<{ id: number; title: string } | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const filteredPapers = category === 'competitive' 
    ? PAPERS.filter(p => p.category === 'competitive')
    : PAPERS.filter(p => p.category === 'board' && p.subject === subject && p.type === materialType);

  const handleCardClick = (paper: Paper) => {
    if (!paper.isAvailable) return;
    
    // As per instruction, secure Paper 1 and Paper 3
    if (paper.id === 1 || paper.id === 3) {
      setShowPasswordPrompt({ id: paper.id, title: paper.title });
    } else {
      onSelect(paper.id);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let isCorrect = false;
    
    if (showPasswordPrompt?.id === 1 && password === '1Paper') isCorrect = true;
    if (showPasswordPrompt?.id === 3 && password === 'Paper3') isCorrect = true;

    if (isCorrect) {
      onSelect(showPasswordPrompt!.id);
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
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Examination Portal</h1>
        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2">
          {category === 'competitive' ? (
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full">Competitive Recruitment Path</span>
          ) : (
            <span className="bg-indigo-600 text-white px-3 py-1 rounded-full">{subject} • {studentClass} • {studentBoard}</span>
          )}
        </p>
      </div>

      {filteredPapers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {filteredPapers.map((paper) => (
            <div key={paper.id} onClick={() => handleCardClick(paper)}
              className="relative group rounded-[2.5rem] p-10 bg-white border-2 border-slate-100 hover:border-blue-600 hover:shadow-2xl cursor-pointer transition-all hover:-translate-y-2 flex flex-col min-h-[320px]"
            >
              <div className="absolute top-8 right-10">
                <Lock className="w-6 h-6 text-slate-200 group-hover:text-blue-500 transition-colors" />
              </div>
              
              <div className="w-16 h-16 rounded-3xl bg-slate-900 text-white flex items-center justify-center mb-8 shadow-xl shadow-slate-100 group-hover:bg-blue-600 group-hover:rotate-6 transition-all duration-300">
                <ShieldCheck className="w-10 h-10" />
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight">{paper.title}</h3>
              
              <div className="flex flex-wrap gap-4 mt-2 mb-10">
                <div className="flex items-center gap-1.5 text-slate-400 font-black text-[10px] uppercase">
                  <FileText className="w-3 h-3" /> {paper.totalQuestions} Questions
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 font-black text-[10px] uppercase">
                  <Clock className="w-3 h-3" /> 60 Minutes
                </div>
                <div className="flex items-center gap-1.5 text-red-500 font-black text-[10px] uppercase">
                  <CheckCircle2 className="w-3 h-3" /> 0.25 Negative Marking
                </div>
              </div>
              
              <div className="mt-auto flex items-center gap-2 font-black text-blue-600 uppercase text-[10px] tracking-widest group-hover:gap-4 transition-all">
                Unlock Examination <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200">
          <GraduationCap className="w-24 h-24 text-slate-100 mx-auto mb-8" />
          <h3 className="text-3xl font-black text-slate-800 mb-4">Material Uploading...</h3>
          <p className="text-slate-500 max-w-lg mx-auto font-bold leading-relaxed">
            Sir Nadir is currently preparing specialized content for {subject || 'this category'}. Verified materials will be added shortly.
          </p>
          <div className="mt-12 flex justify-center gap-4">
             <div className="bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-100">Status: Scheduled</div>
          </div>
        </div>
      )}

      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl animate-in zoom-in duration-300 relative border border-white/20">
            <div className="flex justify-between items-start mb-8">
              <div className="p-4 bg-slate-900 rounded-2xl text-white shadow-lg"><Lock className="w-8 h-8" /></div>
              <button 
                onClick={() => {
                  setShowPasswordPrompt(null);
                  setPassword('');
                  setError(false);
                }} 
                className="text-slate-300 hover:text-slate-600 transition-colors p-2"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <h2 className="text-3xl font-black text-slate-900 mb-2">Access Key</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-10">
              {showPasswordPrompt.title}
            </p>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="relative">
                <input 
                  autoFocus 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className={`w-full px-6 py-6 rounded-2xl border-2 outline-none transition-all font-black text-2xl tracking-[0.5em] text-center ${error ? 'border-red-500 bg-red-50 text-red-900' : 'border-slate-100 focus:border-slate-900 bg-slate-50 text-slate-900'}`} 
                />
                {error && <p className="text-red-500 text-[10px] font-black uppercase mt-3 text-center">Invalid Authorization Key</p>}
              </div>
              <button type="submit" className="w-full bg-slate-900 hover:bg-black text-white font-black py-6 rounded-2xl shadow-2xl uppercase tracking-[0.3em] text-xs active:scale-95 transition-all">Begin Assessment</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaperSelection;
