import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import BallIcon from './icons/BallIcon';

const AuthView: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setCurrentUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const user = isLogin
        ? await authService.login(username, password)
        : await authService.signUp(username, password);
      setCurrentUser(user);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 shadow-2xl animate-fade-in-up">
          <div className="flex flex-col items-center mb-6">
            <BallIcon className="w-16 h-16 text-cyan-400 mb-4" />
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Football <span className="text-cyan-400">AI</span> Predictor
            </h1>
            <p className="text-slate-400 mt-2">{isLogin ? 'Welcome back!' : 'Create an account to start.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-300"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 w-full bg-slate-700 text-white p-3 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                autoComplete="username"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full bg-slate-700 text-white p-3 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center" role="alert">{error}</p>}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                isLogin ? 'Login' : 'Sign Up'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="font-medium text-cyan-400 hover:text-cyan-300 focus:outline-none focus:underline"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
