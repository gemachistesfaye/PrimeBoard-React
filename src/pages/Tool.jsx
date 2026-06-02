import React, { useState, useEffect } from 'react';
import {
  Calculator, BookOpen, Timer, Play, Pause, RefreshCw, Copy, CheckCircle2, Plus, Trash2, BookMarked
} from 'lucide-react';

export default function Tool() {
  // GPA Calculator State
  const [courses, setCourses] = useState([{ name: '', credits: 3, grade: 'A' }]);
  const [gpa, setGpa] = useState(4.0);

  const gradeValues = { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'F': 0.0 };

  const calculateGpa = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach(c => {
      const cr = parseFloat(c.credits) || 0;
      totalPoints += cr * (gradeValues[c.grade] || 0);
      totalCredits += cr;
    });
    setGpa(totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00");
  };

  useEffect(() => { calculateGpa(); }, [courses]);

  // Citation Generator State
  const [citation, setCitation] = useState({ author: '', year: '', title: '', publisher: '' });
  const [generatedCitation, setGeneratedCitation] = useState('');
  const [copied, setCopied] = useState(false);

  const generateCitation = () => {
    const { author, year, title, publisher } = citation;
    if (!author || !title) return;
    const result = `${author}. (${year || 'n.d.'}). *${title}*. ${publisher}.`;
    setGeneratedCitation(result);
  };

  const copyCitation = () => {
    navigator.clipboard.writeText(generatedCitation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Study Timer State (Pomodoro)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('Work'); // Work or Break

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === 'Work') { setMode('Break'); setTimeLeft(5 * 60); }
      else { setMode('Work'); setTimeLeft(25 * 60); }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'Work' ? 25 * 60 : 5 * 60);
  };

  return (
    <div className="text-slate-900 dark:text-slate-200 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200 dark:shadow-none">
          <BookMarked size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Academic Tool</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Essential utilities for students to manage coursework and study time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GPA Calculator */}
        <div className="glass-card rounded-2xl overflow-hidden flex flex-col shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100"><Calculator size={18} className="text-blue-600" /> GPA Calculator</h3>
            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg font-bold text-sm">GPA: {gpa}</div>
          </div>
          <div className="p-5 space-y-4 flex-1">
            {courses.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={c.name} onChange={e => { const nc = [...courses]; nc[i].name = e.target.value; setCourses(nc); }} placeholder="Course Name" className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                <input type="number" step="0.5" value={c.credits} onChange={e => { const nc = [...courses]; nc[i].credits = e.target.value; setCourses(nc); }} placeholder="Cr." className="w-16 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                <select value={c.grade} onChange={e => { const nc = [...courses]; nc[i].grade = e.target.value; setCourses(nc); }} className="w-16 px-2 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer">
                  {Object.keys(gradeValues).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <button onClick={() => setCourses(courses.filter((_, idx) => idx !== i))} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"><Trash2 size={16} /></button>
              </div>
            ))}
            <button onClick={() => setCourses([...courses, { name: '', credits: 3, grade: 'A' }])} className="w-full py-2.5 border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium">
              <Plus size={16} /> Add Course
            </button>
          </div>
        </div>

        {/* Study Timer */}
        <div className="glass-card rounded-2xl overflow-hidden flex flex-col shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100"><Timer size={18} className="text-emerald-600" /> Pomodoro Timer</h3>
            <div className="flex gap-1 bg-slate-200/50 dark:bg-slate-800 p-1 rounded-lg">
              <button onClick={() => { setMode('Work'); setIsActive(false); setTimeLeft(25 * 60); }} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${mode === 'Work' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Work</button>
              <button onClick={() => { setMode('Break'); setIsActive(false); setTimeLeft(5 * 60); }} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${mode === 'Break' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Break</button>
            </div>
          </div>
          <div className="p-8 flex-1 flex flex-col items-center justify-center">
            <div className={`w-48 h-48 rounded-full flex items-center justify-center border-[6px] ${isActive ? (mode === 'Work' ? 'border-emerald-500' : 'border-blue-500') : 'border-slate-100 dark:border-slate-800'} transition-colors duration-500 relative`}>
              <div className={`absolute inset-2 rounded-full border-2 border-dashed ${isActive ? (mode === 'Work' ? 'border-emerald-200 dark:border-emerald-900' : 'border-blue-200 dark:border-blue-900') : 'border-slate-100 dark:border-slate-800'} animate-[spin_10s_linear_infinite] opacity-50`} />
              <span className="text-6xl font-black tracking-tighter text-slate-800 dark:text-white z-10">{formatTime(timeLeft)}</span>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={toggleTimer} className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-105 active:scale-95 ${isActive ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'}`}>
                {isActive ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
              </button>
              <button onClick={resetTimer} className="w-14 h-14 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <RefreshCw size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Citation Generator */}
        <div className="glass-card rounded-2xl overflow-hidden flex flex-col lg:col-span-2 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100"><BookOpen size={18} className="text-amber-600" /> APA Citation Generator</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Author(s)</label>
                <input placeholder="e.g. Smith, J. D." value={citation.author} onChange={e => setCitation({...citation, author: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Publication Year</label>
                <input placeholder="e.g. 2023" value={citation.year} onChange={e => setCitation({ ...citation, year: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Book / Article Title</label>
                <input placeholder="e.g. Principles of Design" value={citation.title} onChange={e => setCitation({ ...citation, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Publisher / Journal Name</label>
                <input placeholder="e.g. Academic Press" value={citation.publisher} onChange={e => setCitation({ ...citation, publisher: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
              </div>
              <button onClick={generateCitation} className="w-full py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-md mt-2">Generate Citation</button>
            </div>
            <div className="bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 bg-amber-500/10 rounded-bl-full -mr-4 -mt-4" />
              <h4 className="text-xs font-bold text-amber-800 dark:text-amber-500 uppercase mb-3">Generated Output</h4>
              <div className="flex-1 text-sm font-serif italic text-slate-800 dark:text-slate-300 bg-white dark:bg-slate-900/80 p-5 rounded-xl border border-amber-100 dark:border-amber-500/20 shadow-inner relative z-10 leading-relaxed min-h-[100px]">{generatedCitation || "Your generated APA citation will appear here."}</div>
              <button disabled={!generatedCitation} onClick={copyCitation} className="mt-4 flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-amber-700 dark:text-slate-300 rounded-xl font-medium text-sm hover:bg-amber-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50">
                {copied ? <CheckCircle2 size={16} className="text-emerald-500"/> : <Copy size={16} />}
                {copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
