"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

const chartData = [
  { engagement: "likes", value: 225, fill: "hsl(var(--chart-1))" },
  { engagement: "comments", value: 173, fill: "hsl(var(--chart-4))" },
  { engagement: "shares", value: 120, fill: "hsl(var(--chart-5))" },
];
const chartConfig = {
  likes: {
    label: "Likes",
    color: "hsl(var(--chart-1))",
  },
  comments: {
    label: "Comments",
    color: "hsl(var(--chart-4))",
  },
  shares: {
    label: "Shares",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function EngagementChart() {
  return (
    <Card className="max-h-[700px] flex flex-col justify-between">
      <CardHeader className="items-center  ">
        <CardTitle>Engagements</CardTitle>
        <CardDescription className="text-center">
          Likes, comments, or shares on public notes.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="engagement" hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              labelLine={false}
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="hsla(var(--foreground))"
                  >
                    {payload.value}
                  </text>
                );
              }}
              nameKey="engagement"
            />

            <ChartLegend
              content={<ChartLegendContent nameKey="engagement" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col pt-4  gap-2 w-full text-sm">
        <div className="flex w-full items-center justify-start gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-start w-full text-muted-foreground">
          Showing total engagements for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
