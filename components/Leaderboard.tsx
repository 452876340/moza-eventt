import React, { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Dot, Minus, Sparkles } from "lucide-react";
import { Driver, DriverTier, RankTrend } from "../types";
import tierS from "@/assets/ico/S.png";
import tierA from "@/assets/ico/A.png";
import tierB from "@/assets/ico/B.png";
import tierC from "@/assets/ico/C.png";
import tierR from "@/assets/ico/R.png";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tierIcons: Record<string, string> = { S: tierS, A: tierA, B: tierB, C: tierC, R: tierR, Rookie: tierR };

interface LeaderboardProps {
  drivers: Driver[];
  seriesId: string;
  isLoading?: boolean;
  columns?: string[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ drivers, seriesId, isLoading = false, columns = [] }) => {
  const [filterTier, setFilterTier] = useState<string>("all");
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
    if (!displayColumns.includes("等级") || filterTier === "all") return drivers;
    if (filterTier === "S") return drivers.filter((d) => d.tier === DriverTier.S);
    if (filterTier === "AB") return drivers.filter((d) => d.tier === DriverTier.A || d.tier === DriverTier.B);
    return drivers.filter((d) => d.tier === DriverTier.C || d.tier === DriverTier.R);
  }, [displayColumns, drivers, filterTier]);

  const trendNode = (trend: RankTrend) => {
    if (trend === RankTrend.UP) return <ArrowUp className="h-4 w-4 text-emerald-500" />;
    if (trend === RankTrend.DOWN) return <ArrowDown className="h-4 w-4 text-rose-500" />;
    if (trend === RankTrend.NEW) return <Sparkles className="h-4 w-4 text-sky-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
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

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-xl">赛事积分榜</CardTitle>
          {!isRally && displayColumns.includes("等级") && (
            <Tabs value={filterTier} onValueChange={setFilterTier}>
              <TabsList className="h-9 bg-muted/70">
                <TabsTrigger value="all">总排名</TabsTrigger>
                <TabsTrigger value="S">S级</TabsTrigger>
                <TabsTrigger value="AB">A/B级</TabsTrigger>
                <TabsTrigger value="CR">C/R级</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-[440px] overflow-auto rounded-md border">
          <Table className="table-fixed md:table-auto">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {displayColumns.map((col) => (
                  <TableHead
                    key={col}
                    className={`sticky top-0 z-20 whitespace-nowrap bg-muted/95 backdrop-blur ${col === "排名" ? "w-[56px] md:w-auto" : ""} ${col === "车手ID" ? "w-[46%] md:w-auto" : ""} ${col === "等级" ? "w-[64px] md:w-auto text-center" : ""} ${col === mobileScoreColumn ? "w-[64px] md:w-auto" : ""} ${!noRightAlignColumns.has(col) ? "text-right" : ""} ${mobileSecondaryColumns.includes(col) ? "hidden md:table-cell" : ""}`}
                  >
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, idx) => (
                  <TableRow key={idx}>
                    {displayColumns.map((col) => (
                      <TableCell key={col} className={mobileSecondaryColumns.includes(col) ? "hidden md:table-cell" : ""}>
                        <div className="h-5 w-16 animate-pulse rounded bg-muted" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredDrivers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={displayColumns.length} className="py-10 text-center text-muted-foreground">
                    当前无符合条件的车手数据。
                  </TableCell>
                </TableRow>
              ) : (
                filteredDrivers.map((driver) => {
                  const expanded = Boolean(expandedRowIds[driver.id]);
                  return (
                    <React.Fragment key={driver.id}>
                      <TableRow
                        onClick={() => toggleExpand(driver.id)}
                        className={hasMobileSecondaryColumns ? "cursor-pointer md:cursor-default" : ""}
                      >
                        {displayColumns.map((col) => {
                          if (mobileSecondaryColumns.includes(col)) return null;

                          if (col === "排名") {
                            return (
                              <TableCell key={col}>
                                <div className="flex items-center gap-2 font-semibold">
                                  <span>{driver.rank}</span>
                                  {trendNode(driver.trend)}
                                </div>
                              </TableCell>
                            );
                          }

                          if (col === "车手ID") {
                            return (
                              <TableCell key={col} className="w-[46%] max-w-0 font-semibold md:w-auto md:max-w-none">
                                <span className="block truncate whitespace-nowrap md:max-w-none">{driver.name || "-"}</span>
                              </TableCell>
                            );
                          }

                          if (col === "等级") {
                            const safeTier = String(driver.tier || "R");
                            return (
                              <TableCell key={col} className="w-[64px] whitespace-nowrap text-center md:w-auto">
                                <div className="flex items-center justify-center">
                                  <img src={tierIcons[safeTier] || tierIcons.R} alt={safeTier} className="h-7 w-7 object-contain md:h-10 md:w-10" />
                                </div>
                              </TableCell>
                            );
                          }

                          const value = getValue(driver, col);
                          return (
                            <TableCell
                              key={col}
                              className={`whitespace-nowrap ${col === mobileScoreColumn ? "w-[64px] md:w-auto" : ""} ${!noRightAlignColumns.has(col) ? "text-right" : ""}`}
                            >
                              <div className={`flex items-center gap-1 ${!noRightAlignColumns.has(col) ? "justify-end" : ""}`}>
                                <span>{value}</span>
                                {hasMobileSecondaryColumns && col === mobileScoreColumn && (
                                  <span className="md:hidden">
                                    {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                          );
                        })}

                        {displayColumns
                          .filter((col) => mobileSecondaryColumns.includes(col))
                          .map((col) => (
                            <TableCell key={col} className={`hidden md:table-cell ${!noRightAlignColumns.has(col) ? "text-right" : ""}`}>
                              {col === "等级" ? null : getValue(driver, col)}
                            </TableCell>
                          ))}
                      </TableRow>

                      {hasMobileSecondaryColumns && (
                        <TableRow className="md:hidden hover:bg-transparent">
                          <TableCell colSpan={mobileCoreColumns.length} className="p-0">
                            <div
                              className={`overflow-hidden bg-muted/85 transition-all duration-300 ease-out dark:bg-black/45 ${
                                expanded ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
                              }`}
                            >
                              <div className="p-3">
                                <div className={`grid gap-2 ${mobileGridClass}`}>
                                  {mobileSecondaryColumns.map((col) => (
                                    <div key={`${driver.id}-${col}`} className="rounded-md border bg-background/80 p-2 shadow-sm">
                                      <p className="text-[11px] text-muted-foreground">{col}</p>
                                      <p className="mt-1 text-sm font-semibold">{String(getValue(driver, col))}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <Dot className="h-4 w-4" /> 数据定期更新，向下滚动可查看更多名次。
        </p>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
