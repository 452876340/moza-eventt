
export enum DriverTier {
  S = 'S',
  A = 'A',
  B = 'B',
  C = 'C',
  R = 'R'
}

export enum RankTrend {
  UP = 'UP',
  DOWN = 'DOWN',
  STABLE = 'STABLE'
}

export interface Driver {
  id: string;
  name: string;
  tier?: DriverTier; // Optional for Rally
  points: number;
  safetyScore?: number; // Optional for Rally
  podiums: number;
  finishedRaces?: number;
  totalRaces?: number;
  displayRaces?: string; // For custom display like "43"
  rank: number;
  trend: RankTrend;
}

export interface RaceRound {
  id: string | number; // Updated to support UUID from Supabase
  name: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface Series {
  id: string;
  name: string;
}

export interface SeriesRules {
  seriesId: string;
  title: string;
  description?: string;
  groups: {
    title: string;
    description: string;
    requirements?: string;
    weeklyReward?: string;
    seasonReward?: {
      first: string;
      second: string;
      third: string;
      others?: string;
    };
    customRewards?: string[];
  }[];
}
