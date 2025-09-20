
import React from 'react';
import { View } from '../types';
import BallIcon from './icons/BallIcon';
import ChatIcon from './icons/ChatIcon';

interface HeaderProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView }) => {
  const getTabClass = (view: View) => {
    return `flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors duration-300 focus:outline-none ${
      activeView === view
        ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400'
        : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
    }`;
  };

  return (
    <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10 w-full px-4 md:px-8">
      <div className="flex items-center justify-between h-20 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <BallIcon className="w-8 h-8 text-cyan-400" />
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Football AI <span className="text-cyan-400">Predictor</span>
          </h1>
        </div>
        <nav className="flex space-x-2">
          <button onClick={() => setActiveView(View.Prediction)} className={getTabClass(View.Prediction)}>
            <BallIcon className="w-5 h-5" />
            Predictor
          </button>
          <button onClick={() => setActiveView(View.Chat)} className={getTabClass(View.Chat)}>
            <ChatIcon className="w-5 h-5" />
            AI Chat
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
