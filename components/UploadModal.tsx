import React, { useState } from 'react';
import { Exam, FileType } from '../types';
import { IconUpload, IconFileText, IconImage, IconTag } from './Icons';
import { extractTextFromImage } from '../services/geminiService';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (exam: Omit<Exam, 'id' | 'uploaderName' | 'isApproved'>) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload }) => {
  const [subject, setSubject] = useState('');
  const [teacher, setTeacher] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [gradeLevel, setGradeLevel] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !subject || !teacher) return;

    setIsProcessing(true);

    const isImage = file.type.startsWith('image/');
    const fileType: FileType = isImage ? 'image' : 'pdf';
    
    // Create preview for images
    let fileContent = '';
    let transcript = '';

    if (isImage) {
        fileContent = URL.createObjectURL(file);
        // Simulate OCR
        transcript = await extractTextFromImage(file);
    }

    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0);

    onUpload({
      subject,
      teacher,
      date: new Date(date).toISOString(),
      gradeLevel,
      fileName: file.name,
      fileType,
      fileContent,
      tags,
      ratings: { difficultySum: 0, qualitySum: 0, count: 0 },
      transcript,
      views: 0,
      downloads: 0
    });
    
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-dark-border flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Klausur hochladen</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">&times;</button>
        </div>
        
        <div className="overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
               <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Fach</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none dark:text-white"
                    placeholder="z.B. Mathematik"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Lehrer</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none dark:text-white"
                    placeholder="z.B. Herr Müller"
                    value={teacher}
                    onChange={(e) => setTeacher(e.target.value)}
                  />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Datum</label>
                <input 
                  required
                  type="date" 
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none dark:text-white"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Stufe</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none dark:text-white"
                  placeholder="z.B. 10b"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Tags (Optional)</label>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full px-3 py-2 pl-9 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none dark:text-white"
                  placeholder="schwer, klausur, hilfsmittel..."
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                />
                <IconTag className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Mit Komma trennen</p>
            </div>

            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer relative ${dragActive ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
              onDrop={() => setDragActive(false)}
            >
              <input 
                type="file" 
                required
                accept="image/*,.pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                disabled={isProcessing}
              />
              {file ? (
                <div className="flex flex-col items-center text-brand-600 dark:text-brand-400 animate-fade-in">
                  {file.type.startsWith('image/') ? <IconImage className="w-10 h-10 mb-2" /> : <IconFileText className="w-10 h-10 mb-2" />}
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-slate-400 mt-1">Klicken zum Ändern</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-slate-500 dark:text-slate-400">
                  <IconUpload className={`w-10 h-10 mb-3 ${dragActive ? 'text-brand-500 scale-110' : ''} transition-transform`} />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Datei auswählen</span>
                  <span className="text-xs text-slate-400 mt-1">PDF oder Bild (JPG, PNG)</span>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isProcessing}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait"
            >
              {isProcessing ? 'Verarbeite & OCR Scan...' : 'Jetzt hochladen'}
            </button>
            {isProcessing && <p className="text-center text-xs text-slate-400">Bild wird analysiert um Textsuche zu ermöglichen...</p>}
          </form>
        </div>
      </div>
    </div>
  );
};