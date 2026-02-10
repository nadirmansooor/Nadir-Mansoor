
import React from 'react';
import { Result, Question } from '../types';
import { Trophy, RefreshCcw, AlertCircle, CheckCircle, XCircle, MinusCircle, FileDown, User, Instagram, MessageCircle, BadgeCheck, ArrowRight, HelpCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface ResultViewProps {
  result: Result;
  studentName: string;
  cnic: string;
  profilePicture: string | null;
  questions: Question[];
  answers: Record<number, number | null>;
  onRestart: () => void;
  paperName: string;
  syllabus: string[];
  boardInfo?: string;
}

const ResultView: React.FC<ResultViewProps> = ({ 
  result, 
  studentName, 
  cnic, 
  profilePicture, 
  questions, 
  answers, 
  onRestart, 
  paperName,
  syllabus,
  boardInfo
}) => {
  const isPassed = result.score >= (result.totalQuestions * 0.4); // 40% to pass
  
  const wrongQuestions = questions.filter(q => {
    const userAns = answers[q.id];
    return userAns !== undefined && userAns !== null && userAns !== q.correctAnswer;
  });

  const downloadDMC = () => {
    try {
      const doc = new jsPDF();
      
      // Header Background
      doc.setFillColor(15, 23, 42); // Slate 900
      doc.rect(0, 0, 210, 60, 'F');
      
      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('DETAILED MARK CERTIFICATE', 105, 25, { align: 'center' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('SIR NADIR - PROFESSIONAL ASSESSMENT PORTAL', 105, 35, { align: 'center' });
      doc.text(`EXAMINATION: ${paperName.toUpperCase()}`, 105, 42, { align: 'center' });
      
      // Profile Section
      if (profilePicture) {
        try {
          doc.addImage(profilePicture, 'JPEG', 160, 70, 35, 35);
          doc.setDrawColor(15, 23, 42);
          doc.rect(160, 70, 35, 35);
        } catch (e) { console.error("Profile picture failed in PDF", e); }
      }

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.text('CANDIDATE INFORMATION', 20, 75);
      doc.setLineWidth(0.5);
      doc.line(20, 77, 80, 77);
      
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.text(`Student Name:`, 20, 88);
      doc.setFont('helvetica', 'bold');
      doc.text(studentName.toUpperCase(), 55, 88);
      
      doc.setFont('helvetica', 'normal');
      doc.text(`CNIC Number:`, 20, 96);
      doc.setFont('helvetica', 'bold');
      doc.text(cnic, 55, 96);
      
      doc.setFont('helvetica', 'normal');
      doc.text(`Result Status:`, 20, 104);
      doc.setFont('helvetica', 'bold');
      
      // Fix: Conditional color setting to avoid syntax error
      if (isPassed) {
        doc.setTextColor(22, 101, 52); // Green
      } else {
        doc.setTextColor(153, 27, 27); // Red
      }
      doc.text(isPassed ? 'QUALIFIED / PASSED' : 'NOT QUALIFIED / FAILED', 55, 104);

      // Score Table
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('PERFORMANCE SUMMARY', 105, 125, { align: 'center' });
      
      let rowY = 140;
      const stats = [
        ['Total Questions', result.totalQuestions.toString()],
        ['Attempted Questions', result.attempted.toString()],
        ['Correct Answers (+1)', result.correct.toString()],
        ['Wrong Answers (-0.25)', result.wrong.toString()],
        ['Skipped (Unattempted)', result.unattempted.toString()],
        ['Aggregate Score', result.score.toFixed(2)]
      ];

      stats.forEach((row, i) => {
        doc.setFillColor(i % 2 === 0 ? 248 : 255);
        doc.rect(20, rowY - 6, 170, 12, 'F');
        doc.setFont('helvetica', i === 5 ? 'bold' : 'normal');
        
        // Fix: Use consistent color logic for rows
        if (i === 5) {
          doc.setTextColor(15, 23, 42);
        } else {
          doc.setTextColor(80, 80, 80);
        }
        
        doc.text(row[0], 25, rowY + 2);
        doc.text(row[1], 185, rowY + 2, { align: 'right' });
        rowY += 12;
      });

      // Disclaimer
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text('This is a computer-generated certificate. No physical signature is required.', 105, 220, { align: 'center' });
      doc.text('Verification can be done using the candidate CNIC through the Sir Nadir Portal.', 105, 225, { align: 'center' });

      // Official Stamp Area
      doc.setDrawColor(30, 64, 175);
      doc.setLineWidth(1);
      doc.circle(165, 260, 20);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 64, 175);
      doc.text('OFFICIAL SEAL', 165, 255, { align: 'center' });
      doc.setFontSize(10);
      doc.text('SIR NADIR', 165, 262, { align: 'center' });
      doc.text('VERIFIED', 165, 268, { align: 'center' });

      doc.save(`DMC_${studentName.replace(/\s+/g, '_')}_${cnic}.pdf`);
    } catch (err) { 
      console.error(err);
      alert("Error generating PDF. Please ensure you have a valid profile picture or try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-10 md:p-14 text-center text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-5"><Trophy className="w-64 h-64" /></div>
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-32 rounded-[2.5rem] border-4 border-slate-700 overflow-hidden shadow-2xl bg-slate-800 mb-6 flex items-center justify-center relative group">
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              ) : (
                <User className="w-16 h-16 text-slate-600" />
              )}
              {isPassed && (
                <div className="absolute -bottom-2 -right-2 bg-blue-500 p-2 rounded-full border-4 border-slate-900 shadow-lg">
                  <BadgeCheck className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1 rounded-full mb-3">
               <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Score Card Generated</span>
            </div>
            <h1 className="text-4xl font-black mb-1">{studentName}</h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">{cnic}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 border border-slate-700">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Final Score</p>
              <p className="text-6xl font-black text-blue-400">{result.score.toFixed(2)}</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 border border-slate-700">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Pass Status</p>
              <p className={`text-6xl font-black ${isPassed ? 'text-green-400' : 'text-red-400'}`}>
                {isPassed ? 'PASSED' : 'FAILED'}
              </p>
            </div>
          </div>

          <div className="mt-12">
            <button 
              onClick={downloadDMC} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 mx-auto transition-all shadow-xl shadow-blue-900/20 hover:-translate-y-1 active:scale-95"
            >
              <FileDown className="w-5 h-5" /> Download Digital Certificate (DMC)
            </button>
          </div>
        </div>

        <div className="p-8 md:p-12 grid grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50/50">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4"><CheckCircle className="w-6 h-6" /></div>
            <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Correct</p>
            <p className="text-3xl font-black text-slate-800">{result.correct}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4"><XCircle className="w-6 h-6" /></div>
            <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Wrong</p>
            <p className="text-3xl font-black text-slate-800">{result.wrong}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
            <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mb-4"><MinusCircle className="w-6 h-6" /></div>
            <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Skipped</p>
            <p className="text-3xl font-black text-slate-800">{result.unattempted}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4"><AlertCircle className="w-6 h-6" /></div>
            <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Attempted</p>
            <p className="text-3xl font-black text-slate-800">{result.attempted}</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              Error Analysis <span className="bg-red-100 text-red-600 px-3 py-1 rounded-xl text-sm">{wrongQuestions.length}</span>
            </h2>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Review your mistakes and correct answers below</p>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 px-4 py-2 rounded-xl">
             <HelpCircle className="w-4 h-4 text-amber-600" />
             <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">Marking: +1.00 Correct / -0.25 Wrong</span>
          </div>
        </div>

        {wrongQuestions.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200">
            <Trophy className="w-20 h-20 text-blue-500 mx-auto mb-6" />
            <h3 className="text-3xl font-black text-slate-900 mb-2">Flawless Victory!</h3>
            <p className="text-slate-500 font-bold">You didn't get a single question wrong. Exceptional work!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 px-4">
            {wrongQuestions.map((q, idx) => (
              <div key={q.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden group hover:border-blue-500 transition-all">
                <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question #{(questions.indexOf(q)) + 1} ({q.category})</span>
                  <div className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Penalty: -0.25</div>
                </div>
                <div className="p-8">
                  <h4 className="text-xl font-bold text-slate-900 mb-8 leading-relaxed">{q.question}</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-red-50 border border-red-100 relative">
                       <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-3">Your Selection</p>
                       <p className="text-red-700 font-bold text-lg flex items-center gap-3">
                         <XCircle className="w-5 h-5" />
                         {q.options[answers[q.id] as number]}
                       </p>
                       <div className="absolute top-6 right-6 text-red-200"><XCircle className="w-8 h-8" /></div>
                    </div>
                    <div className="p-6 rounded-2xl bg-green-50 border border-green-100 relative">
                       <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-3">Correct Answer</p>
                       <p className="text-green-700 font-bold text-lg flex items-center gap-3">
                         <CheckCircle className="w-5 h-5" />
                         {q.options[q.correctAnswer]}
                       </p>
                       <div className="absolute top-6 right-6 text-green-200"><CheckCircle className="w-8 h-8" /></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400">Authorized System Verification</h3>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-blue-400 border border-white/10 shadow-inner">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Support WhatsApp</p>
                <p className="text-xl font-bold">03116969288</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-pink-400 border border-white/10 shadow-inner">
                <Instagram className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Official Instagram</p>
                <p className="text-xl font-bold">@nadir__mansoor</p>
              </div>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="font-serif italic text-5xl text-blue-500 font-black mb-1">Sir Nadir</p>
            <div className="h-1 w-64 bg-slate-800 ml-auto mb-3 rounded-full"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Controller of Examinations</p>
          </div>
        </div>
      </div>
      
      <div className="text-center pt-10">
        <button 
          onClick={onRestart} 
          className="bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] flex items-center gap-4 mx-auto transition-all shadow-xl hover:-translate-y-2 active:translate-y-0 group"
        >
          <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" /> Close & Logout
        </button>
      </div>
    </div>
  );
};

export default ResultView;
