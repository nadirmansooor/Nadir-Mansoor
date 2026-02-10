
import React from 'react';
import { Book, Atom, Beaker, Calculator, Monitor, MessageCircle, FileText, Languages, Library, ArrowLeft, ChevronRight } from 'lucide-react';

interface SubjectSelectionProps {
  studentClass: string;
  studentBoard: string;
  onSelect: (subject: string) => void;
  onBack: () => void;
}

const SUBJECTS = [
  { name: 'Physics', icon: Atom, color: 'text-blue-600', bg: 'bg-blue-50' },
  { name: 'Chemistry', icon: Beaker, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { name: 'Biology', icon: Beaker, color: 'text-green-600', bg: 'bg-green-50' },
  { name: 'Mathematics', icon: Calculator, color: 'text-orange-600', bg: 'bg-orange-50' },
  { name: 'Computer Science', icon: Monitor, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { name: 'English', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
  { name: 'Urdu', icon: Languages, color: 'text-pink-600', bg: 'bg-pink-50' },
  { name: 'Islamiat', icon: Book, color: 'text-amber-600', bg: 'bg-amber-50' },
  { name: 'Pakistan Studies', icon: Library, color: 'text-indigo-600', bg: 'bg-indigo-50' },
];

const SubjectSelection: React.FC<SubjectSelectionProps> = ({ studentClass, studentBoard, onSelect, onBack }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-12">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase hover:text-slate-600 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Go Back
        </button>
        <div className="text-right">
          <h1 className="text-3xl font-black text-slate-900">{studentClass} Material</h1>
          <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest">{studentBoard}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SUBJECTS.map((sub) => (
          <button
            key={sub.name}
            onClick={() => onSelect(sub.name)}
            className="group bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-blue-500 transition-all text-left flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <div className={`p-4 rounded-2xl ${sub.bg} ${sub.color} group-hover:scale-110 transition-transform`}>
                <sub.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">{sub.name}</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Authorized Study Material</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-blue-500 transition-colors" />
          </button>
        ))}
      </div>

      <div className="mt-16 p-8 bg-blue-600 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="max-w-lg">
             <h2 className="text-3xl font-black mb-2">Quality Assurance</h2>
             <p className="text-blue-100 font-bold opacity-80 text-sm">
               All notes and quizzes are curated specifically by Sir Nadir to match the current Punjab and Federal Board patterns for the 2025-26 session.
             </p>
           </div>
           <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
             <p className="text-[10px] font-black uppercase mb-1">Support Helpline</p>
             <p className="text-2xl font-black">0311-6969288</p>
           </div>
         </div>
         <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <Library className="w-64 h-64" />
         </div>
      </div>
    </div>
  );
};

export default SubjectSelection;
