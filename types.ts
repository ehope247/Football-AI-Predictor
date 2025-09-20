export interface User {
  username: string;
  messagesSent: number;
}

export interface TeamStats {
  name: string;
  wins: number;
  draws: number;
  losses: number;
  avgGoalsScored: number;
  avgGoalsConceded: number;
}

export interface PredictionResult {
  predictedWinner: string;
  predictedScore: string;
  analysis: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export enum View {
  Prediction = 'PREDICTION',
  Chat = 'CHAT',
}
