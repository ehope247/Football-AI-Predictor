import React, { useState } from 'react';
import Header from './components/Header';
import PredictionView from './components/PredictionView';
import ChatView from './components/ChatView';
import { View } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.Prediction);

  return (
    <main className="min-h-screen bg-slate-900 text-gray-100">
      <Header activeView={activeView} setActiveView={setActiveView} />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {activeView === View.Prediction && <PredictionView />}
        {activeView === View.Chat && <ChatView />}
      </div>
    </main>
  );
};

export default App;