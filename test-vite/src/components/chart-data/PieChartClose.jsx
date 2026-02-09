import { useMemo, useState } from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export function ChartPieClose({ totalChartData }) {
  const [caseData, setCaseData] = useState([])
  const chartData2 = [
    { browser: "Close", visitors: totalChartData.Close || 0, fill: "var(--chart-close)" },
    { browser: "Cancel", visitors: totalChartData.Cancel || 0, fill: "var(--chart-cancel)" },
    // { browser: "InActive", visitors: caseData.inActive, fill: "var(--chart-inactive)" },
  ]
  
  const chartConfig2 = {
    visitors: {
      label: "Visitors",
    },
    Close: {
      label: "Close",
      color: "hsl(var(--chart-1))",
    },
    Cancel: {
      label: "Cancel",
      color: "hsl(var(--chart-2))",
    },
   
  } 
  const totalVisitors = useMemo(() => {
    return chartData2.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [totalChartData])


  return (
    <Card className="flex flex-col dark:bg-gradient-to-bl dark:from-slate-900 dark:via-slate-800 dark:to-slate-800 dark:to-10% via-80% from-20% gap-9">
      <CardHeader className="items-center pb-0">
        <CardDescription>Close & Cancel</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig2}
          className=""
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData2}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={45}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Cases
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            <ChartLegend></ChartLegend>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
      </CardFooter>
    </Card>
  )
}
