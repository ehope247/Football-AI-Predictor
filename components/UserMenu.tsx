import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserIcon from './icons/UserIcon';
import LogoutIcon from './icons/LogoutIcon';

const UserMenu: React.FC = () => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <UserIcon className="w-5 h-5 text-slate-400" />
        <span className="text-sm font-medium text-white hidden sm:inline">{currentUser.username}</span>
      </div>
      <button
        onClick={logout}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 bg-slate-800/50 rounded-md hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
        aria-label="Logout"
      >
        <LogoutIcon className="w-5 h-5" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  );
};

export default UserMenu;
