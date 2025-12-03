
import React, { useState, useMemo, useEffect } from 'react';
import { User, Exam, UserRole, ToastMessage } from './types';
import { ExamList } from './components/ExamList';
import { UploadModal } from './components/UploadModal';
import { AdminPanel } from './components/AdminPanel';
import { ToastContainer } from './components/Toast';
import { IconSearch, IconLock, IconUser, IconUpload, IconArrowLeft, IconMoon, IconSun } from './components/Icons';

// --- MOCK DATA ---
const MOCK_ADMIN: User = {
  id: 'admin-1',
  username: 'admin',
  password: 'password', 
  role: UserRole.ADMIN,
  isApproved: true,
  karma: 1200
};

const INITIAL_EXAMS: Exam[] = [
  { id: '1', subject: 'Mathematik', teacher: 'Herr Müller', gradeLevel: '10b', date: '2023-11-15', uploaderName: 'Max', fileName: 'mathe_kl1.pdf', fileType: 'pdf', tags: ['analysis', 'schwer', 'klausur'], ratings: { difficultySum: 12, qualitySum: 14, count: 3 }, transcript: 'Integralrechnung Analysis Klausur', isApproved: true, views: 124, downloads: 45 },
  { id: '2', subject: 'Deutsch', teacher: 'Frau Schmidt', gradeLevel: '12', date: '2023-10-20', uploaderName: 'Anna', fileName: 'faust_essay.pdf', fileType: 'pdf', tags: ['faust', 'essay', 'wichtig'], ratings: { difficultySum: 5, qualitySum: 9, count: 2 }, isApproved: true, views: 89, downloads: 12 },
  { id: '3', subject: 'Englisch', teacher: 'Mrs. Jones', gradeLevel: '11a', date: '2024-01-10', uploaderName: 'Tom', fileName: 'vocab_test.jpg', fileType: 'image', fileContent: 'https://images.unsplash.com/photo-1543286386-713df548e9cc?auto=format&fit=crop&q=80&w=400', tags: ['vokabeln', 'test', 'kurz'], ratings: { difficultySum: 4, qualitySum: 15, count: 3 }, transcript: 'Vocabulary Test Unit 3 Environment Pollution', isApproved: true, views: 230, downloads: 67 },
  { id: '4', subject: 'Physik', teacher: 'Herr Wagner', gradeLevel: '13', date: '2023-12-05', uploaderName: 'Lisa', fileName: 'quanten.pdf', fileType: 'pdf', tags: ['quantenmechanik', 'komplex', 'abi'], ratings: { difficultySum: 23, qualitySum: 20, count: 5 }, isApproved: true, views: 56, downloads: 8 },
  { id: '5', subject: 'Geschichte', teacher: 'Herr Weber', gradeLevel: '10a', date: '2024-02-15', uploaderName: 'Kevin', fileName: 'ww2_source.jpg', fileType: 'image', fileContent: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=400', tags: ['2. weltkrieg', 'quellenanalyse'], ratings: { difficultySum: 6, qualitySum: 8, count: 2 }, transcript: 'Rede von Churchill Quellenanalyse', isApproved: true, views: 102, downloads: 33 },
  { id: '6', subject: 'Mathematik', teacher: 'Frau Becker', gradeLevel: '9c', date: '2023-09-12', uploaderName: 'Tim', fileName: 'algebra.pdf', fileType: 'pdf', tags: ['algebra', 'grundlagen'], ratings: { difficultySum: 2, qualitySum: 5, count: 1 }, isApproved: true, views: 45, downloads: 10 },
  { id: '7', subject: 'Biologie', teacher: 'Herr Schulz', gradeLevel: 'GK 11', date: '2023-11-30', uploaderName: 'Sarah', fileName: 'zellen.pdf', fileType: 'pdf', tags: ['cytologie', 'skizzen'], ratings: { difficultySum: 8, qualitySum: 12, count: 3 }, isApproved: true, views: 78, downloads: 22 },
  { id: '8', subject: 'Chemie', teacher: 'Frau Fischer', gradeLevel: 'LK 12', date: '2024-01-20', uploaderName: 'Paul', fileName: 'periodensystem.jpg', fileType: 'image', fileContent: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400', tags: ['pse', 'übersicht'], ratings: { difficultySum: 3, qualitySum: 5, count: 1 }, transcript: 'Periodensystem der Elemente Elemente Gruppen', isApproved: true, views: 156, downloads: 89 },
  { id: '9', subject: 'Informatik', teacher: 'Herr Klein', gradeLevel: '10b', date: '2023-12-12', uploaderName: 'Nerd', fileName: 'java_code.pdf', fileType: 'pdf', tags: ['java', 'programmieren', 'arrays'], ratings: { difficultySum: 16, qualitySum: 16, count: 4 }, isApproved: true, views: 34, downloads: 5 },
  { id: '10', subject: 'Kunst', teacher: 'Frau Kunst', gradeLevel: '5a', date: '2023-10-01', uploaderName: 'Kid', fileName: 'bild.jpg', fileType: 'image', fileContent: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400', tags: ['perspektive', 'zeichnung'], ratings: { difficultySum: 4, qualitySum: 10, count: 2 }, transcript: 'Zentralperspektive Fluchtpunkt', isApproved: true, views: 22, downloads: 3 },
  { id: '11', subject: 'Mathematik', teacher: 'Herr Müller', gradeLevel: '11', date: '2024-01-05', uploaderName: 'Max', fileName: 'analysis.pdf', fileType: 'pdf', tags: ['funktionen', 'ableitungen'], ratings: { difficultySum: 0, qualitySum: 0, count: 0 }, isApproved: true, views: 67, downloads: 14 },
  { id: '12', subject: 'Englisch', teacher: 'Mr. Smith', gradeLevel: '8b', date: '2023-11-22', uploaderName: 'John', fileName: 'grammar.pdf', fileType: 'pdf', tags: ['grammar', 'tenses'], ratings: { difficultySum: 5, qualitySum: 8, count: 2 }, isApproved: true, views: 88, downloads: 20 },
  { id: '13', subject: 'Deutsch', teacher: 'Herr Weber', gradeLevel: '13', date: '2024-02-01', uploaderName: 'Fritz', fileName: 'gedichtanalyse.jpg', fileType: 'image', fileContent: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=400', tags: ['lyrik', 'romantik'], ratings: { difficultySum: 12, qualitySum: 11, count: 3 }, isApproved: true, views: 110, downloads: 40 },
  { id: '14', subject: 'Physik', teacher: 'Frau Meyer', gradeLevel: '10a', date: '2023-11-10', uploaderName: 'Albert', fileName: 'mechanik.pdf', fileType: 'pdf', tags: ['mechanik', 'kraft'], ratings: { difficultySum: 4, qualitySum: 4, count: 1 }, isApproved: true, views: 44, downloads: 9 },
  { id: '15', subject: 'Geschichte', teacher: 'Frau Schmidt', gradeLevel: '9a', date: '2023-10-30', uploaderName: 'Hans', fileName: 'mittelalter.pdf', fileType: 'pdf', tags: ['ritter', 'lehnswesen'], ratings: { difficultySum: 0, qualitySum: 0, count: 0 }, isApproved: true, views: 30, downloads: 2 },
  { id: '16', subject: 'Sport', teacher: 'Herr Fit', gradeLevel: '12', date: '2023-09-20', uploaderName: 'Gym', fileName: 'trainingsplan.pdf', fileType: 'pdf', tags: ['theorie', 'muskeln'], ratings: { difficultySum: 2, qualitySum: 5, count: 1 }, isApproved: true, views: 12, downloads: 1 },
  { id: '17', subject: 'Geografie', teacher: 'Frau Erde', gradeLevel: '7c', date: '2024-01-15', uploaderName: 'Geo', fileName: 'karte.jpg', fileType: 'image', fileContent: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400', tags: ['europa', 'flüsse'], ratings: { difficultySum: 3, qualitySum: 3, count: 1 }, isApproved: true, views: 55, downloads: 11 },
  { id: '18', subject: 'Musik', teacher: 'Herr Ton', gradeLevel: '6b', date: '2023-12-18', uploaderName: 'Mozart', fileName: 'noten.pdf', fileType: 'pdf', tags: ['notenlehre', 'takt'], ratings: { difficultySum: 0, qualitySum: 0, count: 0 }, isApproved: true, views: 25, downloads: 4 },
  { id: '19', subject: 'Mathematik', teacher: 'Herr Wagner', gradeLevel: '13', date: '2024-02-20', uploaderName: 'MathGenius', fileName: 'stochastik.pdf', fileType: 'pdf', tags: ['wahrscheinlichkeit', 'abi'], ratings: { difficultySum: 18, qualitySum: 18, count: 4 }, isApproved: true, views: 90, downloads: 35 },
  { id: '20', subject: 'Religion', teacher: 'Frau Glaube', gradeLevel: '10', date: '2023-11-01', uploaderName: 'Reli', fileName: 'ethik.pdf', fileType: 'pdf', tags: ['ethik', 'moral'], ratings: { difficultySum: 6, qualitySum: 8, count: 2 }, isApproved: true, views: 40, downloads: 8 },
];

type WizardStep = 'subjects' | 'teachers' | 'exams';

const App: React.FC = () => {
  // --- STATE ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([MOCK_ADMIN]);
  const [exams, setExams] = useState<Exam[]>(INITIAL_EXAMS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  
  // UI State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Wizard & Filter State
  const [wizardStep, setWizardStep] = useState<WizardStep>('subjects');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Login Form State
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // --- EFFECT: LOAD FAVORITES & THEME ---
  useEffect(() => {
    const savedFavs = localStorage.getItem('ka_favorites');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    
    const savedTheme = localStorage.getItem('ka_theme');
    if (savedTheme === 'dark') {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
      setDarkMode(!darkMode);
      if (!darkMode) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('ka_theme', 'dark');
      } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('ka_theme', 'light');
      }
  };

  // --- HELPERS ---
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavs = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('ka_favorites', JSON.stringify(newFavs));
      addToast(prev.includes(id) ? 'Aus Favoriten entfernt' : 'Zu Favoriten hinzugefügt', 'success');
      return newFavs;
    });
  };

  // --- ACTION HANDLERS ---
  const handleAddTag = (examId: string, tag: string) => {
    setExams(prev => prev.map(e => {
        if (e.id === examId && !e.tags.includes(tag)) {
            return { ...e, tags: [...e.tags, tag] };
        }
        return e;
    }));
    addToast('Tag hinzugefügt', 'success');
  };

  const handleRateExam = (examId: string, difficulty: number, quality: number) => {
    setExams(prev => prev.map(e => {
        if (e.id === examId) {
            return {
                ...e,
                ratings: {
                    difficultySum: e.ratings.difficultySum + difficulty,
                    qualitySum: e.ratings.qualitySum + quality,
                    count: e.ratings.count + 1
                }
            };
        }
        return e;
    }));
    // Award small karma for rating
    if (currentUser) {
        setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, karma: u.karma + 5 } : u));
        setCurrentUser(prev => prev ? { ...prev, karma: prev.karma + 5 } : null);
    }
    addToast('Bewertung gespeichert (+5 Karma)', 'success');
  };

  const handleReportExam = (examId: string) => {
      setExams(prev => prev.map(e => e.id === examId ? { ...e, isReported: true } : e));
      addToast('Klausur wurde gemeldet.', 'info');
  };

  // Stats Handlers
  const handleViewExam = (examId: string) => {
    setExams(prev => prev.map(e => e.id === examId ? { ...e, views: (e.views || 0) + 1 } : e));
  };

  const handleDownloadExam = (exam: Exam) => {
    setExams(prev => prev.map(e => e.id === exam.id ? { ...e, downloads: (e.downloads || 0) + 1 } : e));
    
    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = exam.fileContent || '#';
    // Use proper extension based on fileType
    const ext = exam.fileType === 'pdf' ? '.pdf' : '.jpg';
    // Clean filename
    const safeName = exam.fileName || `${exam.subject}_${exam.date}${ext}`;
    link.download = safeName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Download gestartet...', 'success');
  };

  // --- AUTH LOGIC ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === usernameInput && u.password === passwordInput);
    if (user) {
      if (!user.isApproved) {
        addToast('Account noch nicht freigeschaltet.', 'error');
      } else {
        setCurrentUser(user);
        addToast(`Willkommen zurück, ${user.username}!`, 'success');
      }
    } else {
      addToast('Ungültige Anmeldedaten.', 'error');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (users.find(u => u.username === usernameInput)) {
      addToast('Benutzername bereits vergeben.', 'error');
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: usernameInput,
      password: passwordInput,
      role: UserRole.USER,
      isApproved: false,
      karma: 0
    };

    setUsers([...users, newUser]);
    addToast('Registrierung erfolgreich! Warten auf Freischaltung.', 'success');
    setLoginMode('login');
    setUsernameInput('');
    setPasswordInput('');
  };

  const logout = () => {
    setCurrentUser(null);
    setWizardStep('subjects');
    setSelectedSubject(null);
    setSelectedTeacher(null);
    setSearchQuery('');
    addToast('Erfolgreich abgemeldet.', 'info');
  };

  // --- ADMIN LOGIC ---
  const handleApproveUser = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, isApproved: true } : u));
    addToast('Benutzer freigeschaltet.', 'success');
  };

  const handleApproveExam = (examId: string) => {
    setExams(exams.map(e => e.id === examId ? { ...e, isApproved: true } : e));
    addToast('Klausur freigegeben.', 'success');
  };

  const handleDeleteExam = (examId: string) => {
    setExams(exams.filter(e => e.id !== examId));
    addToast('Klausur gelöscht.', 'info');
  };

  const handleClearReport = (examId: string) => {
      setExams(exams.map(e => e.id === examId ? { ...e, isReported: false } : e));
      addToast('Meldung entfernt.', 'success');
  };

  // --- DATA LOGIC ---
  const handleUpload = (examData: Omit<Exam, 'id' | 'uploaderName' | 'isApproved'>) => {
    if (!currentUser) return;
    
    // Admins get instant approval, normal users need approval
    const isAutoApproved = currentUser.role === UserRole.ADMIN;

    const newExam: Exam = {
      ...examData,
      id: Math.random().toString(36).substr(2, 9),
      uploaderName: currentUser.username,
      isApproved: isAutoApproved,
      views: 0,
      downloads: 0
    };
    setExams([newExam, ...exams]);
    
    // Karma
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, karma: u.karma + 50 } : u));
    setCurrentUser(prev => prev ? { ...prev, karma: prev.karma + 50 } : null);

    if (isAutoApproved) {
        addToast('Klausur erfolgreich hochgeladen! (+50 Karma)', 'success');
    } else {
        addToast('Klausur hochgeladen! Warte auf Freigabe durch Admin. (+50 Karma)', 'info');
    }
  };

  // --- WIZARD FILTER LOGIC ---
  // Only show APPROVED exams to the public (unless Admin Panel, which accesses `exams` state directly)
  const publicExams = useMemo(() => exams.filter(e => e.isApproved), [exams]);

  const uniqueSubjects = useMemo(() => Array.from(new Set(publicExams.map(e => e.subject))).sort(), [publicExams]);
  
  const availableTeachers = useMemo(() => {
    if (!selectedSubject) return [];
    return Array.from(new Set(publicExams.filter(e => e.subject === selectedSubject).map(e => e.teacher))).sort();
  }, [publicExams, selectedSubject]);

  const filteredExams = useMemo(() => {
    // If global search is active
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return publicExams.filter(exam => 
            exam.subject.toLowerCase().includes(query) || 
            exam.teacher.toLowerCase().includes(query) ||
            exam.tags.some(t => t.toLowerCase().includes(query)) ||
            (exam.transcript && exam.transcript.toLowerCase().includes(query))
        );
    }

    return publicExams.filter(exam => 
      (!selectedSubject || exam.subject === selectedSubject) &&
      (!selectedTeacher || exam.teacher === selectedTeacher)
    );
  }, [publicExams, selectedSubject, selectedTeacher, searchQuery]);

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setWizardStep('teachers');
  };

  const handleTeacherSelect = (teacher: string) => {
    setSelectedTeacher(teacher);
    setWizardStep('exams');
  };

  const resetSelection = () => {
    setWizardStep('subjects');
    setSelectedSubject(null);
    setSelectedTeacher(null);
    setSearchQuery('');
  };

  const goBack = () => {
    if (searchQuery) {
        setSearchQuery('');
        return;
    }

    if (wizardStep === 'exams') {
        setWizardStep('teachers');
        setSelectedTeacher(null);
    } else if (wizardStep === 'teachers') {
        setWizardStep('subjects');
        setSelectedSubject(null);
    }
  };


  // --- RENDER: LOGIN ---
  if (!currentUser) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${darkMode ? 'bg-dark-bg' : 'bg-slate-50'}`}>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        
        <button 
            onClick={toggleDarkMode}
            className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm"
        >
            {darkMode ? <IconSun className="w-5 h-5" /> : <IconMoon className="w-5 h-5" />}
        </button>

        <div className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-xl w-full max-w-md animate-fade-in border border-slate-100 dark:border-dark-border">
          <div className="flex justify-center mb-6">
            <div className="bg-brand-50 dark:bg-brand-900/30 p-4 rounded-full shadow-inner">
              <IconLock className="w-8 h-8 text-brand-600 dark:text-brand-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-2 tracking-tight">KlausurArchiv AI</h1>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-8 font-medium">
            {loginMode === 'login' ? 'Willkommen zurück' : 'Konto erstellen'}
          </p>

          <form onSubmit={loginMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1 ml-1">Benutzername</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all dark:text-white"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1 ml-1">Passwort</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all dark:text-white"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
            </div>

            <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-0.5 mt-2">
              {loginMode === 'login' ? 'Anmelden' : 'Registrieren'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            {loginMode === 'login' ? (
              <>
                Noch kein Konto?{' '}
                <button onClick={() => { setLoginMode('register'); }} className="text-brand-600 dark:text-brand-400 font-bold hover:underline">
                  Jetzt registrieren
                </button>
              </>
            ) : (
              <>
                Bereits registriert?{' '}
                <button onClick={() => { setLoginMode('login'); }} className="text-brand-600 dark:text-brand-400 font-bold hover:underline">
                  Anmelden
                </button>
              </>
            )}
          </div>
           {loginMode === 'login' && (
              <div className="mt-6 text-center text-xs text-slate-300 dark:text-slate-600">
                Demo: admin / password
              </div>
            )}
        </div>
      </div>
    );
  }

  // --- RENDER: MAIN APP ---
  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg transition-colors duration-300`}>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Navbar */}
      <header className="bg-white dark:bg-dark-card border-b border-slate-200 dark:border-dark-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={resetSelection}>
            <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold shadow-brand-500/30 shadow-lg">K</div>
            <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight hidden md:block">KlausurArchiv</span>
          </div>
            
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 relative hidden sm:block">
             <input 
                type="text" 
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full px-4 py-2 pl-10 text-sm focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
                placeholder="Suche nach Fach, Lehrer, Inhalt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
             <IconSearch className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>

          <div className="flex items-center gap-3">
             <button onClick={toggleDarkMode} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                {darkMode ? <IconSun className="w-5 h-5" /> : <IconMoon className="w-5 h-5" />}
             </button>

             {currentUser.role === UserRole.ADMIN && (
                <button
                  onClick={() => setShowAdminPanel(true)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Admin
                </button>
              )}
              
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg shadow-md shadow-brand-500/20 transition-all hover:scale-105 active:scale-95 text-sm font-bold"
              >
                <IconUpload className="w-4 h-4" />
                <span className="hidden sm:inline">Upload</span>
              </button>

              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
              
              <div className="flex items-center gap-2 group cursor-pointer relative" onClick={logout}>
                 <div className="flex flex-col items-end mr-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{currentUser.username}</span>
                    <span className="text-[10px] text-brand-600 dark:text-brand-400 font-mono">{currentUser.karma} KP</span>
                 </div>
                 <div className="w-8 h-8 bg-brand-50 dark:bg-brand-900/40 rounded-full flex items-center justify-center text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-800">
                   <IconUser className="w-5 h-5" />
                 </div>
              </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation / Breadcrumb */}
        <div className="mb-8 flex items-center gap-4 animate-fade-in">
           {(wizardStep !== 'subjects' || searchQuery) && (
             <button onClick={goBack} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
               <IconArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
             </button>
           )}
           <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {searchQuery ? `Suchergebnisse für "${searchQuery}"` : (
                    <>
                        {wizardStep === 'subjects' && 'Wähle dein Fach'}
                        {wizardStep === 'teachers' && `Lehrer für ${selectedSubject}`}
                        {wizardStep === 'exams' && `${selectedSubject} bei ${selectedTeacher}`}
                    </>
                )}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {searchQuery ? `${filteredExams.length} Treffer gefunden.` : (
                    <>
                        {wizardStep === 'subjects' && 'Entdecke Altklausuren aus verschiedenen Bereichen.'}
                        {wizardStep === 'teachers' && 'Wähle den Lehrer, bei dem du die Klausur schreibst.'}
                        {wizardStep === 'exams' && `${filteredExams.length} Dokumente gefunden.`}
                    </>
                )}
              </p>
           </div>
        </div>

        {/* --- SEARCH RESULT VIEW (Overrides Wizard) --- */}
        {searchQuery && (
             <ExamList 
                exams={filteredExams} 
                favorites={favorites}
                currentUser={currentUser}
                onToggleFavorite={toggleFavorite}
                onAddTag={handleAddTag}
                onRateExam={handleRateExam}
                onReportExam={handleReportExam}
                onViewExam={handleViewExam}
                onDownloadExam={handleDownloadExam}
            />
        )}

        {/* --- STEP 1: SUBJECTS --- */}
        {!searchQuery && wizardStep === 'subjects' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-slide-up">
            {uniqueSubjects.map(subject => (
              <button
                key={subject}
                onClick={() => handleSubjectSelect(subject)}
                className="group flex flex-col items-center justify-center p-6 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-200 h-32"
              >
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors text-slate-400 dark:text-slate-500 font-bold text-lg">
                  {subject.charAt(0)}
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-brand-700 dark:group-hover:text-brand-400">{subject}</span>
              </button>
            ))}
          </div>
        )}

        {/* --- STEP 2: TEACHERS --- */}
        {!searchQuery && wizardStep === 'teachers' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-slide-up">
            {availableTeachers.map(teacher => (
              <button
                key={teacher}
                onClick={() => handleTeacherSelect(teacher)}
                className="flex items-center gap-4 p-5 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all text-left group"
              >
                <div className="bg-brand-100 dark:bg-brand-900/40 p-3 rounded-full text-brand-600 dark:text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <IconUser className="w-5 h-5" />
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-700 dark:group-hover:text-brand-400">{teacher}</span>
              </button>
            ))}
          </div>
        )}

        {/* --- STEP 3: EXAMS --- */}
        {!searchQuery && wizardStep === 'exams' && (
          <ExamList 
            exams={filteredExams} 
            favorites={favorites}
            currentUser={currentUser}
            onToggleFavorite={toggleFavorite}
            onAddTag={handleAddTag}
            onRateExam={handleRateExam}
            onReportExam={handleReportExam}
            onViewExam={handleViewExam}
            onDownloadExam={handleDownloadExam}
          />
        )}

      </main>

      {/* Modals */}
      {showUploadModal && (
        <UploadModal 
          onClose={() => setShowUploadModal(false)} 
          onUpload={handleUpload} 
        />
      )}
      
      {showAdminPanel && currentUser.role === UserRole.ADMIN && (
        <AdminPanel 
          users={users} 
          exams={exams}
          onApprove={handleApproveUser} 
          onApproveExam={handleApproveExam}
          onDeleteExam={handleDeleteExam}
          onClearReport={handleClearReport}
          onClose={() => setShowAdminPanel(false)} 
        />
      )}
    </div>
  );
};

export default App;
