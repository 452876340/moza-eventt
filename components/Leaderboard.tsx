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
}

const Leaderboard: React.FC<LeaderboardProps> = ({ drivers, seriesId, isLoading = false }) => {
  const [filterTier, setFilterTier] = useState<string>('all');

  const filteredDrivers = drivers.filter(d => {
    if (filterTier === 'all') return true;
    if (filterTier === 'S') return d.tier === DriverTier.S;
    if (filterTier === 'AB') return d.tier === DriverTier.A || d.tier === DriverTier.B;
    if (filterTier === 'CR') return d.tier === DriverTier.C || d.tier === DriverTier.R;
    return true;
  });

  const isRally = seriesId === 'rally';

  return (
    <div className="w-full max-w-[1200px] px-6 mb-12 relative z-20">
      <div className="bg-white dark:bg-[#1a1612] rounded-2xl shadow-2xl border border-[#e6e1db] dark:border-[#2d261f] overflow-hidden">
        <div className="px-8 py-6 border-b border-[#e6e1db] dark:border-[#2d261f] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xl font-black uppercase tracking-tight italic">赛事积分榜</h3>
          
          {/* Only show Tier Filter if not Rally */}
          {!isRally && (
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
              <tr className="sticky top-0 z-20 bg-[#fcfbf9] dark:bg-[#231d16] text-xs md:text-sm font-bold text-[#8a7960]">
                <th className="px-1 py-1 md:px-4 md:py-1.5 whitespace-nowrap">排名</th>
                <th className="sticky left-0 z-10 bg-[#fcfbf9] dark:bg-[#231d16] px-1 py-1 md:px-4 md:py-1.5 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] whitespace-nowrap">车手ID</th>
                {!isRally && <th className="px-1 py-1 md:px-4 md:py-1.5 whitespace-nowrap">等级</th>}
                <th className="px-1 py-1 md:px-4 md:py-1.5 text-center text-primary whitespace-nowrap">积分</th>
                {!isRally && <th className="px-1 py-1 md:px-4 md:py-1.5 text-center whitespace-nowrap">安全分</th>}
                <th className="px-1 py-1 md:px-4 md:py-1.5 text-center whitespace-nowrap">领奖台</th>
                <th className="px-1 py-1 md:px-4 md:py-1.5 text-right whitespace-nowrap">完赛 | 总场次</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e1db] dark:divide-[#2d261f]">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="animate-pulse">
                    <td className="px-1 py-1 md:px-4 md:py-1.5">
                      <div className="h-6 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </td>
                    <td className="sticky left-0 z-10 bg-white dark:bg-[#1a1612] px-1 py-1 md:px-4 md:py-1.5 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                       <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </td>
                    {!isRally && (
                      <td className="px-1 py-1 md:px-4 md:py-1.5">
                        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      </td>
                    )}
                    <td className="px-1 py-1 md:px-4 md:py-1.5">
                       <div className="h-6 w-12 mx-auto bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </td>
                    {!isRally && (
                      <td className="px-1 py-1 md:px-4 md:py-1.5">
                        <div className="h-6 w-12 mx-auto bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </td>
                    )}
                    <td className="px-1 py-1 md:px-4 md:py-1.5">
                      <div className="h-6 w-8 mx-auto bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </td>
                    <td className="px-1 py-1 md:px-4 md:py-1.5">
                      <div className="h-6 w-16 ml-auto bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </td>
                  </tr>
                ))
              ) : (
                filteredDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-[#fcfbf9] dark:hover:bg-[#231d16] transition-colors group">
                  <td className="px-1 py-1 md:px-4 md:py-1.5">
                    <div className="flex items-center gap-1 md:gap-2">
                      <span className={`text-base md:text-xl font-black italic ${driver.rank === 1 ? 'text-yellow-500' : driver.rank === 2 ? 'text-slate-400' : driver.rank === 3 ? 'text-amber-600' : ''}`}>
                        {driver.rank}
                      </span>
                      {driver.trend === RankTrend.UP && <span className="material-symbols-outlined text-green-500 text-sm md:text-base font-bold">arrow_drop_up</span>}
                      {driver.trend === RankTrend.DOWN && <span className="material-symbols-outlined text-red-500 text-sm md:text-base font-bold">arrow_drop_down</span>}
                      {driver.trend === RankTrend.STABLE && <span className="material-symbols-outlined text-gray-400 text-sm md:text-base font-bold">remove</span>}
                      {driver.trend === RankTrend.NEW && <span className="material-symbols-outlined text-blue-500 text-sm md:text-base font-bold">fiber_new</span>}
                    </div>
                  </td>
                  <td className="sticky left-0 z-10 bg-white dark:bg-[#1a1612] group-hover:bg-[#fcfbf9] dark:group-hover:bg-[#231d16] px-1 py-1 md:px-4 md:py-1.5 font-bold text-xs md:text-lg text-[#181511] dark:text-white group-hover:text-primary transition-colors shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] whitespace-nowrap">
                    {driver.name || '-'}
                  </td>
                  
                  {!isRally && (
                    <td className="px-1 py-1 md:px-4 md:py-1.5">
                      <div className="flex justify-start">
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
                  )}
                  
                  <td className="px-1 py-1 md:px-4 md:py-1.5 text-center font-bold text-primary text-sm md:text-lg">{driver.points}</td>
                  
                  {!isRally && <td className="px-1 py-1 md:px-4 md:py-1.5 text-center font-bold text-sm md:text-lg">{driver.safetyScore}</td>}
                  
                  <td className="px-1 py-1 md:px-4 md:py-1.5 text-center text-sm md:text-lg">{driver.podiums}</td>
                  <td className="px-1 py-1 md:px-4 md:py-1.5 text-right font-mono text-[10px] md:text-sm font-bold text-[#8a7960]">
                    {driver.displayRaces ? (
                      <span className="text-[#181511] dark:text-white">{driver.displayRaces.replace('｜', ' | ')}</span>
                    ) : (
                      <>
                        <span className="text-[#181511] dark:text-white">{driver.finishedRaces}</span> | {driver.totalRaces}
                      </>
                    )}
                  </td>
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
