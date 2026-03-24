import React, { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Minus, Search, Sparkles } from "lucide-react";
import { Driver, DriverTier, RankTrend, RaceRound } from "../types";
import tierS from "@/assets/ico/S.png";
import tierA from "@/assets/ico/A.png";
import tierB from "@/assets/ico/B.png";
import tierC from "@/assets/ico/C.png";
import tierR from "@/assets/ico/R.png";

const tierIcons: Record<string, string> = { S: tierS, A: tierA, B: tierB, C: tierC, R: tierR, Rookie: tierR };

// ===== 登奖台组件（仅桌面端显示） =====
interface PodiumProps {
  drivers: Driver[];
  getValue: (driver: Driver, col: string) => unknown;
}

// 顺序对应 rank1, rank2, rank3 的配色
const medalStyles = [
  {
    border: "border-[hsl(43,96%,56%)]",
    bg: "bg-[hsl(43,96%,56%,0.10)]",
    text: "text-gold",
    glow: "shadow-[0_0_24px_hsl(43,96%,56%,0.25)]",
    label: "冠军",
    labelColor: "text-gold",
    num: "1",
  },
  {
    border: "border-[hsl(220,10%,70%)]",
    bg: "bg-[hsl(220,10%,70%,0.08)]",
    text: "text-silver",
    glow: "shadow-[0_0_16px_hsl(220,10%,70%,0.2)]",
    label: "亚军",
    labelColor: "text-silver",
    num: "2",
  },
  {
    border: "border-[hsl(24,65%,52%)]",
    bg: "bg-[hsl(24,65%,52%,0.08)]",
    text: "text-bronze",
    glow: "shadow-[0_0_14px_hsl(24,65%,52%,0.18)]",
    label: "季军",
    labelColor: "text-bronze",
    num: "3",
  },
];

// 显示顺序：亚军(idx1) 冠军(idx0) 季军(idx2)，冠军居中且更高
const podiumOrder = [1, 0, 2];

const PodiumSection: React.FC<PodiumProps> = ({ drivers, getValue }) => {
  const sorted = [...drivers].sort((a, b) => a.rank - b.rank);
  const scoreCol = ["积分", "赛事分"].find((c) => sorted[0] && getValue(sorted[0], c) !== "-") ?? "积分";

  // 名次底纹数字颜色（与边框色系一致）
  const numColors = [
    "hsl(43,96%,56%)",   // 金
    "hsl(220,10%,70%)",  // 银
    "hsl(24,65%,52%)",   // 铜
  ];

  return (
    <div className="hidden border-b border-border/50 md:block">
      <div className="flex items-stretch">
        {podiumOrder.map((idx, pos) => {
          const driver = sorted[idx];
          if (!driver) return null;
          const s = medalStyles[idx];
          const isFirst = idx === 0;

          return (
            <div
              key={driver.id}
              className={`relative flex flex-1 flex-col justify-center overflow-hidden px-6 py-5 text-center
                ${s.bg}
                ${pos === 0 ? "border-r border-border/40" : ""}
                ${pos === 2 ? "border-l border-border/40" : ""}
                ${isFirst ? "py-7" : ""}
              `}
            >
              {/* 大号底纹数字 */}
              <span
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none font-black leading-none"
                style={{
                  fontSize: isFirst ? "7rem" : "5.5rem",
                  color: numColors[idx],
                  opacity: 0.08,
                }}
              >
                {s.num}
              </span>

              {/* 名次标签 */}
              <p className={`relative mb-1.5 text-xs font-bold tracking-widest ${s.labelColor}`}>{s.label}</p>
              {/* 车手名 */}
              <p className={`relative truncate font-bold text-foreground ${isFirst ? "text-lg" : "text-sm"}`}>{driver.name}</p>
              {/* 积分 */}
              <p className={`relative mt-1 font-black tabular-nums ${s.text} ${isFirst ? "text-3xl" : "text-2xl"}`}>
                {String(getValue(driver, scoreCol))}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface LeaderboardProps {
  drivers: Driver[];
  seriesId: string;
  isLoading?: boolean;
  columns?: string[];
  rounds?: RaceRound[];
  selectedRound?: string;
  onRoundChange?: (id: string) => void;
  search?: string;
  onSearchChange?: (val: string) => void;
}

// 前三名专属样式
const podiumConfig = [
  {
    border: "border-l-2 border-l-[hsl(43,96%,56%)]",
    bg: "bg-[hsl(43,96%,56%,0.06)]",
    hover: "hover:bg-[hsl(43,96%,56%,0.10)]",
    rankClass: "text-gold font-black text-xl",
    medal: "🥇",
  },
  {
    border: "border-l-2 border-l-[hsl(220,10%,70%)]",
    bg: "bg-[hsl(220,10%,70%,0.05)]",
    hover: "hover:bg-[hsl(220,10%,70%,0.09)]",
    rankClass: "text-silver font-black text-xl",
    medal: "🥈",
  },
  {
    border: "border-l-2 border-l-[hsl(24,65%,52%)]",
    bg: "bg-[hsl(24,65%,52%,0.05)]",
    hover: "hover:bg-[hsl(24,65%,52%,0.09)]",
    rankClass: "text-bronze font-black text-xl",
    medal: "🥉",
  },
];

const Leaderboard: React.FC<LeaderboardProps> = ({ drivers, seriesId, isLoading = false, columns = [], rounds = [], selectedRound = "", onRoundChange, search = "", onSearchChange }) => {
  const [expandedRowIds, setExpandedRowIds] = useState<Record<string, boolean>>({});
  const isRally = seriesId === "rally";

  const displayColumns =
    columns.length > 0
      ? columns
      : ["排名", "车手ID", "等级", "积分", "安全分", "领奖台", "完赛 | 总场次"].filter(
          (c) => !isRally || (c !== "等级" && c !== "安全分")
        );

  const mobileScoreColumn = displayColumns.includes("积分") ? "积分" : displayColumns.includes("赛事分") ? "赛事分" : "";
  const mobileCoreColumns = ["排名", "车手ID", "等级", mobileScoreColumn].filter((c) => c && displayColumns.includes(c));
  const mobileSecondaryColumns = displayColumns.filter((c) => !mobileCoreColumns.includes(c));
  const hasMobileSecondaryColumns = mobileSecondaryColumns.length > 0;
  const noRightAlignColumns = new Set(["排名", "车手ID", "等级"]);

  const mobileGridClass = useMemo(() => {
    if (mobileSecondaryColumns.length === 2) return "grid-cols-2";
    if (mobileSecondaryColumns.length === 3) return "grid-cols-3";
    return "grid-cols-2";
  }, [mobileSecondaryColumns.length]);

  const filteredDrivers = useMemo(() => {
    const base = search
      ? drivers.filter(
          (d) =>
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.id.toLowerCase().includes(search.toLowerCase())
        )
      : drivers;
    return [...base].sort((a, b) => a.rank - b.rank);
  }, [drivers, search]);

  const trendNode = (trend: RankTrend) => {
    if (trend === RankTrend.UP) return <ArrowUp className="h-3.5 w-3.5 text-emerald-400" />;
    if (trend === RankTrend.DOWN) return <ArrowDown className="h-3.5 w-3.5 text-rose-400" />;
    if (trend === RankTrend.NEW) return <Sparkles className="h-3.5 w-3.5 text-sky-400" />;
    return <Minus className="h-3.5 w-3.5 text-muted-foreground/40" />;
  };

  const getValue = (driver: Driver, col: string) => {
    if (col === "完赛 | 总场次") {
      if (driver.displayRaces) return driver.displayRaces.replace("｜", " | ");
      return `${driver.finishedRaces ?? "-"} | ${driver.totalRaces ?? "-"}`;
    }
    if (col === "积分") return driver.points;
    if (col === "赛事分") return driver.rawJson?.["赛事分"] ?? driver.points;
    if (col === "安全分") return driver.safetyScore ?? "-";
    if (col === "领奖台") return driver.podiums;
    if (driver.rawJson && driver.rawJson[col] !== undefined) return driver.rawJson[col];
    return "-";
  };

  const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768;

  const toggleExpand = (driverId: string) => {
    if (!isMobile() || !hasMobileSecondaryColumns) return;
    setExpandedRowIds((prev) => ({ ...prev, [driverId]: !prev[driverId] }));
  };

  const tierFilters = [
    { key: "all", label: "全部" },
    { key: "S", label: "S级" },
    { key: "AB", label: "A/B级" },
    { key: "CR", label: "C/R级" },
  ];
  void tierFilters; // 保留备用，暂不显示

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* 榜单头部：左侧标题+搜索，右侧轮次 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
        {/* 左侧：标题 + 搜索 */}
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-base font-bold tracking-wide text-foreground whitespace-nowrap">
            赛事积分榜
            <span className="ml-2 text-xs font-normal text-muted-foreground">共 {filteredDrivers.length} 位车手</span>
          </h3>
          {/* 搜索框 */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="搜索车手"
              className="h-7 w-36 rounded-full border border-border bg-secondary/50 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/20 md:w-44"
            />
          </div>
        </div>
        {/* 右侧：轮次切换 */}
        {rounds.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {rounds.map((r) => (
              <button
                key={String(r.id)}
                onClick={() => onRoundChange?.(String(r.id))}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  selectedRound === String(r.id)
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 登奖台区：前三名 */}
      {!isLoading && filteredDrivers.filter((d) => d.rank <= 3).length === 3 && (
        <PodiumSection drivers={filteredDrivers.filter((d) => d.rank <= 3)} getValue={getValue} />
      )}

      {/* 表格 */}
      <div className="custom-scrollbar max-h-[520px]">
        <table className="w-full table-auto text-sm">
          <thead className="sticky top-0 z-20 bg-card/95 backdrop-blur">
            <tr className="border-b border-border/60">
              {displayColumns.map((col) => (
                <th
                  key={col}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap
                    ${col === "排名" ? "w-14" : ""}
                    ${col === "等级" ? "w-16 text-center" : ""}
                    ${col === "车手ID" ? "text-left" : ""}
                    ${!noRightAlignColumns.has(col) ? "text-right" : "text-left"}
                    ${mobileSecondaryColumns.includes(col) ? "hidden md:table-cell" : ""}
                  `}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {isLoading ? (
              <tr>
                <td colSpan={displayColumns.length} className="px-4 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span className="text-sm text-muted-foreground">加载中...</span>
                  </div>
                </td>
              </tr>
            ) : filteredDrivers.length === 0 ? (
              <tr>
                <td colSpan={displayColumns.length} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  当前无符合条件的车手数据。
                </td>
              </tr>
            ) : (
              filteredDrivers.map((driver) => {
                const expanded = Boolean(expandedRowIds[driver.id]);
                // 真实排名决定是否用podium样式（前三名）
                const podium = driver.rank >= 1 && driver.rank <= 3 ? podiumConfig[driver.rank - 1] : null;

                return (
                  <React.Fragment key={driver.id}>
                    <tr
                      onClick={() => toggleExpand(driver.id)}
                      className={`transition-colors
                        ${podium ? `${podium.bg} ${podium.hover} ${podium.border}` : "hover:bg-secondary/40"}
                        ${hasMobileSecondaryColumns ? "cursor-pointer md:cursor-default" : ""}
                      `}
                    >
                      {displayColumns.map((col) => {
                        if (mobileSecondaryColumns.includes(col)) return null;

                        if (col === "排名") {
                          return (
                            <td key={col} className="px-4 py-3.5">
                              <div className="flex items-center gap-1.5">
                                {podium ? (
                                  <span className={`${podium.rankClass} leading-none`}>{driver.rank}</span>
                                ) : (
                                  <span className="font-semibold text-foreground">{driver.rank}</span>
                                )}
                                {trendNode(driver.trend)}
                              </div>
                            </td>
                          );
                        }

                        if (col === "车手ID") {
                          return (
                            <td key={col} className="w-full max-w-0 px-4 py-3.5">
                              <div className="flex items-center gap-2">
                                <span className="block truncate whitespace-nowrap font-semibold text-foreground">
                                  {driver.name || "-"}
                                </span>
                              </div>
                            </td>
                          );
                        }

                        if (col === "等级") {
                          const safeTier = String(driver.tier || "R");
                          return (
                            <td key={col} className="px-4 py-3.5 text-center">
                              <div className="flex items-center justify-center" style={{ width: "38px", margin: "0 auto" }}>
                                <img src={tierIcons[safeTier] || tierIcons.R} alt={safeTier} className="h-auto w-full object-contain" />
                              </div>
                            </td>
                          );
                        }

                        const value = getValue(driver, col);
                        const isScoreCol = col === "积分" || col === "赛事分";
                        return (
                          <td
                            key={col}
                            className={`px-4 py-3.5 whitespace-nowrap ${!noRightAlignColumns.has(col) ? "text-right" : ""}`}
                          >
                            <div className={`flex items-center gap-1 ${!noRightAlignColumns.has(col) ? "justify-end" : ""}`}>
                              <span className={isScoreCol ? "text-base font-black text-primary tabular-nums" : "tabular-nums text-foreground/80"}>
                                {value}
                              </span>
                              {hasMobileSecondaryColumns && col === mobileScoreColumn && (
                                <span className="md:hidden">
                                  {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}

                      {displayColumns
                        .filter((col) => mobileSecondaryColumns.includes(col))
                        .map((col) => (
                          <td key={col} className={`hidden px-4 py-3.5 tabular-nums md:table-cell ${!noRightAlignColumns.has(col) ? "text-right text-foreground/80" : ""}`}>
                            {col === "等级" ? null : getValue(driver, col)}
                          </td>
                        ))}
                    </tr>

                    {hasMobileSecondaryColumns && (
                      <tr className="md:hidden">
                        <td colSpan={mobileCoreColumns.length} className="p-0">
                          <div
                            className={`grid bg-secondary/30 transition-[grid-template-rows] duration-300 ease-out ${
                              expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                            }`}
                          >
                            <div className="overflow-hidden">
                              <div className="p-3">
                                <div className={`grid gap-2 ${mobileGridClass}`}>
                                  {mobileSecondaryColumns.map((col) => (
                                    <div key={`${driver.id}-${col}`} className="rounded-lg border border-border bg-card p-2.5">
                                      <p className="text-[11px] text-muted-foreground">{col}</p>
                                      <p className="mt-1 text-sm font-bold tabular-nums text-foreground">{String(getValue(driver, col))}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 底部提示 */}
      <div className="border-t border-border/50 px-5 py-3">
        <p className="text-xs text-muted-foreground">数据定期更新 · 向下滚动可查看更多名次</p>
      </div>
    </div>
  );
};

export default Leaderboard;
