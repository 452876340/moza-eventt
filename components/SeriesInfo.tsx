import React, { useState } from "react";
import { Gift, QrCode, Trophy } from "lucide-react";
import { SeriesRules } from "../types";
import xcxImg from "@/assets/xcx.jpg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SeriesInfoProps {
  rules: SeriesRules;
}

const SeriesInfo: React.FC<SeriesInfoProps> = ({ rules }) => {
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {rules.groups.map((group, index) => {
        const isPrimary = index === 0;
        return (
          <Card key={`${group.title}-${index}`}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <CardTitle className="flex items-center gap-2">
                    {isPrimary ? <Trophy className="h-5 w-5 text-primary" /> : <Gift className="h-5 w-5 text-emerald-500" />}
                    {group.title}
                  </CardTitle>
                  <CardDescription>{group.description}</CardDescription>
                </div>
                {group.requirements && <Badge variant="secondary">{group.requirements}</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {group.weeklyReward && (
                <div className="rounded-md border bg-muted/40 p-3 text-sm">
                  <span className="font-semibold">周常奖励：</span>
                  {group.weeklyReward}
                </div>
              )}

              {group.seasonReward && (
                <div className="space-y-2 rounded-md border p-3 text-sm">
                  <p className="font-semibold">赛季奖励</p>
                  <p>冠军：{group.seasonReward.first}</p>
                  <p>亚军：{group.seasonReward.second}</p>
                  <p>季军：{group.seasonReward.third}</p>
                  {group.seasonReward.others && <p>其他：{group.seasonReward.others}</p>}
                </div>
              )}

              {!isPrimary && showQR && (
                <div className="rounded-md border p-3">
                  <img src={xcxImg} alt="小程序二维码" className="mx-auto h-52 w-52 rounded object-cover" />
                  <p className="mt-2 text-center text-xs text-muted-foreground">扫码加入赛事</p>
                </div>
              )}

              <Button
                className="w-full"
                variant={isPrimary ? "default" : "secondary"}
                onClick={() => {
                  if (isPrimary) {
                    window.open("https://www.mozaracing.cn/sys-nd/371.html", "_blank");
                    return;
                  }
                  setShowQR((v) => !v);
                }}
              >
                {isPrimary ? "查看完整规则" : <><QrCode className="mr-2 h-4 w-4" />{showQR ? "关闭二维码" : "申请加入"}</>}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SeriesInfo;
