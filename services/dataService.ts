
import { supabase } from './supabase';
import { Driver, RaceRound, DriverTier, RankTrend } from '../types';
import { 
  MOCK_DRIVERS_MONTHLY, 
  MOCK_DRIVERS_ZHUZHOU, 
  MOCK_DRIVERS_RALLY, 
  MOCK_DRIVERS_IRACING, 
  RACE_ROUNDS,
  MOCK_ROUNDS_MAP
} from '../constants';

// Helper to check if Supabase is configured
const isSupabaseConfigured = () => {
  // 使用类型断言解决 TypeScript 报错：类型“ImportMeta”上不存在属性“env”
  const env = (import.meta as any).env;
  return !!env?.VITE_SUPABASE_URL && !!env?.VITE_SUPABASE_ANON_KEY && env?.VITE_SUPABASE_URL !== 'YOUR_SUPABASE_URL';
};

export const fetchDrivers = async (seriesId: string = 'monthly', roundId?: string): Promise<Driver[]> => {
  if (!isSupabaseConfigured()) {
    console.warn(`Supabase not configured, using mock data for drivers (Series: ${seriesId}).`);
    switch (seriesId) {
      case 'zhuzhou': return MOCK_DRIVERS_ZHUZHOU;
      case 'rally': return MOCK_DRIVERS_RALLY;
      case 'iracing': return MOCK_DRIVERS_IRACING;
      case 'monthly':
      default:
        return MOCK_DRIVERS_MONTHLY;
    }
  }

  // 1. First get the current round if not specified
  let targetRoundId = roundId;
  if (!targetRoundId) {
    const { data: rounds } = await supabase
      .from('rounds')
      .select('id')
      .eq('series_id', seriesId)
      .order('sequence', { ascending: false })
      .limit(1);
    
    if (rounds && rounds.length > 0) {
      targetRoundId = rounds[0].id;
    }
  }

  if (!targetRoundId) {
    return []; // No rounds found
  }

  // 2. Fetch rankings for the target round (drivers table removed, driver info is now in rankings)
  const { data, error } = await supabase
    .from('rankings')
    .select('*')
    .eq('round_id', targetRoundId)
    .order('rank', { ascending: true });

  if (error) {
    console.error('Error fetching drivers:', error);
    return [];
  }

  // Map database snake_case to TypeScript camelCase
  return data.map((d: any) => ({
    id: d.driver_id, // Driver ID stored directly in rankings
    name: d.driver_id, // Using driver_id as name since we removed drivers table
    tier: d.tier as DriverTier,
    points: d.points,
    safetyScore: d.safety_score,
    podiums: d.podiums,
    finishedRaces: d.finished_races,
    totalRaces: d.total_races,
    displayRaces: d.display_races,
    rank: d.rank,
    trend: d.trend as RankTrend,
  }));
};

export const fetchRaceRounds = async (seriesId: string = 'monthly'): Promise<RaceRound[]> => {
  if (!isSupabaseConfigured()) {
    console.warn(`Supabase not configured, using mock data for race rounds (Series: ${seriesId}).`);
    return MOCK_ROUNDS_MAP[seriesId] || RACE_ROUNDS;
  }

  const { data, error } = await supabase
    .from('rounds')
    .select('*')
    .eq('series_id', seriesId)
    .order('sequence', { ascending: false });

  if (error) {
    console.error('Error fetching race rounds:', error);
    return MOCK_ROUNDS_MAP[seriesId] || RACE_ROUNDS;
  }

  return data.map((r: any) => ({
    id: r.id, // Keep as UUID string or map if needed. Types.ts defines it as number currently, might need update.
    name: r.name,
  }));
};
