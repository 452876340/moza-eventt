import React, { useState, useEffect, useRef } from 'react';
import { SeriesRules } from '../types';
import xcxImg from '@/src/assets/xcx.jpg';

interface SeriesInfoProps {
  rules: SeriesRules;
}

const SeriesInfo: React.FC<SeriesInfoProps> = ({ rules }) => {
  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showQR && 
          qrRef.current && 
          !qrRef.current.contains(event.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node)
         ) {
        setShowQR(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showQR]);

  return (
    <>
      <div className="w-full max-w-[1200px] px-6 grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
        {rules.groups.map((group, index) => {
          // Determine style based on index (0 is usually primary/racing, 1 is secondary/rookie)
          const isPrimary = index === 0;
          
          return (
            <div 
              key={index} 
              className="bg-white dark:bg-[#1a1612] rounded-2xl p-8 border border-[#e6e1db] dark:border-[#2d261f] shadow-lg flex flex-col gap-6 relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform ${isPrimary ? 'rotate-12' : '-rotate-12'}`}>
                <span className="material-symbols-outlined text-9xl">{isPrimary ? 'emoji_events' : 'school'}</span>
              </div>
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isPrimary ? 'bg-tier-s/10' : 'bg-tier-rookie/10'}`}>
                    <span className={`material-symbols-outlined ${isPrimary ? 'text-tier-s' : 'text-tier-rookie'}`}>
                      {isPrimary ? 'emoji_events' : 'school'}
                    </span>
                  </div>
                  <h4 className="text-xl font-black uppercase tracking-tight italic">{group.title}</h4>
                </div>
                {group.requirements && (
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${isPrimary ? 'bg-tier-s/10 text-tier-s' : 'bg-tier-rookie/10 text-tier-rookie'}`}>
                    {group.requirements}
                  </span>
                )}
              </div>
              
              <div className="space-y-4 relative z-10 flex-grow">
                <div className="p-4 rounded-xl bg-[#fcfbf9] dark:bg-[#231d16] border border-[#e6e1db] dark:border-[#2d261f]">
                  <p className={`text-xs font-black uppercase mb-1 ${isPrimary ? 'text-primary' : 'text-tier-rookie'}`}>
                    {isPrimary ? '赛季奖励' : '周常奖励'}
                  </p>
                  <p className="text-sm font-medium leading-relaxed">
                    {group.description}
                  </p>
                </div>
                
                <ul className="space-y-3">
                  {group.weeklyReward && (
                    <li className="flex items-start gap-3 text-sm">
                      <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                      <span className="font-bold text-gray-700 dark:text-gray-300">周常：{group.weeklyReward}</span>
                    </li>
                  )}
                  
                  {group.seasonReward && (
                    <div className="space-y-2 mt-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-800">
                      <li className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-yellow-500 text-lg">emoji_events</span>
                          <span>冠军</span>
                        </span>
                        <span className="font-mono font-bold">{group.seasonReward.first}</span>
                      </li>
                      <li className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-gray-400 text-lg">emoji_events</span>
                          <span>亚军</span>
                        </span>
                        <span className="font-mono font-bold">{group.seasonReward.second}</span>
                      </li>
                      <li className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-orange-700 text-lg">emoji_events</span>
                          <span>季军</span>
                        </span>
                        <span className="font-mono font-bold">{group.seasonReward.third}</span>
                      </li>
                      {group.seasonReward.others && (
                        <li className="flex items-center justify-between text-sm mt-1 text-gray-500">
                          <span>其他</span>
                          <span>{group.seasonReward.others}</span>
                        </li>
                      )}
                    </div>
                  )}
                </ul>
              </div>
              
              <div className="relative w-full mt-2">
                 {!isPrimary && showQR && (
                   <div ref={qrRef} className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 bg-white dark:bg-[#1a1612] p-4 rounded-xl shadow-2xl border border-[#e6e1db] dark:border-[#2d261f] z-50 animate-in fade-in slide-in-from-bottom-2">
                      <div className="text-center">
                        <h3 className="text-lg font-black uppercase italic mb-2 text-[#181511] dark:text-white">加入赛事</h3>
                        <div className="bg-white p-2 rounded-lg border border-dashed border-[#e6e1db] mx-auto w-48 h-48 flex items-center justify-center mb-2">
                          <img src={xcxImg} alt="小程序二维码" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold">点击按钮关闭</p>
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-2 border-8 border-transparent border-t-white dark:border-t-[#1a1612]"></div>
                   </div>
                 )}

                 <button 
                  ref={!isPrimary ? buttonRef : null}
                  onClick={() => {
                    if (isPrimary) {
                      window.open('https://www.mozaracing.cn/sys-nd/371.html', '_blank');
                    } else {
                      setShowQR(!showQR);
                    }
                  }}
                  className={`w-full py-4 font-black uppercase tracking-widest text-xs rounded-xl hover:scale-[1.02] transition-transform shadow-lg ${
                  isPrimary 
                    ? 'bg-background-dark dark:bg-primary text-primary dark:text-black' 
                    : 'bg-[#f5f3f0] dark:bg-[#2d261f] text-[#181511] dark:text-white hover:bg-tier-rookie hover:text-white'
                }`}>
                  {isPrimary ? '查看完整规则' : showQR ? '关闭二维码' : '申请加入'}
                </button>
              </div>
            </div>
          );
        })}
      </div>


    </>
  );
};

export default SeriesInfo;
