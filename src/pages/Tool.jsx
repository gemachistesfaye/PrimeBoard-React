import React, { useState, useEffect } from 'react';
import {
  Calculator, BookOpen, Timer, Play, Pause, RefreshCw, Copy, CheckCircle2, Plus, Trash2, BookMarked,
  PenTool, List, Clock, TextQuote, ClipboardList, MessageSquare, Sun, Moon
} from 'lucide-react';

export default function Tool() {
  // ---------- Tool selection ----------
  const toolOptions = [
    { key: 'gpa', label: 'GPA Calculator', icon: Calculator },
    { key: 'timer', label: 'Pomodoro Timer', icon: Timer },
    { key: 'citation', label: 'Citation Generator', icon: BookOpen },
    { key: 'words', label: 'Word Counter', icon: PenTool },
    { key: 'todo', label: 'To‑Do List', icon: List },
    { key: 'quote', label: 'Random Quote', icon: MessageSquare },
  ];
  const [selectedTool, setSelectedTool] = useState('gpa');

  // ---------- Theme toggle for tool ----------
  const [toolTheme, setToolTheme] = useState('light');
  const toggleToolTheme = () => {
    const newTheme = toolTheme === 'light' ? 'dark' : 'light';
    setToolTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // ---------- GPA Calculator ----------
  const [courses, setCourses] = useState([{ name: '', credits: 3, score: '' }]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [gpa, setGpa] = useState(4.0);
  const gradeValues = { 'A+': 4.3, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0 };
  const getPointFromScore = (score) => {
    const s = parseFloat(score);
    if (s >= 90) return 4.0; // A+
    if (s >= 85) return 4.0; // A
    if (s >= 80) return 3.75; // A-
    // ... other logic unchanged ...
    return 0;
  };

  // ---------- Word Counter extra stats ----------
  const [charCount, setCharCount] = useState(0);
  const [longestWord, setLongestWord] = useState('');
  const [readability, setReadability] = useState(0);

  const updateWordStats = (txt) => {
    setCharCount(txt.length);
    const wordsArray = txt.trim().split(/\s+/).filter(w => w);
    const longest = wordsArray.reduce((a, b) => (b.length > a.length ? b : a), '');
    setLongestWord(longest);
    const wordCount = wordsArray.length;
    const sentences = txt.split(/[.!?]+/).filter(s => s.trim()).length || 1;
    const avgWordsPerSentence = wordCount / sentences;
    // Simple readability (Flesch‑Kincaid) approximation
    const score = Math.round(206.835 - 1.015 * avgWordsPerSentence - 84.6 * (wordCount / (wordCount || 1)) * 10) / 10;
    setReadability(score);
  };


  const calculateGpa = () => {
    const newErrors = {};
    let totalPoints = 0;
    let totalCredits = 0;
    let hasFail = false;
    courses.forEach((c, idx) => {
      const fieldErrors = { name: '', score: '' };
      if (!c.name || c.name.trim() === '') {
        fieldErrors.name = 'Enter course name';
      }
      if (c.score === '' || c.score === null || c.score === undefined) {
        fieldErrors.score = 'Enter score';
      }
      if (fieldErrors.name || fieldErrors.score) {
        newErrors[idx] = fieldErrors;
        return; // skip calculation for this row
      }
      const cr = parseFloat(c.credits) || 0;
      const pts = getPointFromScore(c.score);
      if (pts === 0) hasFail = true;
      totalPoints += cr * pts;
      totalCredits += cr;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const msgs = Object.entries(newErrors)
        .map(([idx, err]) => {
          const parts = [];
          if (err.name) parts.push(`Row ${parseInt(idx) + 1}: ${err.name}`);
          if (err.score) parts.push(`Row ${parseInt(idx) + 1}: ${err.score}`);
          return parts.join(' ');
        })
        .join('\n');
      setModalMessage(msgs);
      setShowErrorModal(true);
      setGpa('');
      return;
    }
    if (hasFail) setGpa('NG');
    else setGpa(totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00');
  };

  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('Work'); // Work | Break

  useEffect(() => {
    if (mode === 'Work') setTimeLeft(workDuration * 60);
    else setTimeLeft(breakDuration * 60);
  }, [workDuration, breakDuration, mode]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === 'Work') { setMode('Break'); setTimeLeft(breakDuration * 60); }
      else { setMode('Work'); setTimeLeft(workDuration * 60); }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, workDuration, breakDuration]);

  const formatTime = seconds => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };
  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft((mode === 'Work' ? workDuration : breakDuration) * 60);
  };

  // ---------- Citation Generator ----------
  const citationStyles = ['APA III', 'MLA', 'Chicago', 'Harvard', 'IEEE'];
  const [selectedStyle, setSelectedStyle] = useState(citationStyles[0]);
  const [citation, setCitation] = useState({ author: '', year: '', title: '', publisher: '' });
  const [generatedCitation, setGeneratedCitation] = useState('');
  const [copied, setCopied] = useState(false);
  const generateCitation = () => {
    const { author, year, title, publisher } = citation;
    if (!author || !title) return;
    const stylesMap = {
      'APA III': `${author}. (${year || 'n.d.'}). *${title}*. ${publisher}.`,
      'MLA': `${author}. "${title}." ${publisher}, ${year || 'n.d.'}.`,
      'Chicago': `${author}. ${year || 'n.d.'}. "${title}." ${publisher}.`,
      'Harvard': `${author} (${year || 'n.d.'}) ${title}. ${publisher}.`,
      'IEEE': `${author}, "${title}," ${publisher}, ${year || 'n.d.'}.`
    };
    setGeneratedCitation(stylesMap[selectedStyle] || stylesMap['APA III']);
  };
  const copyCitation = () => {
    navigator.clipboard.writeText(generatedCitation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ---------- Word Counter & Reading Time ----------
  const [text, setText] = useState('');
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const WPM = 200;
  const estimatedMinutes = Math.ceil(wordCount / WPM);

  // ---------- Effect to update stats when text changes ----------
  useEffect(() => {
    updateWordStats(text);
  }, [text]);

  // ---------- Download report ----------
  const downloadReport = () => {
    const report = {
      words: wordCount,
      characters: charCount,
      longestWord,
      readability,
      estimatedReadingTime: estimatedMinutes,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'word-report.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------- To‑Do List ----------
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo.trim() }]);
      setNewTodo('');
    }
  };
  const removeTodo = id => setTodos(todos.filter(t => t.id !== id));

  // ---------- Random Quote Generator (new tool) ----------
  const quotes = [
    "The only limit to our realization of tomorrow is our doubts of today. – Franklin D. Roosevelt",
    "Education is the most powerful weapon which you can use to change the world. – Nelson Mandela",
    "Live as if you were to die tomorrow. Learn as if you were to live forever. – Mahatma Gandhi",
    "The beautiful thing about learning is that nobody can take it away from you. – B.B. King",
    "Your time is limited, don't waste it living someone else's life. – Steve Jobs",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
    "In the middle of difficulty lies opportunity. – Albert Einstein",
    "The future belongs to those who believe in the beauty of their dreams. – Eleanor Roosevelt",
    "What we think, we become. – Buddha",
    "Do not wait to strike till the iron is hot; but make it hot by striking. – William Butler Yeats",
    "The best way to predict the future is to invent it. – Alan Kay",
    "You miss 100% of the shots you don’t take. – Wayne Gretzky",
    "The journey of a thousand miles begins with one step. – Lao Tzu",
    "Believe you can and you're halfway there. – Theodore Roosevelt",
    "Hard work beats talent when talent doesn't work hard. – Tim Notke",
    "Dream big and dare to fail. – Norman Vaughan",
    "The only way to do great work is to love what you do. – Steve Jobs",
    "Stay hungry, stay foolish. – Steve Jobs",
    "Your limitation—it's only your imagination.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it.",
    "Success doesn’t just find you. You have to go out and get it.",
    "Don’t stop when you’re tired. Stop when you’re done.",
    "Wake up with determination. Go to bed with satisfaction.",
    "Do something today that your future self will thank you for.",
    "Little things make big days.",
    "It’s going to be hard, but hard does not mean impossible.",
    "Don’t wait for opportunity. Create it.",
    "Sometimes we’re tested not to show our weaknesses, but to discover our strengths.",
    "The key to success is to focus on goals, not obstacles.",
    "Dream big, work hard, stay focused, and surround yourself with good people.",
    "Your passion is waiting for your courage to catch up.",
    "Don’t be afraid to give up the good to go for the great.",
    "The secret of getting ahead is getting started.",
    "A river cuts through rock not because of its power, but because of its persistence.",
    "Hard work beats talent when talent doesn’t work hard.",
    "Everything you’ve ever wanted is on the other side of fear.",
    "You don’t have to be great to start, but you have to start to be great.",
    "The best revenge is massive success.",
    "Your life does not get better by chance, it gets better by change.",
    "Do what you can, with what you have, where you are.",
    "The only limit to your impact is your imagination and commitment.",
    "Never give up on a dream just because of the time it will take to accomplish it. The time will pass anyway.",
    "What seems to us as bitter trials are often blessings in disguise.",
    "If something is worth doing at all, it will have at least one small problem that you can work through.",
    "When you feel like quitting, think about why you started.",
    "If you’re going through hell, keep moving…"
  ];
  const [currentQuote, setCurrentQuote] = useState('');
  const generateQuote = () => {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(random);
  };

  // ---------- Render sections based on selected tool ----------
  const renderTool = () => {
    switch (selectedTool) {
      case 'gpa':
        return (
          <div className="glass-card rounded-2xl overflow-hidden flex flex-col shadow-sm border border-slate-200 dark:border-slate-800 lg:col-span-2">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100"><Calculator size={18} className="text-blue-600" /> GPA Calculator</h3>
              <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg font-bold text-sm">GPA: {gpa}</div>
              {showErrorModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg max-w-md w-full">
                    <h3 className="text-lg font-bold mb-2 text-red-600">Error</h3>
                    <pre className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200">{modalMessage}</pre>
                    <button
                      onClick={() => setShowErrorModal(false)}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="p-5 space-y-4 flex-1">
              {courses.map((c, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 p-2 rounded-lg">
                  <input value={c.name} onChange={e => { const nc = [...courses]; nc[i].name = e.target.value; setCourses(nc); }} placeholder="Course Name" className="flex-1 px-4 py-2 text-base rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />

                  <input type="number" placeholder="Score" value={c.score} onChange={e => { const nc = [...courses]; nc[i].score = e.target.value; setCourses(nc); }} className="w-24 px-2 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                  <select value={c.credits} onChange={e => { const nc = [...courses]; nc[i].credits = e.target.value; setCourses(nc); }} className="w-16 px-2 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all">
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>

                  <span className="ml-2 text-sm text-slate-600">{(c.credits * getPointFromScore(c.score)).toFixed(2)} pts</span>

                  <button onClick={() => setCourses(courses.filter((_, idx) => idx !== i))} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"><Trash2 size={16} /></button>
                </div>
              ))}
              <div className="flex gap-2">
                <button onClick={() => setCourses([...courses, { name: '', credits: 3, score: '' }])} className="flex-1 py-2.5 border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-500 transition-colors text-sm font-medium">
                  <Plus size={16} /> Add Course
                </button>
                <button onClick={calculateGpa} className="flex-1 py-2.5 border border-dashed border-slate-300 dark:border-slate-600 bg-indigo-100 dark:bg-indigo-600 text-indigo-600 dark:text-white rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-200 dark:hover:bg-indigo-500 transition-colors text-sm font-medium">
                  Calculate GPA
                </button>
              </div>
            </div>
          </div>
        );
      case 'timer':
        return (
          <div className="glass-card rounded-2xl overflow-hidden flex flex-col shadow-sm border border-slate-200 dark:border-slate-800 lg:col-span-2 w-full">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100"><Timer size={18} className="text-emerald-600" /> Pomodoro Timer</h3>
              <div className="flex gap-1 bg-slate-200/50 dark:bg-slate-800 p-1 rounded-lg">
                <button onClick={() => { setMode('Work'); setIsActive(false); setTimeLeft(workDuration * 60); }} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${mode === 'Work' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Work</button>
                <button onClick={() => { setMode('Break'); setIsActive(false); setTimeLeft(breakDuration * 60); }} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${mode === 'Break' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Break</button>
              </div>
            </div>
            <div className="py-8 px-6 flex flex-col md:flex-row items-center gap-8">
              {/* Duration inputs */}
              <div className="flex md:flex-col gap-3 md:w-40 shrink-0">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Work (min)</label>
                  <input type="number" min="1" value={workDuration} onChange={e => setWorkDuration(parseInt(e.target.value) || 1)} className="w-full px-2 py-1 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Break (min)</label>
                  <input type="number" min="1" value={breakDuration} onChange={e => setBreakDuration(parseInt(e.target.value) || 1)} className="w-full px-2 py-1 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
                </div>
              </div>
              {/* Timer circle */}
              <div className="flex-1 flex items-center justify-center">
                <div className={`w-44 h-44 rounded-full flex items-center justify-center border-[6px] ${isActive ? (mode === 'Work' ? 'border-emerald-500' : 'border-blue-500') : 'border-slate-100 dark:border-slate-800'} transition-colors duration-500 relative`}>
                  <div className={`absolute inset-2 rounded-full border-2 border-dashed ${isActive ? (mode === 'Work' ? 'border-emerald-200 dark:border-emerald-900' : 'border-blue-200 dark:border-blue-900') : 'border-slate-100 dark:border-slate-800'} animate-[spin_10s_linear_infinite] opacity-50`} />
                  <span className="text-5xl font-black tracking-tighter text-slate-800 dark:text-white z-10">{formatTime(timeLeft)}</span>
                </div>
              </div>
              {/* Controls */}
              <div className="flex md:flex-col gap-3 md:w-40 shrink-0 items-center justify-center">
                <button onClick={toggleTimer} className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-105 active:scale-95 ${isActive ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'}`}>
                  {isActive ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                </button>
                <button onClick={resetTimer} className="w-14 h-14 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <RefreshCw size={20} />
                </button>
              </div>
            </div>
          </div>
        );
      case 'citation':
        return (
          <div className="glass-card rounded-2xl overflow-hidden flex flex-col lg:col-span-2 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100"><BookOpen size={18} className="text-amber-600" /> Citation Generator</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Author(s)</label>
                  <input placeholder="e.g. Smith, J. D." value={citation.author} onChange={e => setCitation({ ...citation, author: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Year</label>
                  <input placeholder="2023" value={citation.year} onChange={e => setCitation({ ...citation, year: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Title</label>
                  <input placeholder="Principles of Design" value={citation.title} onChange={e => setCitation({ ...citation, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Publisher / Journal</label>
                  <input placeholder="Academic Press" value={citation.publisher} onChange={e => setCitation({ ...citation, publisher: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Style</label>
                  <select value={selectedStyle} onChange={e => setSelectedStyle(e.target.value)} className="w-full px-2 py-1 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    {citationStyles.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <button onClick={generateCitation} className="w-full py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-md mt-2">Generate Citation</button>
              </div>
              <div className="bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 bg-amber-500/10 rounded-bl-full -mr-4 -mt-4" />
                <h4 className="text-xs font-bold text-amber-800 dark:text-amber-500 uppercase mb-3">Generated Output</h4>
                <div className="flex-1 text-sm font-serif italic text-slate-800 dark:text-slate-300 bg-white dark:bg-slate-900/80 p-5 rounded-xl border border-amber-100 dark:border-amber-500/20 shadow-inner relative z-10 leading-relaxed min-h-[40px]">{generatedCitation || 'Your generated citation will appear here.'}</div>
                <button disabled={!generatedCitation} onClick={copyCitation} className="mt-4 flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-amber-700 dark:text-slate-300 rounded-xl font-medium text-sm hover:bg-amber-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50">
                  {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
              </div>
            </div>
          </div>
        );
      case 'words':
        return (
          <div className="glass-card rounded-2xl overflow-hidden flex flex-col shadow-sm border border-slate-200 dark:border-slate-800 lg:col-span-2">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100"><PenTool size={18} className="text-purple-600" /> Word Counter & Reading Time</h3>
            </div>
<div className="p-5 space-y-2">
  <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste your text here..." spellCheck="true" autoCorrect="on" className="w-full h-32 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
    <span>Words: {wordCount}</span>
    <span>Characters: {charCount}</span>
    <span>Longest word: {longestWord || '—'}</span>
    <span>Readability: {readability}</span>
    <span>Est. reading time: {estimatedMinutes} min</span>
  </div>
  <button onClick={downloadReport} className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">Download Report</button>
</div>
          </div>
        );
      case 'todo':
        return (
          <div className="glass-card rounded-2xl overflow-hidden flex flex-col shadow-sm border border-slate-200 dark:border-slate-800 lg:col-span-2">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100"><List size={18} className="text-indigo-600" /> To‑Do List</h3>
            </div>
            <div className="p-5">
              <div className="flex gap-2 mb-3">
                <input value={newTodo} onChange={e => setNewTodo(e.target.value)} placeholder="New task" className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                <button onClick={addTodo} className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"><Plus size={16} /></button>
              </div>
              <ul className="space-y-2">
                {todos.map(t => (
                  <li key={t.id} className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-2 rounded-xl">
                    <span className="text-sm text-slate-800 dark:text-slate-200">{t.text}</span>
                    <button onClick={() => removeTodo(t.id)} className="text-slate-400 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
               {/* Course grades summary */}
               <div className="mt-4">
                 <h3 className="font-semibold text-lg mb-2">Course Grades</h3>
                 <ul className="list-disc pl-5 space-y-1">
                   {courses.map((c, i) => (
                     <li key={i}>{c.name || `Course ${i + 1}`}: {c.score ? `${getPointFromScore(c.score).toFixed(2)} pts` : 'N/A'}</li>
                   ))}
                 </ul>
                 <div className="mt-2 font-bold">Total GPA: {gpa}</div>
               </div>
              </ul>
            </div>
          </div>
        );
      case 'quote':
        return (
          <div className="glass-card rounded-2xl overflow-hidden flex flex-col shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100"><MessageSquare size={18} className="text-green-600" /> Random Quote</h3>
            </div>
            <div className="p-5 flex flex-col items-center">
              <button onClick={generateQuote} className="mb-4 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">Generate Quote</button>
              {currentQuote && (
                <blockquote className="italic text-center text-slate-800 dark:text-slate-200 border-l-4 border-green-600 pl-4">{currentQuote}</blockquote>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="text-slate-900 dark:text-slate-200 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="mb-8 flex items-center gap-3 justify-between">
  <div className="flex items-center gap-3">
    <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200 dark:shadow-none">
      <BookMarked size={24} />
    </div>
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Student Toolkit</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-1">Select a tool from the menu below.</p>
    </div>
  </div>
  <button onClick={toggleToolTheme} className="flex items-center gap-1 text-sm px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded">
    {toolTheme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    {toolTheme === 'light' ? 'Dark' : 'Light'}
  </button>
</div>
      </div>

      {/* Tool selector dropdown */}
      <div className="mb-6 max-w-sm">
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Choose Tool</label>
        <select value={selectedTool} onChange={e => setSelectedTool(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all">
          {toolOptions.map(opt => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Render selected tool */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderTool()}
      </div>
    </div>
  );
}
