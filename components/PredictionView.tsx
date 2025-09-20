
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
    <div className="w-full bg-slate-800/50 p-6 rounded-xl border border-slate-700 space-y-4">
      <h3 className="text-xl font-semibold text-white">{teamLabel}</h3>
      <input
        type="text"
        placeholder="Team Name"
        value={team.name}
        onChange={(e) => handleChange('name', e.target.value)}
        className="w-full bg-slate-700 text-white p-3 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
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
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <TeamStatsInput team={teamA} setTeam={setTeamA} teamLabel="Home Team" />
        <div className="self-center text-3xl font-bold text-gray-500 p-4">VS</div>
        <TeamStatsInput team={teamB} setTeam={setTeamB} teamLabel="Away Team" />
      </div>

      <div className="text-center">
        <button
          onClick={handlePredict}
          disabled={isLoading}
          className="bg-cyan-600 text-white font-bold py-3 px-8 rounded-full hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-3 mx-auto"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <BallIcon className="w-6 h-6" />
              Get Prediction
            </>
          )}
        </button>
      </div>
      
      {error && <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>}

      {prediction && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl animate-fade-in-up mt-8">
            <h2 className="text-3xl font-bold text-center text-white mb-2">Match Prediction</h2>
            <p className="text-center text-cyan-400 font-semibold text-lg">{teamA.name} vs {teamB.name}</p>
            
            <div className="mt-6 grid md:grid-cols-2 gap-6 text-center">
                <div className="bg-slate-700/50 p-6 rounded-lg">
                    <h4 className="text-md font-semibold text-gray-400 uppercase tracking-wider">Predicted Winner</h4>
                    <p className="text-4xl font-bold text-cyan-400 mt-2">{prediction.predictedWinner}</p>
                </div>
                 <div className="bg-slate-700/50 p-6 rounded-lg">
                    <h4 className="text-md font-semibold text-gray-400 uppercase tracking-wider">Predicted Score</h4>
                    <p className="text-4xl font-bold text-white mt-2">{prediction.predictedScore}</p>
                </div>
            </div>

            <div className="mt-8">
                 <h4 className="text-md font-semibold text-gray-400 uppercase tracking-wider mb-2">AI Analysis</h4>
                 <p className="text-gray-200 bg-slate-900/50 p-4 rounded-md border border-slate-700 leading-relaxed">{prediction.analysis}</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default PredictionView;
