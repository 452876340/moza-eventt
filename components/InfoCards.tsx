
import React from 'react';

const InfoCards: React.FC = () => {
  return (
    <div className="w-full max-w-[1200px] px-6 grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
      {/* Racing Group Card */}
      <div className="bg-white dark:bg-[#1a1612] rounded-2xl p-8 border border-[#e6e1db] dark:border-[#2d261f] shadow-lg flex flex-col gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12">
          <span className="material-symbols-outlined text-9xl">emoji_events</span>
        </div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-tier-s/10 rounded-lg">
              <span className="material-symbols-outlined text-tier-s">emoji_events</span>
            </div>
            <h4 className="text-xl font-black uppercase tracking-tight italic">竞速组</h4>
          </div>
          <span className="text-[10px] font-black bg-tier-s/10 text-tier-s px-3 py-1 rounded-full uppercase">S, A, B 级别奖励</span>
        </div>
        <div className="space-y-4 relative z-10">
          <div className="p-4 rounded-xl bg-[#fcfbf9] dark:bg-[#231d16] border border-[#e6e1db] dark:border-[#2d261f]">
            <p className="text-xs font-black uppercase text-primary mb-1">冠军奖励</p>
            <p className="text-sm font-medium leading-relaxed">总排名前3名的选手将分享 $50,000 赛季奖金池，并受邀参加亚洲 GT 邀请赛。</p>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm">
              <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
              <span>在所有比赛周末提供全方位技术支持和VIP休息区访问权限。</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
              <span>为顶尖车手提供 S 级专属定制车漆设计包。</span>
            </li>
          </ul>
        </div>
        <button className="w-full py-4 mt-2 bg-background-dark dark:bg-primary text-primary dark:text-black font-black uppercase tracking-widest text-xs rounded-xl hover:scale-[1.02] transition-transform shadow-lg">
          查看级别条例
        </button>
      </div>

      {/* Rookie / C Group Card */}
      <div className="bg-white dark:bg-[#1a1612] rounded-2xl p-8 border border-[#e6e1db] dark:border-[#2d261f] shadow-lg flex flex-col gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform -rotate-12">
          <span className="material-symbols-outlined text-9xl">school</span>
        </div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-tier-rookie/10 rounded-lg">
              <span className="material-symbols-outlined text-tier-rookie">school</span>
            </div>
            <h4 className="text-xl font-black uppercase tracking-tight italic">新秀 / C 组</h4>
          </div>
          <span className="text-[10px] font-black bg-tier-rookie/10 text-tier-rookie px-3 py-1 rounded-full uppercase">职业发展奖励</span>
        </div>
        <div className="space-y-4 relative z-10">
          <div className="p-4 rounded-xl bg-[#fcfbf9] dark:bg-[#231d16] border border-[#e6e1db] dark:border-[#2d261f]">
            <p className="text-xs font-black uppercase text-tier-rookie mb-1">入门奖励</p>
            <p className="text-sm font-medium leading-relaxed">为进步最快的选手颁发“最具潜力车手”奖杯，并提供价值高达 $2,000 的装备券。</p>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm">
              <span className="material-symbols-outlined text-tier-rookie text-lg">star</span>
              <span>由 S 级职业车手提供专属的一对一指导课程。</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <span className="material-symbols-outlined text-tier-rookie text-lg">star</span>
              <span>在株洲赛车实验室享受 20 小时的免费模拟器使用时间。</span>
            </li>
          </ul>
        </div>
        <button className="w-full py-4 mt-2 bg-[#f5f3f0] dark:bg-[#2d261f] text-[#181511] dark:text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-tier-rookie hover:text-white transition-all shadow-md">
          申请加入计划
        </button>
      </div>
    </div>
  );
};

export default InfoCards;
