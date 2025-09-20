import React, { useState } from 'react';
import type { TeamStats, PredictionResult } from '../types';
import { generatePrediction } from '../services/geminiService';
import BallIcon from './icons/BallIcon';

const defaultTeamStats = (): TeamStats => ({
  name: '',
  wins: 3,
  draws: 1,
  losses: 1,
  avgGoalsScored: 1.8,
  avgGoalsConceded: 1.2,
});

const TeamStatsInput: React.FC<{
  team: TeamStats;
  setTeam: React.Dispatch<React.SetStateAction<TeamStats>>;
  teamLabel: string;
}> = ({ team, setTeam, teamLabel }) => {
  const handleChange = <T,>(field: keyof TeamStats, value: T) => {
    setTeam(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full bg-slate-800 p-4 sm:p-6 rounded-xl border border-slate-700 space-y-4">
      <h3 className="text-xl font-semibold text-white">{teamLabel}</h3>
      <input
        type="text"
        placeholder="Team Name"
        value={team.name}
        onChange={(e) => handleChange('name', e.target.value)}
        className="w-full bg-slate-700 text-white p-3 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        aria-label={`${teamLabel} Name`}
      />
      <div className="text-gray-300">Form (Last 5 Games):</div>
      <div className="grid grid-cols-3 gap-3">
        {['wins', 'draws', 'losses'].map(stat => (
          <div key={stat}>
            <label className="block text-sm font-medium text-gray-400 capitalize">{stat}</label>
            <input
              type="number"
              min="0"
              max="5"
              value={team[stat as keyof Omit<TeamStats, 'name' | 'avgGoalsScored' | 'avgGoalsConceded'>]}
              onChange={(e) => handleChange(stat as keyof TeamStats, Number(e.target.value))}
              className="mt-1 w-full bg-slate-700 text-white p-3 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              aria-label={`${teamLabel} ${stat}`}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-400">Avg Goals Scored</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={team.avgGoalsScored}
            onChange={(e) => handleChange('avgGoalsScored', Number(e.target.value))}
            className="mt-1 w-full bg-slate-700 text-white p-3 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
             aria-label={`${teamLabel} Average Goals Scored`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400">Avg Goals Conceded</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={team.avgGoalsConceded}
            onChange={(e) => handleChange('avgGoalsConceded', Number(e.target.value))}
            className="mt-1 w-full bg-slate-700 text-white p-3 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            aria-label={`${teamLabel} Average Goals Conceded`}
          />
        </div>
      </div>
    </div>
  );
};

const PredictionView: React.FC = () => {
  const [teamA, setTeamA] = useState<TeamStats>(defaultTeamStats());
  const [teamB, setTeamB] = useState<TeamStats>(defaultTeamStats());
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    if (!teamA.name || !teamB.name) {
      setError("Please enter names for both teams.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const result = await generatePrediction(teamA, teamB);
      setPrediction(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <TeamStatsInput team={teamA} setTeam={setTeamA} teamLabel="Home Team" />
        <div className="text-4xl font-black text-slate-600 my-4 md:my-0">VS</div>
        <TeamStatsInput team={teamB} setTeam={setTeamB} teamLabel="Away Team" />
      </div>

      <div className="text-center">
        <button
          onClick={handlePredict}
          disabled={isLoading}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 px-10 rounded-full hover:from-cyan-400 hover:to-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-3 mx-auto text-lg"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <BallIcon className="w-6 h-6" />
              <span>Get Prediction</span>
            </>
          )}
        </button>
      </div>
      
      {error && <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg" role="alert">{error}</div>}

      {prediction && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6 sm:p-8 rounded-2xl shadow-2xl animate-fade-in-up mt-8" aria-live="polite">
            <h2 className="text-3xl font-bold text-center text-white mb-6">Match Prediction Result</h2>
            
            <div className="flex justify-around items-center text-center my-6">
                <h3 className={`text-2xl font-bold transition-all duration-300 ${prediction.predictedWinner === teamA.name ? 'text-cyan-400 scale-110' : 'text-white'}`}>{teamA.name}</h3>
                <div className="bg-slate-900/50 px-6 py-4 rounded-lg border border-slate-600">
                    <p className="text-5xl font-extrabold text-white tracking-wider">{prediction.predictedScore}</p>
                    <p className="text-sm text-slate-400 mt-1">Predicted Score</p>
                </div>
                <h3 className={`text-2xl font-bold transition-all duration-300 ${prediction.predictedWinner === teamB.name ? 'text-cyan-400 scale-110' : 'text-white'}`}>{teamB.name}</h3>
            </div>
             <div className="text-center my-6">
                <p className="text-lg font-semibold text-gray-300">
                    Predicted Winner: <span className="text-2xl font-bold text-cyan-300">{prediction.predictedWinner}</span>
                </p>
             </div>

            <div className="mt-8">
                 <h4 className="text-lg font-semibold text-gray-300 uppercase tracking-wider mb-3 text-center">AI Analyst Report</h4>
                 <p className="text-gray-200 bg-slate-900/50 p-5 rounded-md border border-slate-700 leading-relaxed text-center">{prediction.analysis}</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default PredictionView;