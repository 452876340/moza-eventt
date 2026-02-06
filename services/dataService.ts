
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

const DEFAULT_COLUMNS = ['排名', '车手ID', '等级', '积分', '安全分', '领奖台', '完赛 | 总场次'];

export const fetchDrivers = async (seriesId: string = 'monthly', roundId?: string): Promise<{ drivers: Driver[], columns: string[] }> => {
  if (!isSupabaseConfigured()) {
    console.warn(`Supabase not configured, using mock data for drivers (Series: ${seriesId}).`);
    let drivers: Driver[] = [];
    let columns = DEFAULT_COLUMNS;
    
    switch (seriesId) {
      case 'zhuzhou': 
        drivers = MOCK_DRIVERS_ZHUZHOU; 
        break;
      case 'rally': 
        drivers = MOCK_DRIVERS_RALLY; 
        columns = ['排名', '车手ID', '积分', '领奖台', '完赛 | 总场次'];
        break;
      case 'iracing': 
        drivers = MOCK_DRIVERS_IRACING; 
        break;
      case 'monthly':
      default:
        drivers = MOCK_DRIVERS_MONTHLY; 
        break;
    }
    return { drivers, columns };
  }

  // 1. Fetch all rounds to determine current and previous round
  const { data: rounds } = await supabase
    .from('rounds')
    .select('id, sequence')
    .eq('series_id', seriesId)
    .order('sequence', { ascending: false });

  if (!rounds || rounds.length === 0) {
    return { drivers: [], columns: DEFAULT_COLUMNS }; // No rounds found
  }

  let targetRoundId = roundId;
  let prevRoundId: string | undefined;

  if (!targetRoundId) {
    // Default to the latest round (first in the list because of descending order)
    targetRoundId = rounds[0].id;
    if (rounds.length > 1) {
      prevRoundId = rounds[1].id;
    }
  } else {
    // Find index of targetRoundId
    const index = rounds.findIndex(r => String(r.id) === String(targetRoundId));
    if (index !== -1 && index < rounds.length - 1) {
      // The previous round is the next one in the descending list
      prevRoundId = rounds[index + 1].id;
    }
  }

  // 2. Fetch rankings for the target round
  const { data: currentData, error } = await supabase
    .from('rankings')
    .select('*')
    .eq('round_id', targetRoundId)
    .order('rank', { ascending: true });

  if (error) {
    console.error('Error fetching drivers:', error);
    return { drivers: [], columns: DEFAULT_COLUMNS };
  }

  // 3. Fetch rankings for the previous round to calculate trend
  let prevRankingsMap = new Map<string, number>();
  if (prevRoundId) {
    const { data: prevData } = await supabase
      .from('rankings')
      .select('driver_id, rank')
      .eq('round_id', prevRoundId);
    
    if (prevData) {
      prevData.forEach((d: any) => {
        prevRankingsMap.set(String(d.driver_id), d.rank);
      });
    }
  }

  let columns: string[] = [];
  
  // 4. Try to find __METADATA__ row first to get columns
  const metadataRow = currentData.find((d: any) => d.driver_id === '__METADATA__');
  if (metadataRow && metadataRow.display_races) {
    try {
      const parsed = JSON.parse(metadataRow.display_races);
      if (parsed && Array.isArray(parsed.columns)) {
        columns = parsed.columns;
      }
    } catch (e) {
      console.warn('Failed to parse metadata columns:', e);
    }
  }

  let jsonCount = 0;

  // Map database snake_case to TypeScript camelCase
  const drivers = currentData
    .filter((d: any) => d.driver_id !== '__METADATA__') // Filter out metadata row
    .map((d: any) => {
      let extraData: any = {};
      let displayRaces = d.display_races;

      // Try parsing display_races as JSON
      if (typeof d.display_races === 'string' && d.display_races.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(d.display_races);
          if (parsed && typeof parsed === 'object') {
             // If columns not found in metadata, try to infer from data
             if (columns.length === 0) {
                 jsonCount++;
                 // Capture columns. Prefer the 2nd valid JSON (jsonCount === 2) as it's more likely to be correct data
                 // but take the 1st one initially as a fallback.
                 if (jsonCount === 1) {
                     columns = Object.keys(parsed);
                 } else if (jsonCount === 2) {
                     columns = Object.keys(parsed);
                 }
             }
             extraData.rawJson = parsed;

             // Map Chinese keys from JSON to our internal structure
             // Keys: "排名", "车手ID", "等级", "积分", "安全分", "领奖台", "完赛 | 总场次"
             if (parsed['排名']) extraData.rank = parseInt(parsed['排名']);
             if (parsed['车手ID']) extraData.name = parsed['车手ID'];
             if (parsed['等级']) {
               const tierVal = parsed['等级'];
               // Map 'Rookie' to 'R' to match the DriverTier enum and icon filename
               extraData.tier = tierVal === 'Rookie' ? 'R' : tierVal;
             }
             if (parsed['积分']) extraData.points = parseInt(parsed['积分']);
             if (parsed['安全分']) extraData.safetyScore = parseInt(parsed['安全分']);
             if (parsed['领奖台']) extraData.podiums = parseInt(parsed['领奖台']);
             
             // Once we successfully parse the JSON, we should NOT show the raw JSON string anymore.
              // Default displayRaces to undefined so it doesn't show garbage.
              displayRaces = undefined;

              // Find key for races data flexibly
              const racesKey = Object.keys(parsed).find(k => k.includes('完赛') && (k.includes('总场次') || k.includes('场次')));
              
              if (racesKey && parsed[racesKey]) {
                 const raceStr = String(parsed[racesKey]);
                 // Handle both full-width and half-width pipes, with or without spaces
                 const parts = raceStr.split(/[|｜]/);
                 
                 if (parts.length === 2) {
                   const finished = parseInt(parts[0].trim());
                   const total = parseInt(parts[1].trim());
                   
                   if (!isNaN(finished)) extraData.finishedRaces = finished;
                   if (!isNaN(total)) extraData.totalRaces = total;
                 } else {
                   // If we can't split it into two numbers, just show the string value
                   displayRaces = raceStr;
                 }
              }
          }
        } catch (e) {
          // Ignore parsing error, fallback to raw value
          console.warn('Failed to parse display_races JSON for driver:', d.driver_id, e);
        }
      }

      // Calculate Trend
      let trend = RankTrend.STABLE;
      const currentRank = extraData.rank !== undefined ? extraData.rank : d.rank;
      const driverId = String(d.driver_id);
      
      // Only calculate trend if we have a previous round to compare against
      if (prevRoundId) {
        if (prevRankingsMap.has(driverId)) {
            const prevRank = prevRankingsMap.get(driverId)!;
            if (currentRank < prevRank) trend = RankTrend.UP;
            else if (currentRank > prevRank) trend = RankTrend.DOWN;
            else trend = RankTrend.STABLE;
        } else {
            // Driver was not in the previous round
            trend = RankTrend.NEW;
        }
      } else {
          // If no previous round (e.g. first round), everyone is STABLE
          trend = RankTrend.STABLE;
      }

      return {
        id: String(d.driver_id), // Ensure string
        name: String(extraData.name || d.driver_id || ''), // Ensure string
        tier: (extraData.tier || d.tier) as DriverTier,
        points: extraData.points !== undefined ? extraData.points : d.points,
        safetyScore: extraData.safetyScore !== undefined ? extraData.safetyScore : d.safety_score,
        podiums: extraData.podiums !== undefined ? extraData.podiums : d.podiums,
        finishedRaces: extraData.finishedRaces !== undefined ? extraData.finishedRaces : d.finished_races,
        totalRaces: extraData.totalRaces !== undefined ? extraData.totalRaces : d.total_races,
        displayRaces: displayRaces,
        rank: extraData.rank !== undefined ? extraData.rank : d.rank,
        trend: trend,
        rawJson: extraData.rawJson,
      };
    });

  if (columns.length === 0) {
    columns = DEFAULT_COLUMNS;
  }

  return { drivers, columns };
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
