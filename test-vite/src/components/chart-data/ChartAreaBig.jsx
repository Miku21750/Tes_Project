import { useState } from "react"
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
import ApiCustomer from "@/api"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AreaChartIcon } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"


export function ChartAreaBig({chartData}) {
  const [timeRange, setTimeRange] = useState("90d")
const description = "An interactive area chart"




const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  Bench: {
    label: "Bench",
    color: "var(--chart-1)",
  },
  Onsite: {
    label: "Onsite",
    color: "var(--chart-2)",
  },
  InWarranty: {
    label: "InWarranty",
    color: "var(--chart-3)",
  },
  OutWarranty: {
    label: "OutWarranty",
    color: "var(--chart-4)",
  },
} 

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="pt-0 dark:bg-gradient-to-bl dark:from-slate-900 dark:via-slate-800 dark:to-slate-800 dark:to-10% via-80% from-20%">
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillBench" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-Bench)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-Bench)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillOnsite" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-Onsite)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-Onsite)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillInWarranty" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-InWarranty)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-InWarranty)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillOutWarranty" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-OutWarranty)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-OutWarranty)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={18}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="Onsite"
              type="natural"
              fill="url(#fillOnsite)"
              stroke="var(--color-Onsite)"
            />
            <Area
              dataKey="Bench"
              type="natural"
              fill="url(#fillBench)"
              stroke="var(--color-Bench)"
            />
            <Area
              dataKey="OutWarranty"
              type="natural"
              fill="url(#fillOutWarranty)"
              stroke="var(--color-OutWarranty)"
            />
            <Area
              dataKey="InWarranty"
              type="natural"
              fill="url(#fillInWarranty)"
              stroke="var(--color-InWarranty)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
