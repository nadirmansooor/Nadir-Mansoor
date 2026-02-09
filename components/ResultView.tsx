
import React from 'react';
import { Result, Question } from '../types';
import { Trophy, RefreshCcw, AlertCircle, CheckCircle, XCircle, MinusCircle, FileDown, Share2, Medal } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface ResultViewProps {
  result: Result;
  studentName: string;
  questions: Question[];
  answers: Record<number, number | null>;
  onRestart: () => void;
  paperName: string;
}

const ResultView: React.FC<ResultViewProps> = ({ result, studentName, questions, answers, onRestart, paperName }) => {
  const percentage = Math.round((result.correct / result.totalQuestions) * 100);
  const passThreshold = 40;
  const isPassed = result.score >= (result.totalQuestions * passThreshold / 100);
  
  const wrongQuestions = questions.filter(q => {
    const userAns = answers[q.id];
    return userAns !== undefined && userAns !== null && userAns !== q.correctAnswer;
  });

  const downloadDMC = () => {
    const doc = new jsPDF();
    
    // Colorful Header
    doc.setFillColor(30, 64, 175); // Dark Blue
    doc.rect(0, 0, 210, 50, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('DETAILED MARKS CERTIFICATE', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('ACADEMIC ASSESSMENT DIVISION', 105, 30, { align: 'center' });
    doc.text(`PAPER: ${paperName.toUpperCase()}`, 105, 40, { align: 'center' });
    
    // Student Section
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('CANDIDATE DETAILS', 20, 65);
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 67, 190, 67);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Student Name: ${studentName.toUpperCase()}`, 20, 75);
    doc.text(`Examination: ${paperName}`, 20, 82);
    doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, 20, 89);
    
    // Result Table
    doc.setFont('helvetica', 'bold');
    doc.text('PERFORMANCE DATA', 20, 105);
    doc.line(20, 107, 190, 107);
    
    const rows = [
      ['Test Title', paperName],
      ['Total MCQs', result.totalQuestions.toString()],
      ['Correct Answers', result.correct.toString()],
      ['Wrong Answers', result.wrong.toString()],
      ['Skipped Questions', result.unattempted.toString()],
      ['Calculation Formula', `(${result.correct} x 1.0) - (${result.wrong} x 0.25)`],
      ['Total Marks Obtained', result.score.toFixed(2)],
      ['Result Status', isPassed ? 'PASS' : 'FAIL']
    ];

    let currentY = 115;
    rows.forEach((row, i) => {
      // Background for rows
      if (i === rows.length - 1 || i === rows.length - 2) {
        doc.setFillColor(240, 245, 255);
      } else {
        doc.setFillColor(i % 2 === 0 ? 250 : 255, i % 2 === 0 ? 250 : 255, i % 2 === 0 ? 250 : 255);
      }
      doc.rect(20, currentY - 5, 170, 10, 'F');
      
      doc.setFont('helvetica', (i >= rows.length - 2) ? 'bold' : 'normal');
      doc.setTextColor(30, 30, 30);
      doc.text(row[0], 25, currentY + 2);
      
      if (row[0] === 'Result Status') {
        doc.setTextColor(isPassed ? [22, 163, 74] : [220, 38, 38]);
      }
      doc.text(row[1], 185, currentY + 2, { align: 'right' });
      currentY += 10;
    });

    // Signature Area
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(9);
    doc.text('__________________________', 150, 250);
    doc.text('Controller of Examinations', 150, 255);
    
    doc.setFontSize(8);
    doc.text('This is a computer-generated DMC. No physical signature is required.', 105, 280, { align: 'center' });

    doc.save(`DMC_${studentName}_${paperName}.pdf`);
  };

  const shareResult = () => {
    const text = `I just completed ${paperName} on AceQuiz Pro! Score: ${result.score.toFixed(2)} / ${result.totalQuestions}`;
    if (navigator.share) {
      navigator.share({ title: 'AceQuiz Result', text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(text);
      alert('Result copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-blue-600 p-8 md:p-12 text-center text-white relative">
          <div className="absolute top-4 right-4 opacity-10">
            <Medal className="w-32 h-32" />
          </div>
          <p className="text-blue-100 font-black text-xs uppercase tracking-[0.3em] mb-4">{paperName} OFFICIAL RESULT</p>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            {isPassed ? 'Assessment Passed!' : 'Assessment Failed'}
          </h1>
          <p className="text-blue-200 font-medium text-lg mb-8 opacity-90">{studentName}, your scorecard is ready.</p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 min-w-[180px] border border-white/20 shadow-xl">
              <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-1">Marks Obtained</p>
              <p className="text-5xl font-black">{result.score.toFixed(2)}</p>
              <p className="text-[10px] text-blue-300 mt-2 font-bold">OUT OF {result.totalQuestions}.00</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 min-w-[180px] border border-white/20 shadow-xl">
              <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-1">Success Rate</p>
              <p className="text-5xl font-black">{percentage}%</p>
              <p className="text-[10px] text-blue-300 mt-2 font-bold">THRESHOLD: 40%</p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <button 
              onClick={downloadDMC}
              className="bg-white text-blue-600 hover:bg-slate-50 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all shadow-2xl active:scale-95"
            >
              <FileDown className="w-5 h-5" />
              Download DMC PDF
            </button>
            <button 
              onClick={shareResult}
              className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all shadow-2xl border border-white/10 active:scale-95"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>
        </div>

        <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50">
          <div className="bg-white p-5 rounded-2xl text-center border border-slate-200 shadow-sm">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-slate-400 text-[10px] uppercase font-black tracking-tighter">Correct</p>
            <p className="text-2xl font-black text-slate-800">{result.correct}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl text-center border border-slate-200 shadow-sm">
            <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-slate-400 text-[10px] uppercase font-black tracking-tighter">Incorrect</p>
            <p className="text-2xl font-black text-slate-800">{result.wrong}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl text-center border border-slate-200 shadow-sm">
            <MinusCircle className="w-6 h-6 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-400 text-[10px] uppercase font-black tracking-tighter">Skipped</p>
            <p className="text-2xl font-black text-slate-800">{result.unattempted}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl text-center border border-slate-200 shadow-sm">
            <AlertCircle className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <p className="text-slate-400 text-[10px] uppercase font-black tracking-tighter">Attempted</p>
            <p className="text-2xl font-black text-slate-800">{result.attempted}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest">Marking Calculation</h2>
          <span className="text-[10px] font-bold text-slate-400">NEGATIVE MARKING APPLIED (-0.25)</span>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-slate-500 text-sm mb-1">Marks for Correct ({result.correct} x 1.0)</p>
              <p className="text-2xl font-black text-green-600">+{result.correct}.00</p>
            </div>
            <div className="text-2xl font-light text-slate-300 hidden md:block">−</div>
            <div className="text-center md:text-left">
              <p className="text-slate-500 text-sm mb-1">Deduction for Wrong ({result.wrong} x 0.25)</p>
              <p className="text-2xl font-black text-red-500">-{(result.wrong * 0.25).toFixed(2)}</p>
            </div>
            <div className="text-2xl font-light text-slate-300 hidden md:block">=</div>
            <div className="text-center md:text-left bg-slate-50 p-4 rounded-xl border border-slate-100 min-w-[150px]">
              <p className="text-slate-500 text-[10px] font-black uppercase mb-1">Final Score</p>
              <p className="text-3xl font-black text-blue-600">{result.score.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-8 pb-12">
        <button
          onClick={onRestart}
          className="bg-slate-900 hover:bg-black text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center gap-4 mx-auto transition-all shadow-2xl hover:-translate-y-1 active:translate-y-0"
        >
          <RefreshCcw className="w-5 h-5" />
          Exit to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ResultView;
