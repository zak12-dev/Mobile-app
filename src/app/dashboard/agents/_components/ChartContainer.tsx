"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

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

// 🔹 Données par mois : agent avec plus de ventes
const chartData = [
  { month: "January", agent: "John Doe", ventes: 15 },
  { month: "February", agent: "Jane Smith", ventes: 22 },
  { month: "March", agent: "John Doe", ventes: 18 },
  { month: "April", agent: "Alice Brown", ventes: 12 },
  { month: "May", agent: "Jane Smith", ventes: 25 },
  { month: "June", agent: "John Doe", ventes: 20 },
];

// 🔹 Config pour ChartContainer
const chartConfig = {
  ventes: {
    label: "Ventes",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function BestAgentBarChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meilleur agent par mois</CardTitle>
        <CardDescription>De Janvier à Juin 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            margin={{ top: 20, bottom: 20 }}
            barCategoryGap="30%"
            width={500} // largeur du chart
            height={300} // hauteur du chart
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string, _index: number): string =>
                value.slice(0, 3)
              }
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="ventes" fill="var(--color-desktop)" radius={8}>
              <LabelList
                dataKey="agent"
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Performance mensuelle <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Affiche l’agent avec le plus de ventes chaque mois
        </div>
      </CardFooter>
    </Card>
  );
}
