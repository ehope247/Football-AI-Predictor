import React, { useState } from 'react';
import Header from './components/Header';
import PredictionView from './components/PredictionView';
import ChatView from './components/ChatView';
import { View } from './types';
import { useAuth } from './contexts/AuthContext';
import AuthView from './components/AuthView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.Prediction);
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading session...</div>;
  }
  
  if (!currentUser) {
    return <AuthView />;
  }

  return (
    <main className="min-h-screen bg-slate-900 text-gray-100 flex flex-col">
      <Header activeView={activeView} setActiveView={setActiveView} />
      {activeView === View.Prediction && (
         <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
            <PredictionView />
         </div>
      )}
      {activeView === View.Chat && <ChatView />}
    </main>
  );
};

export default App;
