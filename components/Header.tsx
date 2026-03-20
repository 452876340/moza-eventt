import React from "react";
import { ArrowUpRight, BookOpen, Dot } from "lucide-react";
import { SERIES_BANNERS } from "../constants";
import { SeriesRules } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface HeaderProps {
  title?: string;
  seriesId?: string;
  rules?: SeriesRules;
}

const Header: React.FC<HeaderProps> = ({ title = "株洲速度节", seriesId = "zhuzhou", rules }) => {
  const bannerUrl = SERIES_BANNERS[seriesId] || SERIES_BANNERS.zhuzhou;

  const openRules = () => {
    window.open("https://www.mozaracing.cn/sys-nd/371.html", "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="overflow-hidden border-0">
      <CardContent className="relative min-h-[260px] p-0 md:min-h-[360px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.72)),url(${bannerUrl})` }}
        />
        <div className="relative z-10 flex h-full flex-col justify-between gap-6 p-6 text-white md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              <Dot className="mr-1 h-4 w-4" /> 赛事进行中
            </span>
            {rules && (
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/15 text-white backdrop-blur hover:bg-white/25"
                onClick={openRules}
              >
                <BookOpen className="mr-1 h-4 w-4" /> 规则
              </Button>
            )}
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-black tracking-tight md:text-5xl">{title}</h1>
            <Button
              variant="outline"
              className="border-white/50 bg-transparent text-white hover:bg-white hover:text-black"
              onClick={() => window.scrollTo({ top: 520, behavior: "smooth" })}
            >
              查看积分榜 <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Header;
