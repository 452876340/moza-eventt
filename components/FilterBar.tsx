import React from "react";
import { CalendarDays, Search, Trophy } from "lucide-react";
import { RaceRound, Series } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FilterBarProps {
  search: string;
  setSearch: (val: string) => void;
  selectedRound: string;
  setSelectedRound: (val: string) => void;
  rounds: RaceRound[];
  selectedSeries: string;
  setSelectedSeries: (val: string) => void;
  seriesList: Series[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  search,
  setSearch,
  selectedRound,
  setSelectedRound,
  rounds,
  selectedSeries,
  setSelectedSeries,
  seriesList,
}) => {
  return (
    <Card>
      <CardContent className="space-y-4 p-4 md:p-5">
        <div className="space-y-2">
          <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Trophy className="h-4 w-4" /> 赛事系列
          </p>
          <Tabs value={selectedSeries} onValueChange={setSelectedSeries} className="w-full">
            <TabsList className="h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
              {seriesList.map((series) => (
                <TabsTrigger
                  key={series.id}
                  value={series.id}
                  className="rounded-md border bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {series.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CalendarDays className="h-4 w-4" /> 赛事轮次
            </p>
            <Tabs value={selectedRound} onValueChange={setSelectedRound}>
              <TabsList className="h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
                {rounds.map((r) => (
                  <TabsTrigger
                    key={String(r.id)}
                    value={String(r.id)}
                    className="rounded-md border bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {r.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <label className="block space-y-2 md:max-w-xs">
            <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Search className="h-4 w-4" /> 搜索车手
            </span>
            <Input placeholder="输入车手ID或昵称" value={search} onChange={(e) => setSearch(e.target.value)} />
          </label>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterBar;
