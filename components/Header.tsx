import React from "react";
import { BookOpen, Flag } from "lucide-react";
import { SERIES_BANNERS } from "../constants";
import { Series, SeriesRules } from "../types";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  title?: string;
  seriesId?: string;
  rules?: SeriesRules;
  // 移动端赛事切换（桌面端由 FilterBar 独立处理）
  seriesList?: Series[];
  selectedSeries?: string;
  onSeriesChange?: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  title = "株洲速度节",
  seriesId = "zhuzhou",
  rules,
  seriesList = [],
  selectedSeries = "",
  onSeriesChange,
}) => {
  const bannerUrl = SERIES_BANNERS[seriesId] || SERIES_BANNERS.zhuzhou;

  const openRules = () => {
    window.open("https://www.mozaracing.cn/sys-nd/371.html", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      {/* 背景大图 */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${bannerUrl})` }}
      />
      {/* 底部向上渐变蒙层：颜色跟随主题（CSS控制） */}
      <div className="banner-overlay absolute inset-0" />
      {/* 右侧蒙层 */}
      <div className="banner-overlay-side absolute inset-0" />

      {/* 内容层 */}
      <div className="relative z-10 flex flex-col justify-between px-6 py-5 text-white
        min-h-[280px] md:min-h-[380px] md:px-10 md:py-8">

        {/* 顶部徽标行 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 text-xs font-semibold backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              赛事进行中
            </span>
          </div>
          <div className="flex items-center gap-2">
            {rules && (
              <button
                onClick={openRules}
                className="flex h-8 items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 text-xs font-medium text-white/90 backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
              >
                <BookOpen className="h-3.5 w-3.5" /> 赛事规则
              </button>
            )}
            <ThemeToggle size="sm" />
          </div>
        </div>

        {/* 底部：标题 + 移动端赛事切换条 */}
        <div className="space-y-3">
          {/* 装饰线 */}
          <div className="flex items-center gap-3">
            <Flag className="h-5 w-5 text-primary" />
            <div className="h-px flex-1 bg-gradient-to-r from-primary/60 to-transparent" />
          </div>
          <h1 className="text-xl font-black leading-tight tracking-tight drop-shadow-lg md:text-4xl">
            {title}
          </h1>

          {/* 移动端赛事切换横向滚动条，桌面端隐藏 */}
          {seriesList.length > 1 && (
            <div
              className="-mx-1 flex gap-2 overflow-x-auto pb-1 md:hidden"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(255,255,255,0.25) transparent",
              }}
            >
              {seriesList.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSeriesChange?.(s.id)}
                  className={`shrink-0 rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                    selectedSeries === s.id
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/40"
                      : "border border-white/25 bg-white/10 text-white/80 backdrop-blur-sm hover:bg-white/20"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
