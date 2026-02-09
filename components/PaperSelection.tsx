
import React from 'react';
import { FileText, Lock, ArrowRight, Star } from 'lucide-react';
import { Paper } from '../types';

interface PaperSelectionProps {
  onSelect: (paperId: number) => void;
}

const PAPERS: Paper[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `Paper ${i + 1}`,
  isAvailable: i === 0, // Only Paper 1 is available
  totalQuestions: 96
}));

const PaperSelection: React.FC<PaperSelectionProps> = ({ onSelect }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
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
            onClick={() => paper.isAvailable && onSelect(paper.id)}
            className={`
              relative group rounded-2xl p-6 transition-all duration-300 border-2
              ${paper.isAvailable 
                ? 'bg-white border-blue-100 hover:border-blue-500 hover:shadow-2xl cursor-pointer hover:-translate-y-2' 
                : 'bg-slate-50 border-slate-100 opacity-80 cursor-not-allowed'}
            `}
          >
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center mb-4
              ${paper.isAvailable ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}
            `}>
              {paper.isAvailable ? <FileText className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
            </div>

            <h3 className={`text-xl font-bold mb-1 ${paper.isAvailable ? 'text-slate-900' : 'text-slate-400'}`}>
              {paper.title}
            </h3>
            
            {paper.isAvailable ? (
              <>
                <p className="text-slate-500 text-sm mb-6">96 MCQs • 60 Mins</p>
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  Start Paper <ArrowRight className="w-4 h-4" />
                </div>
              </>
            ) : (
              <span className="inline-block px-3 py-1 bg-slate-200 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest mt-4">
                Coming Soon
              </span>
            )}

            {paper.id === 1 && (
              <div className="absolute -top-3 -right-3 bg-amber-400 text-white p-2 rounded-full shadow-lg">
                <Star className="w-4 h-4 fill-current" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaperSelection;
