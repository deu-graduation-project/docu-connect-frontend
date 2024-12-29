"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

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
} from "@/components/ui/chart";
const chartData = [
  { country: "chrome", view: 275, fill: "var(--color-chrome)" },
  { country: "safari", view: 200, fill: "var(--color-safari)" },
  { country: "firefox", view: 187, fill: "var(--color-firefox)" },
  { country: "edge", view: 173, fill: "var(--color-edge)" },
  { country: "other", view: 90, fill: "var(--color-other)" },
];

const chartConfig = {
  view: {
    label: "view",
  },
  chrome: {
    label: "USA",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "France",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Germany",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "UK",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function AudienceOverviewChart() {
  return (
    <Card className="max-h-[700px] flex flex-col justify-between">
      <CardHeader>
        <CardTitle>Audience</CardTitle>
        <CardDescription>
          Where users are downloading/viewing your notes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 8,
            }}
          >
            <YAxis
              dataKey="country"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="view" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="view" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total views for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
