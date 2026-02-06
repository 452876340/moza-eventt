import React, { useState } from 'react';
import { Driver, DriverTier, RankTrend } from '../types';
import tierS from '@/src/assets/ico/S.png';
import tierA from '@/src/assets/ico/A.png';
import tierB from '@/src/assets/ico/B.png';
import tierC from '@/src/assets/ico/C.png';
import tierR from '@/src/assets/ico/R.png';

const tierIcons: Record<string, string> = {
  S: tierS,
  A: tierA,
  B: tierB,
  C: tierC,
  R: tierR,
  Rookie: tierR
};

interface LeaderboardProps {
  drivers: Driver[];
  seriesId: string;
  isLoading?: boolean;
  columns?: string[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ drivers, seriesId, isLoading = false, columns = [] }) => {
  const [filterTier, setFilterTier] = useState<string>('all');

  const filteredDrivers = drivers.filter(d => {
    if (filterTier === 'all') return true;
    if (filterTier === 'S') return d.tier === DriverTier.S;
    if (filterTier === 'AB') return d.tier === DriverTier.A || d.tier === DriverTier.B;
    if (filterTier === 'CR') return d.tier === DriverTier.C || d.tier === DriverTier.R;
    return true;
  });

  const isRally = seriesId === 'rally';
  
  // Use passed columns or default if empty (fallback)
  const displayColumns = columns.length > 0 
    ? columns 
    : ['排名', '车手ID', '等级', '积分', '安全分', '领奖台', '完赛 | 总场次'].filter(c => !isRally || (c !== '等级' && c !== '安全分'));

  const getHeaderClass = (col: string) => {
    const base = "px-1 py-1 md:px-4 md:py-1.5 whitespace-nowrap";
    if (col === '车手ID') return `sticky left-0 z-30 bg-[#fcfbf9] dark:bg-[#231d16] ${base} shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]`;
    if (['积分', '赛事分'].includes(col)) return `${base} text-center text-primary`;
    if (col === '完赛 | 总场次') return `${base} text-right`;
    if (['安全分', '领奖台'].includes(col)) return `${base} text-center`;
    return `${base} text-center`; // Default centered
  };

  const getCellClass = (col: string) => {
    const base = "px-1 py-1 md:px-4 md:py-1.5";
    if (col === '车手ID') return `sticky left-0 z-20 bg-white dark:bg-[#1a1612] ${base} font-bold text-xs md:text-lg !text-[#181511] dark:!text-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] whitespace-nowrap`;
    if (['积分', '赛事分'].includes(col)) return `${base} text-center font-bold text-primary text-sm md:text-lg`;
    if (col === '完赛 | 总场次') return `${base} text-right font-mono text-[10px] md:text-sm font-bold text-[#8a7960]`;
    if (col === '安全分') return `${base} text-center font-bold text-sm md:text-lg`;
    if (col === '领奖台') return `${base} text-center text-sm md:text-lg`;
    
    // Default for unknown columns
    return `${base} text-center text-sm md:text-lg`;
  };

  return (
    <div className="w-full max-w-[1200px] px-6 mb-12 relative z-20">
      <div className="bg-white dark:bg-[#1a1612] rounded-2xl shadow-2xl border border-[#e6e1db] dark:border-[#2d261f] overflow-hidden">
        <div className="px-8 py-6 border-b border-[#e6e1db] dark:border-[#2d261f] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xl font-black uppercase tracking-tight italic">赛事积分榜</h3>
          
          {/* Only show Tier Filter if Tier column exists */}
          {displayColumns.includes('等级') && (
            <div className="flex gap-1 bg-[#f5f3f0] dark:bg-[#2d261f] p-1 rounded-full overflow-x-auto max-w-full w-full justify-between md:justify-start md:w-auto">
              <button 
                onClick={() => setFilterTier('all')}
                className={`flex-shrink-0 px-2 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filterTier === 'all' ? 'bg-primary text-black' : 'text-[#8a7960] hover:text-[#181511]'}`}
              >
                总排名
              </button>
              <button 
                onClick={() => setFilterTier('S')}
                className={`flex-shrink-0 px-2 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filterTier === 'S' ? 'bg-primary text-black' : 'text-[#8a7960] hover:text-[#181511]'}`}
              >
                S级
              </button>
              <button 
                onClick={() => setFilterTier('AB')}
                className={`flex-shrink-0 px-2 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filterTier === 'AB' ? 'bg-primary text-black' : 'text-[#8a7960] hover:text-[#181511]'}`}
              >
                A/B级
              </button>
              <button 
                onClick={() => setFilterTier('CR')}
                className={`flex-shrink-0 px-2 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filterTier === 'CR' ? 'bg-primary text-black' : 'text-[#8a7960] hover:text-[#181511]'}`}
              >
                C/R级
              </button>
            </div>
          )}
        </div>
        <div className="overflow-x-auto max-h-[350px] md:max-h-[600px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="sticky top-0 z-30 bg-[#fcfbf9] dark:bg-[#231d16] text-xs md:text-sm font-bold text-[#8a7960]">
                {displayColumns.map((col) => (
                  <th 
                    key={col} 
                    className={getHeaderClass(col)}
                    style={col === '车手ID' ? { transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)' } : undefined}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e1db] dark:divide-[#2d261f]">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="animate-pulse">
                    {displayColumns.map((col, colIndex) => (
                       <td key={col} className={getCellClass(col)} style={col === '车手ID' ? { transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)' } : undefined}>
                         <div className={`h-6 bg-gray-200 dark:bg-gray-700 rounded ${col === '车手ID' ? 'w-32' : 'w-12 mx-auto'}`}></div>
                       </td>
                    ))}
                  </tr>
                ))
              ) : (
                filteredDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-[#fcfbf9] dark:hover:bg-[#231d16] transition-colors group">
                  {displayColumns.map((col) => {
                    if (col === '排名') {
                      return (
                        <td key={col} className="px-1 py-1 md:px-4 md:py-1.5">
                          <div className="flex items-center gap-1 md:gap-2 justify-center">
                            <span className={`text-base md:text-xl font-black italic ${driver.rank === 1 ? 'text-yellow-500' : driver.rank === 2 ? 'text-slate-400' : driver.rank === 3 ? 'text-amber-600' : ''}`}>
                              {driver.rank}
                            </span>
                            {driver.trend === RankTrend.UP && <span className="material-symbols-outlined text-green-500 text-sm md:text-base font-bold">arrow_drop_up</span>}
                            {driver.trend === RankTrend.DOWN && <span className="material-symbols-outlined text-red-500 text-sm md:text-base font-bold">arrow_drop_down</span>}
                            {driver.trend === RankTrend.STABLE && <span className="material-symbols-outlined text-gray-400 text-sm md:text-base font-bold">remove</span>}
                            {driver.trend === RankTrend.NEW && <span className="material-symbols-outlined text-blue-500 text-sm md:text-base font-bold">fiber_new</span>}
                          </div>
                        </td>
                      );
                    }
                    if (col === '车手ID') {
                      return (
                        <td 
                          key={col}
                          style={{ transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)' }}
                          className={getCellClass(col)}
                        >
                          {driver.name || '-'}
                        </td>
                      );
                    }
                    if (col === '等级') {
                      return (
                        <td key={col} className="px-1 py-1 md:px-4 md:py-1.5">
                          <div className="flex justify-center">
                            <img 
                              src={tierIcons[driver.tier as string] || tierIcons['R']} 
                              alt={driver.tier} 
                              className="w-[40px] h-[40px] object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = `<span class="text-xs font-bold text-[#8a7960]">${driver.tier}</span>`;
                              }}
                            />
                          </div>
                        </td>
                      );
                    }
                    if (col === '完赛 | 总场次') {
                      return (
                        <td key={col} className={getCellClass(col)}>
                          {driver.displayRaces ? (
                            <span className="text-[#181511] dark:text-white">{driver.displayRaces.replace('｜', ' | ')}</span>
                          ) : (
                            <>
                              <span className="text-[#181511] dark:text-white">{driver.finishedRaces}</span> | {driver.totalRaces}
                            </>
                          )}
                        </td>
                      );
                    }
                    // Generic handling for known and unknown fields
                    let content: React.ReactNode = '-';
                    if (col === '积分') content = driver.points;
                    else if (col === '安全分') content = driver.safetyScore;
                    else if (col === '领奖台') content = driver.podiums;
                    else if (driver.rawJson && driver.rawJson[col] !== undefined) {
                        content = driver.rawJson[col];
                    }

                    return (
                        <td key={col} className={getCellClass(col)}>
                            {content}
                        </td>
                    );
                  })}
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-6 bg-white dark:bg-[#1a1612] text-center border-t border-[#e6e1db] dark:border-[#2d261f]">
          <p className="text-sm font-medium text-[#8a7960]">滑动查看更多，请持续关注赛事更新。</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
