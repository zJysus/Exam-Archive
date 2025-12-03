
import React from 'react';
import { User } from '../types';
import { IconTrophy, IconUser, IconStar } from './Icons';

interface LeaderboardModalProps {
  users: User[];
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ users, onClose }) => {
  // Sort users by Karma desc
  const sortedUsers = [...users].sort((a, b) => b.karma - a.karma).slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
        <div className="px-6 py-6 bg-brand-600 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/10"></div>
            <IconTrophy className="w-12 h-12 mx-auto mb-2 relative z-10" />
            <h2 className="text-2xl font-bold relative z-10">Bestenliste</h2>
            <p className="text-brand-100 text-sm relative z-10">Top Contributors der Community</p>
            <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl z-20">&times;</button>
        </div>

        <div className="overflow-y-auto p-4 flex-1 bg-slate-50 dark:bg-slate-900">
            {sortedUsers.map((user, index) => (
                <div key={user.id} className="flex items-center gap-4 p-4 mb-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transform transition-transform hover:scale-[1.02]">
                    <div className={`w-8 h-8 flex items-center justify-center font-bold text-lg rounded-full ${
                        index === 0 ? 'bg-yellow-100 text-yellow-600' : 
                        index === 1 ? 'bg-slate-200 text-slate-600' :
                        index === 2 ? 'bg-orange-100 text-orange-600' :
                        'text-slate-400'
                    }`}>
                        {index + 1}
                    </div>
                    
                    <div className="flex-1">
                        <div className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            {user.username}
                            {index === 0 && <IconTrophy className="w-3 h-3 text-yellow-500" />}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                             {user.role === 'ADMIN' ? 'Administrator' : 'Schüler'}
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        <span className="font-bold text-brand-600 dark:text-brand-400 text-lg">{user.karma}</span>
                        <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Karma</span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
