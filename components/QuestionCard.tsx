
import React from 'react';
import { Question } from '../types';
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedOption: number | null;
  onSelect: (index: number) => void;
  currentIndex: number;
  totalQuestions: number;
  onNext: () => void;
  onPrev: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOption,
  onSelect,
  currentIndex,
  totalQuestions,
  onNext,
  onPrev
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
            {question.category}
          </span>
          <span className="text-sm font-medium text-slate-400">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-tight">
          {question.question}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedOption === index;
            return (
              <button
                key={index}
                onClick={() => onSelect(index)}
                className={`
                  w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-200 flex items-center gap-4
                  ${isSelected 
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md translate-x-1' 
                    : 'border-slate-100 bg-slate-50 hover:border-blue-200 hover:bg-white text-slate-600'}
                `}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                  ${isSelected ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-400'}
                `}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-base md:text-lg font-medium">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-200">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors font-semibold"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>
        
        <div className="hidden md:flex items-center gap-2 text-slate-400 text-sm italic">
          <HelpCircle className="w-4 h-4" />
          Select an option to record your answer
        </div>

        <button
          onClick={onNext}
          disabled={currentIndex === totalQuestions - 1}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors font-semibold"
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
