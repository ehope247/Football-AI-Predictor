import React from 'react';
import { View } from '../types';
import BallIcon from './icons/BallIcon';
import ChatIcon from './icons/ChatIcon';
import UserMenu from './UserMenu';

interface HeaderProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView }) => {
  const getTabClass = (view: View) => {
    return `flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium rounded-t-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
      activeView === view
        ? 'bg-slate-800 text-white'
        : 'text-gray-400 hover:bg-slate-800/50 hover:text-white'
    }`;
  };

  return (
    <header className="bg-slate-900/70 backdrop-blur-lg sticky top-0 z-10 w-full border-b border-slate-800 flex-shrink-0">
      <div className="flex items-center justify-between h-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-3">
          <BallIcon className="w-9 h-9 text-cyan-400" />
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Football <span className="text-cyan-400">AI</span> Predictor
          </h1>
        </div>
        
        <nav className="flex items-center gap-2 sm:gap-4">
            <div className="flex space-x-1 sm:space-x-2">
                <button onClick={() => setActiveView(View.Prediction)} className={getTabClass(View.Prediction)} aria-pressed={activeView === View.Prediction}>
                    <BallIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Predictor</span>
                </button>
                <button onClick={() => setActiveView(View.Chat)} className={getTabClass(View.Chat)} aria-pressed={activeView === View.Chat}>
                    <ChatIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">AI Chat</span>
                </button>
            </div>
            <div className="h-8 w-px bg-slate-700 hidden sm:block"></div>
            <UserMenu />
        </nav>
      </div>
    </header>
  );
};

export default Header;
