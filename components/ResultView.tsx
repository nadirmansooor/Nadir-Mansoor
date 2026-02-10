
import React from 'react';
import { Result, Question } from '../types';
import { Trophy, RefreshCcw, AlertCircle, CheckCircle, XCircle, MinusCircle, FileDown, Share2, Medal, ArrowDown } from 'lucide-react';
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
  const isPassed = percentage >= 40;
  
  const wrongQuestions = questions.filter(q => {
    const userAns = answers[q.id];
    return userAns !== undefined && userAns !== null && userAns !== q.correctAnswer;
  });

  const downloadDMC = () => {
    try {
      const doc = new jsPDF();
      
      // Header Banner
      doc.setFillColor(30, 64, 175);
      doc.rect(0, 0, 210, 50, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('DETAILED MARK CERTIFICATE', 105, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('ACEQUIZ PRO - DIGITAL EVALUATION SYSTEM', 105, 30, { align: 'center' });
      doc.text(`PAPER: ${paperName.toUpperCase()}`, 105, 40, { align: 'center' });
      
      // Candidate Info
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('CANDIDATE PROFILE', 20, 65);
      doc.setDrawColor(220, 220, 220);
      doc.line(20, 67, 190, 67);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Student Name: ${studentName.toUpperCase()}`, 20, 75);
      doc.text(`Roll Number: AQ-${Math.floor(1000 + Math.random() * 9000)}`, 20, 82);
      doc.text(`Issue Date: ${new Date().toLocaleDateString()}`, 20, 89);
      
      // Marks Table
      doc.setFont('helvetica', 'bold');
      doc.text('ASSESSMENT SUMMARY', 20, 105);
      doc.line(20, 107, 190, 107);
      
      const tableData: [string, string][] = [
        ['Test Title', paperName],
        ['Total Questions', result.totalQuestions.toString()],
        ['Attempted', result.attempted.toString()],
        ['Correct Answers', result.correct.toString()],
        ['Incorrect Answers', result.wrong.toString()],
        ['Marking Calculation', `(${result.correct} x 1.0) - (${result.wrong} x 0.25)`],
        ['Total Score', result.score.toFixed(2)],
        ['Result Status', isPassed ? 'PASSED' : 'FAILED']
      ];

      let rowY = 115;
      tableData.forEach((row, i) => {
        const isHeader = i >= tableData.length - 2;
        // Fix: setFillColor expects RGB values separately or as numbers for grayscale, providing 3 numbers to be safe
        const gray = i % 2 === 0 ? 250 : 255;
        doc.setFillColor(gray, gray, gray);
        doc.rect(20, rowY - 5, 170, 10, 'F');
        
        doc.setFont('helvetica', isHeader ? 'bold' : 'normal');
        doc.setTextColor(30, 30, 30);
        doc.text(row[0], 25, rowY + 2);
        
        if (row[0] === 'Result Status') {
          // Fix: setTextColor does not accept arrays in all versions, use separate arguments
          if (isPassed) {
            doc.setTextColor(22, 163, 74);
          } else {
            doc.setTextColor(220, 38, 38);
          }
        }
        // Fix: Explicitly cast row[1] to string to satisfy type checker
        doc.text(String(row[1]), 185, rowY + 2, { align: 'right' });
        rowY += 10;
      });

      // Verification
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(8);
      doc.text('Verified by AceQuiz Pro Examination Controller', 105, 275, { align: 'center' });
      doc.text('This is a computer-generated certificate.', 105, 280, { align: 'center' });

      doc.save(`DMC_${studentName}_${paperName}.pdf`);
    } catch (err) {
      console.error("PDF Generation Error:", err);
      alert("Failed to generate PDF. Check console for details.");
    }
  };

  const shareResult = () => {
    const text = `I scored ${result.score.toFixed(2)} / ${result.totalQuestions} on ${paperName}! Accuracy: ${percentage}%`;
    if (navigator.share) {
      navigator.share({ title: 'My Quiz Results', text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(text);
      alert('Results copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-blue-600 p-8 md:p-12 text-center text-white relative">
          <div className="absolute top-4 right-4 opacity-10">
            <Medal className="w-32 h-32" />
          </div>
          <p className="text-blue-100 font-black text-[10px] uppercase tracking-[0.4em] mb-4">Official Assessment Result</p>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            {isPassed ? 'Congratulations!' : 'Keep Pushing!'}
          </h1>
          <p className="text-blue-200 font-medium text-lg mb-10 opacity-90">{studentName}, your DMC is ready.</p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 min-w-[200px] border border-white/20 shadow-xl">
              <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-1">Final Score</p>
              <p className="text-6xl font-black">{result.score.toFixed(2)}</p>
              <p className="text-[10px] text-blue-300 mt-2 font-bold uppercase">Marks Obtained</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 min-w-[200px] border border-white/20 shadow-xl">
              <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-1">Pass Status</p>
              <p className="text-6xl font-black">{isPassed ? 'PASS' : 'FAIL'}</p>
              <p className="text-[10px] text-blue-300 mt-2 font-bold uppercase">Target: 40%</p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <button 
              onClick={downloadDMC}
              className="bg-white text-blue-600 hover:bg-slate-50 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-2xl active:scale-95"
            >
              <FileDown className="w-5 h-5" />
              Download DMC PDF
            </button>
            <button 
              onClick={shareResult}
              className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-2xl border border-white/10 active:scale-95"
            >
              <Share2 className="w-5 h-5" />
              Share result
            </button>
          </div>
        </div>

        <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50/50">
          <div className="bg-white p-5 rounded-2xl text-center border border-slate-100 shadow-sm">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-slate-400 text-[10px] uppercase font-black tracking-tighter">Correct</p>
            <p className="text-2xl font-black text-slate-800">{result.correct}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl text-center border border-slate-100 shadow-sm">
            <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-slate-400 text-[10px] uppercase font-black tracking-tighter">Incorrect</p>
            <p className="text-2xl font-black text-slate-800">{result.wrong}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl text-center border border-slate-100 shadow-sm">
            <MinusCircle className="w-6 h-6 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-400 text-[10px] uppercase font-black tracking-tighter">Skipped</p>
            <p className="text-2xl font-black text-slate-800">{result.unattempted}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl text-center border border-slate-100 shadow-sm">
            <AlertCircle className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <p className="text-slate-400 text-[10px] uppercase font-black tracking-tighter">Attempted</p>
            <p className="text-2xl font-black text-slate-800">{result.attempted}</p>
          </div>
        </div>
      </div>

      {/* Incorrect MCQs Details Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
            Incorrect MCQ Review
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">{wrongQuestions.length} Errors</span>
          </h2>
          <ArrowDown className="w-5 h-5 text-slate-300 animate-bounce" />
        </div>

        {wrongQuestions.length === 0 ? (
          <div className="bg-green-50 border-2 border-green-100 rounded-3xl p-12 text-center">
            <Trophy className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-green-800 mb-2 uppercase">Perfect Execution!</h3>
            <p className="text-green-600 font-medium">You didn't make a single mistake. Incredible job!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {wrongQuestions.map((q) => (
              <div key={q.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-red-200 transition-all hover:shadow-lg">
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Question ID: {q.id} • Category: {q.category}</span>
                  <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded font-black">-0.25 Marks</span>
                </div>
                <div className="p-6">
                  <p className="text-lg font-bold text-slate-800 mb-6 leading-snug">{q.question}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-red-100 bg-red-50/30 flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black text-red-400 uppercase mb-1">Your Selection</p>
                        <p className="text-red-900 font-bold">{q.options[answers[q.id] as number]}</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-green-100 bg-green-50/30 flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black text-green-400 uppercase mb-1">Correct Answer</p>
                        <p className="text-green-900 font-bold">{q.options[q.correctAnswer]}</p>
                      </div>
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
          className="bg-slate-900 hover:bg-black text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center gap-4 mx-auto transition-all shadow-2xl hover:-translate-y-1 active:translate-y-0"
        >
          <RefreshCcw className="w-5 h-5" />
          Exit to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ResultView;
