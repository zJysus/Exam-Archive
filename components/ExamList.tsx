
import React, { useState } from 'react';
import { Exam } from '../types';
import { IconFileText, IconBrain, IconStar, IconImage, IconEye, IconTag } from './Icons';
import { generateStudyTips } from '../services/geminiService';
import { ExamPreviewModal } from './ExamPreviewModal';

interface ExamListProps {
  exams: Exam[];
  favorites: string[];
  currentUser: any;
  onToggleFavorite: (id: string) => void;
  onAddTag: (examId: string, tag: string) => void;
  onRateExam: (examId: string, difficulty: number, quality: number) => void;
  onReportExam: (examId: string) => void;
  onViewExam: (examId: string) => void;
  onDownloadExam: (exam: Exam) => void;
}

export const ExamList: React.FC<ExamListProps> = ({ exams, favorites, currentUser, onToggleFavorite, onAddTag, onRateExam, onReportExam, onViewExam, onDownloadExam }) => {
  const [tips, setTips] = useState<{ [key: string]: string | null }>({});
  const [loadingTips, setLoadingTips] = useState<string | null>(null);
  const [previewExam, setPreviewExam] = useState<Exam | null>(null);

  const handleAskAI = async (e: React.MouseEvent, exam: Exam) => {
    e.stopPropagation();
    if (tips[exam.id]) {
      setTips(prev => ({ ...prev, [exam.id]: null })); // Toggle off
      return;
    }

    setLoadingTips(exam.id);
    const result = await generateStudyTips(exam.subject, exam.teacher);
    setTips(prev => ({ ...prev, [exam.id]: result }));
    setLoadingTips(null);
  };

  const handleOpenPreview = (exam: Exam) => {
    onViewExam(exam.id);
    setPreviewExam(exam);
  };

  if (exams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500 animate-fade-in">
        <IconFileText className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-xl">Keine Klausuren gefunden.</p>
      </div>
    );
  }

  const getDifficultyColor = (avg: number) => {
    if (avg === 0) return 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300';
    if (avg <= 2) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    if (avg <= 3.5) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  };

  const getDifficultyLabel = (avg: number) => {
    if (avg === 0) return 'Unbewertet';
    if (avg <= 2) return 'Leicht';
    if (avg <= 3.5) return 'Mittel';
    return 'Schwer';
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up">
        {exams.map((exam) => {
          const isFav = favorites.includes(exam.id);
          const avgQuality = exam.ratings.count > 0 ? (exam.ratings.qualitySum / exam.ratings.count).toFixed(1) : '—';
          const avgDifficulty = exam.ratings.count > 0 ? (exam.ratings.difficultySum / exam.ratings.count) : 0;
          
          return (
            <div 
              key={exam.id} 
              className="group bg-white dark:bg-dark-card rounded-xl shadow-sm border border-slate-200 dark:border-dark-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer relative"
              onClick={() => handleOpenPreview(exam)}
            >
              {/* Preview Area */}
              <div className="h-40 bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center overflow-hidden border-b border-slate-100 dark:border-slate-700">
                {exam.fileType === 'image' && exam.fileContent ? (
                  <img src={exam.fileContent} alt="Preview" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex flex-col items-center text-slate-400 dark:text-slate-500">
                     {exam.fileType === 'image' ? <IconImage className="w-12 h-12 mb-2" /> : <IconFileText className="w-12 h-12 mb-2" />}
                     <span className="text-xs uppercase font-bold tracking-wider">{exam.fileType}</span>
                  </div>
                )}
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white/90 dark:bg-slate-800/90 p-2 rounded-full shadow-lg">
                      <IconEye className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                    </div>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(exam.id); }}
                  className={`absolute top-3 right-3 p-2 rounded-full shadow-sm transition-colors ${isFav ? 'bg-yellow-100 text-yellow-500 dark:bg-yellow-900/50' : 'bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:text-yellow-400'}`}
                >
                  <IconStar filled={isFav} className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {exam.gradeLevel}
                  </span>
                  <div className="flex gap-1 items-center">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getDifficultyColor(avgDifficulty)}`}>
                        {getDifficultyLabel(avgDifficulty)}
                    </span>
                    <span className="flex items-center text-xs text-slate-400 font-medium">
                        <IconStar filled className="w-3 h-3 text-yellow-400 mr-0.5" />
                        {avgQuality}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1 truncate" title={exam.subject}>{exam.subject}</h3>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-2 h-6 overflow-hidden">
                    {exam.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                            {tag}
                        </span>
                    ))}
                    {exam.tags.length > 3 && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-slate-50 text-slate-400 dark:bg-slate-800">
                            +{exam.tags.length - 3}
                        </span>
                    )}
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex-1">bei <span className="font-medium text-slate-700 dark:text-slate-300">{exam.teacher}</span></p>
                
                {/* AI Section */}
                {loadingTips === exam.id && (
                   <div className="bg-slate-50 dark:bg-slate-700/50 p-2 rounded text-xs text-slate-500 dark:text-slate-400 animate-pulse mb-3">
                     KI analysiert...
                   </div>
                )}
                
                {tips[exam.id] && (
                  <div onClick={(e) => e.stopPropagation()} className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-3 rounded text-sm text-indigo-900 dark:text-indigo-200 mb-3 overflow-auto max-h-40 cursor-default animate-fade-in">
                    <div className="flex items-center gap-2 mb-2 font-bold text-indigo-700 dark:text-indigo-300 text-xs uppercase tracking-wide">
                      <IconBrain className="w-3 h-3" />
                      KI-Tutor
                    </div>
                    <div className="markdown-body text-xs whitespace-pre-line leading-relaxed">
                      {tips[exam.id]}
                    </div>
                  </div>
                )}

                <div className="mt-auto flex gap-2 pt-3 border-t border-slate-50 dark:border-slate-700">
                   <button
                    onClick={(e) => { e.stopPropagation(); onDownloadExam(exam); }}
                    className="flex-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 py-1.5 px-3 rounded text-xs font-semibold transition-colors"
                  >
                    Download
                  </button>
                  <button
                    onClick={(e) => handleAskAI(e, exam)}
                    className={`flex items-center justify-center px-3 py-1.5 rounded border transition-colors ${tips[exam.id] ? 'bg-indigo-100 border-indigo-200 text-indigo-700 dark:bg-indigo-900 dark:border-indigo-700 dark:text-indigo-300' : 'bg-white border-slate-200 text-indigo-600 hover:bg-indigo-50 dark:bg-slate-700 dark:border-slate-600 dark:text-indigo-400 dark:hover:bg-slate-600'}`}
                    title="KI-Tipps anzeigen"
                  >
                    <IconBrain className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {previewExam && (
        <ExamPreviewModal 
          exam={previewExam} 
          currentUser={currentUser}
          onClose={() => setPreviewExam(null)} 
          onDownload={onDownloadExam}
          onAddTag={onAddTag}
          onRateExam={onRateExam}
          onReportExam={onReportExam}
        />
      )}
    </>
  );
};
