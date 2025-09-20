
import React, { useState } from 'react';
import Header from './components/Header';
import PredictionView from './components/PredictionView';
import ChatView from './components/ChatView';
import { View } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.Prediction);

  return (
    <main className="min-h-screen bg-slate-900 text-gray-100 font-sans">
      <Header activeView={activeView} setActiveView={setActiveView} />
      <div className="pt-4">
        {activeView === View.Prediction && <PredictionView />}
        {activeView === View.Chat && <ChatView />}
      </div>
    </main>
  );
};

export default App;
