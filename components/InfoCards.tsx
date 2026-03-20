import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InfoCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>竞速组</CardTitle>
            <Badge>S / A / B</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>总排名前 3 的选手可分享赛季奖金池并获得邀请赛资格。</p>
          <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
            <li>比赛周末提供技术支持和 VIP 权益</li>
            <li>S 级车手可申请专属车漆设计包</li>
          </ul>
          <Button className="w-full">查看级别条例</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>新秀 / C 组</CardTitle>
            <Badge variant="secondary">成长奖励</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>进步最快选手可获得潜力车手奖与装备券支持。</p>
          <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
            <li>可参与一对一进阶训练</li>
            <li>开放模拟器免费体验时段</li>
          </ul>
          <Button className="w-full" variant="secondary">申请加入计划</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoCards;
