
import React from 'react';
import { FileText, ClipboardCheck, ScrollText, ArrowLeft, ChevronRight, Star } from 'lucide-react';
import { MaterialType } from '../types';

interface MaterialTypeSelectionProps {
  subject: string;
  classTitle: string;
  onSelect: (type: MaterialType) => void;
  onBack: () => void;
}

const TYPES = [
  { id: 'quiz' as MaterialType, title: 'Chapter Quiz', desc: 'Practice MCQs with 1 Mark for correct and negative marking.', icon: ClipboardCheck, color: 'text-orange-600', bg: 'bg-orange-50' },
  { id: 'past-papers' as MaterialType, title: 'Past Papers', desc: 'Solved board papers from the last 10 years (PDF).', icon: ScrollText, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'notes' as MaterialType, title: 'Handwritten Notes', desc: 'Short questions, long questions, and summaries by Sir Nadir.', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
];

const MaterialTypeSelection: React.FC<MaterialTypeSelectionProps> = ({ subject, classTitle, onSelect, onBack }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-16">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase hover:text-slate-600 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Subjects
        </button>
        <div className="text-right">
          <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest mb-1">{classTitle}</p>
          <h1 className="text-4xl font-black text-slate-900">{subject}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className="group relative bg-white p-10 rounded-[3rem] shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-slate-900 transition-all flex flex-col items-center text-center"
          >
            <div className={`w-20 h-20 rounded-3xl ${t.bg} ${t.color} flex items-center justify-center mb-8 shadow-lg shadow-black/5 group-hover:scale-110 transition-transform`}>
              <t.icon className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">{t.title}</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">{t.desc}</p>
            <div className="mt-auto flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-900 transition-colors">
              Access Now <ChevronRight className="w-4 h-4" />
            </div>
            {t.id === 'quiz' && (
              <div className="absolute top-6 right-6 flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Popular
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-20 border-t border-slate-200 pt-10 flex flex-col items-center">
         <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm border border-slate-100">
           <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
           <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Live Updates: New 2025 Solved Papers Added</p>
         </div>
      </div>
    </div>
  );
};

export default MaterialTypeSelection;
