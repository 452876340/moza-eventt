
import React from 'react';
import { SERIES_BANNERS } from '../constants';

interface HeaderProps {
  title?: string;
  seriesId?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "株洲速度节", seriesId = 'zhuzhou' }) => {
  const bannerUrl = SERIES_BANNERS[seriesId] || SERIES_BANNERS['zhuzhou'];

  return (
    <div className="w-full @container">
      <div className="relative min-h-[360px] md:min-h-[520px] w-full flex flex-col items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 hover:scale-105" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4) 0%, rgba(18, 14, 10, 1) 95%), url("${bannerUrl}")` 
          }}
        />
        <div className="relative z-10 w-full max-w-[1200px] px-6 pt-4 md:pt-12 pb-10 md:pb-16 flex flex-col gap-10">
          <div className="flex flex-col gap-3 md:gap-4 text-center md:text-left">
            <div className="inline-flex self-center md:self-start items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/40 text-primary px-4 py-1.5 rounded-full whitespace-nowrap">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">赛事活动进行中</span>
            </div>
            <h1 className="text-white text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-tight drop-shadow-2xl">
              {title}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
