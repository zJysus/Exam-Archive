
import React, { useState } from 'react';
import { Exam, User } from '../types';
import { IconX, IconFileText, IconImage, IconTag, IconPlus, IconStar, IconBarChart, IconFlag } from './Icons';

interface ExamPreviewModalProps {
  exam: Exam;
  currentUser: User;
  onClose: () => void;
  onDownload: (exam: Exam) => void;
  onAddTag: (examId: string, tag: string) => void;
  onRateExam: (examId: string, difficulty: number, quality: number) => void;
  onReportExam: (examId: string) => void;
}

export const ExamPreviewModal: React.FC<ExamPreviewModalProps> = ({ exam, currentUser, onClose, onDownload, onAddTag, onRateExam, onReportExam }) => {
  // Tagging & Rating
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [userQuality, setUserQuality] = useState(0);
  const [userDifficulty, setUserDifficulty] = useState(0);
  const [rated, setRated] = useState(false);
  const [reported, setReported] = useState(exam.isReported || false);
  
  const handleAddTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim()) {
        onAddTag(exam.id, newTag.trim());
        setNewTag('');
        setIsAddingTag(false);
    }
  };

  const handleSubmitRating = () => {
    if (userQuality > 0 && userDifficulty > 0) {
        onRateExam(exam.id, userDifficulty, userQuality);
        setRated(true);
    }
  };

  const handleReport = () => {
      onReportExam(exam.id);
      setReported(true);
  };

  // Calculate averages
  const avgQuality = exam.ratings.count > 0 ? (exam.ratings.qualitySum / exam.ratings.count).toFixed(1) : '—';
  const avgDifficulty = exam.ratings.count > 0 ? (exam.ratings.difficultySum / exam.ratings.count).toFixed(1) : '—';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side: Preview / Content Area (65%) */}
        <div className="w-full md:w-[65%] bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-dark-border relative flex flex-col h-full">
            {/* Header for Mobile */}
            <div className="absolute top-4 right-4 z-10 md:hidden">
               <button onClick={onClose} className="p-2 bg-white/90 rounded-full shadow-sm text-slate-600">
                  <IconX className="w-5 h-5" />
               </button>
            </div>
            
            <div className="h-full flex items-center justify-center p-6">
                 {exam.fileType === 'image' ? (
                    exam.fileContent ? (
                        <img src={exam.fileContent} alt="Preview" className="max-w-full max-h-full object-contain shadow-md rounded-sm" />
                    ) : (
                        <div className="text-center text-slate-400 dark:text-slate-600">
                        <IconImage className="w-20 h-20 mx-auto mb-4 opacity-50" />
                        <p>Bildvorschau nicht verfügbar (Mock)</p>
                        </div>
                    )
                ) : (
                    <div className="w-full max-w-[400px] aspect-[1/1.4] bg-white dark:bg-slate-800 shadow-xl flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 border border-slate-200 dark:border-dark-border">
                        <IconFileText className="w-24 h-24 mb-4" />
                        <p className="text-xl font-medium text-slate-500 dark:text-slate-400">PDF Vorschau</p>
                    </div>
                )}
            </div>
        </div>

        {/* Right Side: Details & Interaction (35%) */}
        <div className="hidden md:flex w-[35%] flex-col bg-white dark:bg-dark-card h-full border-l border-slate-100 dark:border-dark-border">
            <div className="p-6 border-b border-slate-100 dark:border-dark-border flex justify-between items-start">
               <div>
                 <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        {exam.gradeLevel}
                    </span>
                    <span className="text-slate-400 text-xs">{new Date(exam.date).toLocaleDateString('de-DE')}</span>
                 </div>
                 <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-1">{exam.subject}</h2>
                 <p className="text-slate-500 dark:text-slate-400">bei <span className="font-semibold text-slate-700 dark:text-slate-200">{exam.teacher}</span></p>
               </div>
               <div className="flex gap-2">
                    <button 
                        onClick={handleReport} 
                        className={`p-2 rounded-full transition-colors ${reported ? 'text-red-500 bg-red-50' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'}`}
                        title="Klausur melden"
                        disabled={reported}
                    >
                        <IconFlag className="w-5 h-5" filled={reported} />
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <IconX className="w-6 h-6 text-slate-400" />
                    </button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* Stats Section */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-1">
                            <IconStar className="w-4 h-4 text-yellow-400" filled />
                            Qualität
                        </div>
                        <div className="text-2xl font-bold text-slate-800 dark:text-white">{avgQuality} <span className="text-sm text-slate-400 font-normal">/ 5</span></div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-1">
                            <IconBarChart className="w-4 h-4 text-brand-500" />
                            Schwierigkeit
                        </div>
                        <div className="text-2xl font-bold text-slate-800 dark:text-white">{avgDifficulty} <span className="text-sm text-slate-400 font-normal">/ 5</span></div>
                    </div>
                </div>

                {/* Tags Section */}
                <div>
                   <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                     <IconTag className="w-4 h-4 text-slate-400" /> Tags
                   </h3>
                   <div className="flex flex-wrap gap-2">
                      {exam.tags.map((tag, idx) => (
                          <span key={idx} className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-sm font-medium">
                              #{tag}
                          </span>
                      ))}
                      
                      {isAddingTag ? (
                          <form onSubmit={handleAddTagSubmit} className="flex items-center">
                              <input 
                                autoFocus
                                type="text" 
                                className="bg-white dark:bg-slate-800 border border-brand-300 text-slate-700 dark:text-white px-3 py-1 rounded-full text-sm outline-none ring-2 ring-brand-100"
                                placeholder="Neuer Tag..."
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onBlur={() => !newTag && setIsAddingTag(false)}
                              />
                          </form>
                      ) : (
                        <button 
                            onClick={() => setIsAddingTag(true)}
                            className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 text-slate-400 px-3 py-1 rounded-full text-sm hover:border-brand-400 hover:text-brand-500 transition-colors"
                        >
                            <IconPlus className="w-3 h-3" /> Tag
                        </button>
                      )}
                   </div>
                </div>

                {/* Rating Input Section */}
                {!rated ? (
                    <div className="border-t border-slate-100 dark:border-dark-border pt-6">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Deine Bewertung abgeben</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-2">Lesbarkeit / Qualität</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star}
                                            type="button"
                                            onClick={() => setUserQuality(star)}
                                            className={`${userQuality >= star ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-700'} hover:scale-110 transition-transform`}
                                        >
                                            <IconStar className="w-6 h-6" filled={userQuality >= star} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-2">Schwierigkeit (1 = Leicht, 5 = Schwer)</label>
                                <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <button 
                                            key={level}
                                            type="button"
                                            onClick={() => setUserDifficulty(level)}
                                            className={`w-8 h-8 rounded-md text-sm font-bold transition-colors ${
                                                userDifficulty === level 
                                                ? 'bg-brand-600 text-white shadow-sm' 
                                                : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm'
                                            }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <button 
                                disabled={!userQuality || !userDifficulty}
                                onClick={handleSubmitRating}
                                className="w-full bg-slate-800 dark:bg-slate-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-bold py-2 rounded-lg mt-2 transition-colors"
                            >
                                Bewertung senden
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 p-4 rounded-xl text-center">
                        <p className="text-green-700 dark:text-green-300 font-bold mb-1">Danke für dein Feedback!</p>
                        <p className="text-xs text-green-600 dark:text-green-400">Deine Bewertung hilft anderen Schülern.</p>
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-dark-border bg-slate-50 dark:bg-slate-800/50">
               <button 
                onClick={() => onDownload(exam)}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-brand-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
               >
                 <span>Download Klausur</span>
                 <span className="bg-brand-700 px-2 py-0.5 rounded text-xs opacity-80">{exam.fileType.toUpperCase()}</span>
               </button>
               <p className="text-center text-xs text-slate-400 mt-2">Hochgeladen von {exam.uploaderName}</p>
            </div>
        </div>
      </div>
    </div>
  );
};
