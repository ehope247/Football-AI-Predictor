import React, { useState, useRef, useEffect } from 'react';
import type { Chat } from '@google/genai';
import { createChatSession } from '../services/geminiService';
import type { ChatMessage } from '../types';
import SendIcon from './icons/SendIcon';
import BallIcon from './icons/BallIcon';

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatSessionRef.current = createChatSession();
     setMessages([{
        role: 'model',
        content: "Hi! I'm Footy AI. Ask me anything about football!",
     }]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      if (!chatSessionRef.current) {
        throw new Error("Chat session not initialized.");
      }
      
      const stream = await chatSessionRef.current.sendMessageStream({ message: input });

      let text = '';
      setMessages(prev => [...prev, { role: 'model', content: '' }]);

      for await (const chunk of stream) {
        text += chunk.text;
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = text;
            return newMessages;
        });
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(`Failed to get response from AI: ${errorMessage}`);
      // Remove the optimistic empty model message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-900">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && (
              <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center border-2 border-slate-600">
                <BallIcon className="w-6 h-6 text-cyan-400" />
              </div>
            )}
            <div
              className={`max-w-md md:max-w-lg p-4 rounded-2xl shadow-md ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-800 text-gray-200 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{msg.content}{isLoading && msg.role === 'model' && index === messages.length -1 ? '...' : ''}</p>
            </div>
          </div>
        ))}
        {error && <div className="text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 md:p-6 bg-slate-900 border-t border-slate-800">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-slate-800 rounded-xl border border-slate-700 p-2 focus-within:ring-2 focus-within:ring-cyan-500 transition-shadow">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a player, team, or match..."
            className="w-full bg-transparent text-white px-4 py-2 focus:outline-none disabled:opacity-50"
            disabled={isLoading}
            aria-label="Chat input"
          />
          <button type="submit" disabled={isLoading || !input.trim()} className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex-shrink-0" aria-label="Send message">
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;