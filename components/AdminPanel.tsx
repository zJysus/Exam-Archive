
import React, { useState } from 'react';
import { User, Exam } from '../types';
import { IconCheck, IconUser, IconFlag, IconFileText, IconChart, IconEye, IconDownload, IconStar } from './Icons';

interface AdminPanelProps {
  users: User[];
  exams: Exam[];
  onApprove: (userId: string) => void;
  onApproveExam: (examId: string) => void;
  onDeleteExam: (examId: string) => void;
  onClearReport: (examId: string) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ users, exams, onApprove, onApproveExam, onDeleteExam, onClearReport, onClose }) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'users' | 'pending' | 'reports'>('insights');
  
  const pendingUsers = users.filter(u => !u.isApproved);
  const pendingExams = exams.filter(e => !e.isApproved);
  const reportedExams = exams.filter(e => e.isReported);
  
  // Calculate top uploaders
  const uploadCounts: Record<string, number> = {};
  exams.forEach(e => {
      uploadCounts[e.uploaderName] = (uploadCounts[e.uploaderName] || 0) + 1;
  });

  // Calculate total stats
  const totalViews = exams.reduce((acc, curr) => acc + curr.views, 0);
  const totalDownloads = exams.reduce((acc, curr) => acc + curr.downloads, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg p-6 animate-fade-in fixed inset-0 z-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400">Verwaltung und Statistiken der Plattform</p>
            </div>
            <button 
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
                Zurück zur App
            </button>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-slate-200 dark:border-dark-border">
                <div className="flex items-center gap-3 mb-2 text-slate-500 dark:text-slate-400 text-sm font-bold uppercase">
                    <IconUser className="w-4 h-4" /> Nutzer
                </div>
                <div className="text-3xl font-bold text-slate-800 dark:text-white">{users.length}</div>
            </div>
            <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-slate-200 dark:border-dark-border">
                <div className="flex items-center gap-3 mb-2 text-slate-500 dark:text-slate-400 text-sm font-bold uppercase">
                    <IconFileText className="w-4 h-4" /> Klausuren
                </div>
                <div className="text-3xl font-bold text-slate-800 dark:text-white">{exams.length}</div>
            </div>
            <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-slate-200 dark:border-dark-border">
                <div className="flex items-center gap-3 mb-2 text-slate-500 dark:text-slate-400 text-sm font-bold uppercase">
                    <IconEye className="w-4 h-4" /> Aufrufe
                </div>
                <div className="text-3xl font-bold text-slate-800 dark:text-white">{totalViews}</div>
            </div>
            <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-slate-200 dark:border-dark-border">
                <div className="flex items-center gap-3 mb-2 text-slate-500 dark:text-slate-400 text-sm font-bold uppercase">
                    <IconDownload className="w-4 h-4" /> Downloads
                </div>
                <div className="text-3xl font-bold text-slate-800 dark:text-white">{totalDownloads}</div>
            </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-slate-200 dark:border-dark-border overflow-hidden min-h-[500px] flex flex-col">
            <div className="flex border-b border-slate-200 dark:border-dark-border overflow-x-auto">
                <button 
                    onClick={() => setActiveTab('insights')}
                    className={`flex-1 min-w-[150px] py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'insights' ? 'border-brand-500 text-brand-600 bg-brand-50/50 dark:bg-brand-900/20' : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                    <div className="flex items-center justify-center gap-2">
                        <IconChart className="w-4 h-4" /> Insights
                    </div>
                </button>
                <button 
                    onClick={() => setActiveTab('users')}
                    className={`flex-1 min-w-[150px] py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'users' ? 'border-brand-500 text-brand-600 bg-brand-50/50 dark:bg-brand-900/20' : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                    <div className="flex items-center justify-center gap-2">
                        <IconUser className="w-4 h-4" /> Benutzer <span className="ml-1 bg-slate-200 dark:bg-slate-700 px-1.5 rounded-full text-xs">{pendingUsers.length > 0 ? pendingUsers.length : ''}</span>
                    </div>
                </button>
                <button 
                    onClick={() => setActiveTab('pending')}
                    className={`flex-1 min-w-[150px] py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'pending' ? 'border-brand-500 text-brand-600 bg-brand-50/50 dark:bg-brand-900/20' : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                     <div className="flex items-center justify-center gap-2">
                        <IconFileText className="w-4 h-4" /> Warteschlange <span className="ml-1 bg-orange-100 dark:bg-orange-900 text-orange-600 px-1.5 rounded-full text-xs">{pendingExams.length > 0 ? pendingExams.length : ''}</span>
                    </div>
                </button>
                <button 
                    onClick={() => setActiveTab('reports')}
                    className={`flex-1 min-w-[150px] py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'reports' ? 'border-red-500 text-red-600 bg-red-50/50 dark:bg-red-900/20' : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                     <div className="flex items-center justify-center gap-2">
                        <IconFlag className="w-4 h-4" /> Meldungen <span className="ml-1 bg-red-100 dark:bg-red-900 text-red-600 px-1.5 rounded-full text-xs">{reportedExams.length > 0 ? reportedExams.length : ''}</span>
                    </div>
                </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
                
                {/* INSIGHTS TAB */}
                {activeTab === 'insights' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase font-bold text-xs">
                                <tr>
                                    <th className="p-3 rounded-tl-lg">Fach / Thema</th>
                                    <th className="p-3">Lehrer</th>
                                    <th className="p-3">Uploader</th>
                                    <th className="p-3 text-center">Aufrufe</th>
                                    <th className="p-3 text-center">Downloads</th>
                                    <th className="p-3 text-center rounded-tr-lg">Bewertung</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {exams.filter(e => e.isApproved).map(exam => (
                                    <tr key={exam.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-3 font-medium text-slate-900 dark:text-white">
                                            {exam.subject}
                                            <span className="block text-xs text-slate-400 font-normal">{exam.gradeLevel}</span>
                                        </td>
                                        <td className="p-3 text-slate-600 dark:text-slate-300">{exam.teacher}</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-300">{exam.uploaderName}</td>
                                        <td className="p-3 text-center text-slate-600 dark:text-slate-300">{exam.views}</td>
                                        <td className="p-3 text-center text-slate-600 dark:text-slate-300">{exam.downloads}</td>
                                        <td className="p-3 text-center">
                                            <span className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full text-xs font-bold">
                                                <IconStar className="w-3 h-3" filled /> 
                                                {exam.ratings.count > 0 ? (exam.ratings.qualitySum / exam.ratings.count).toFixed(1) : '-'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* USERS TAB */}
                {activeTab === 'users' && (
                    <div className="space-y-6">
                        {/* Pending Approvals */}
                        {pendingUsers.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Warten auf Freischaltung</h3>
                                <div className="grid gap-4">
                                    {pendingUsers.map(user => (
                                        <div key={user.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-full text-slate-500 dark:text-slate-300">
                                                    <IconUser className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-white">{user.username}</p>
                                                    <p className="text-xs text-slate-400">Rolle: {user.role}</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => onApprove(user.id)}
                                                className="bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/50 dark:text-green-400 dark:hover:bg-green-900 px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
                                            >
                                                <IconCheck className="w-4 h-4" /> Freischalten
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* All Users List */}
                        <div>
                             <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Alle Benutzer ({users.length})</h3>
                             <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase font-bold text-xs">
                                    <tr>
                                        <th className="p-3 rounded-tl-lg">Benutzername</th>
                                        <th className="p-3">Rolle</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-right rounded-tr-lg">Uploads</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {users.map(user => (
                                        <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <td className="p-3 font-bold text-slate-800 dark:text-white">{user.username}</td>
                                            <td className="p-3 text-slate-600 dark:text-slate-300">{user.role}</td>
                                            <td className="p-3">
                                                {user.isApproved ? (
                                                    <span className="text-green-600 dark:text-green-400 text-xs font-bold bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">Aktiv</span>
                                                ) : (
                                                    <span className="text-orange-600 dark:text-orange-400 text-xs font-bold bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded">Wartend</span>
                                                )}
                                            </td>
                                            <td className="p-3 text-right font-mono text-slate-600 dark:text-slate-300">
                                                {uploadCounts[user.username] || 0}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                             </table>
                        </div>
                    </div>
                )}

                {/* PENDING EXAMS TAB */}
                {activeTab === 'pending' && (
                    <div className="space-y-4">
                        {pendingExams.length === 0 ? (
                            <div className="text-center py-20 text-slate-400">
                                <IconCheck className="w-12 h-12 mx-auto mb-2 text-green-500 bg-green-100 rounded-full p-2" />
                                <p>Alles erledigt! Keine offenen Klausuren.</p>
                            </div>
                        ) : (
                            pendingExams.map(exam => (
                                <div key={exam.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg text-orange-600 dark:text-orange-400">
                                                <IconFileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 dark:text-white">{exam.subject}</h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">bei {exam.teacher} • {exam.gradeLevel}</p>
                                                <p className="text-xs text-slate-400 mt-1">Upload von: {exam.uploaderName}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2 justify-end pt-2 border-t border-slate-100 dark:border-slate-700">
                                        <button 
                                            onClick={() => onDeleteExam(exam.id)}
                                            className="px-3 py-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Ablehnen & Löschen
                                        </button>
                                        <button 
                                            onClick={() => onApproveExam(exam.id)}
                                            className="px-4 py-1.5 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 transition-colors"
                                        >
                                            Veröffentlichen
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* REPORTS TAB */}
                {activeTab === 'reports' && (
                    <div className="space-y-4">
                         {reportedExams.length === 0 ? (
                            <div className="text-center py-20 text-slate-400">
                                <IconCheck className="w-12 h-12 mx-auto mb-2 text-green-500 bg-green-100 rounded-full p-2" />
                                <p>Keine gemeldeten Inhalte.</p>
                            </div>
                        ) : (
                            reportedExams.map(exam => (
                                <div key={exam.id} className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl shadow-sm border border-red-100 dark:border-red-900/30">
                                    <div className="flex items-center gap-3 mb-4">
                                        <IconFlag className="w-5 h-5 text-red-500" />
                                        <div>
                                            <h3 className="font-bold text-slate-800 dark:text-white">{exam.subject} <span className="text-red-500 text-xs uppercase font-bold tracking-wide border border-red-200 dark:border-red-800 px-1 rounded ml-2">Gemeldet</span></h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Uploader: {exam.uploaderName}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <button 
                                            onClick={() => onClearReport(exam.id)}
                                            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Meldung ignorieren
                                        </button>
                                        <button 
                                            onClick={() => onDeleteExam(exam.id)}
                                            className="px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-bold transition-colors"
                                        >
                                            Inhalt löschen
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
