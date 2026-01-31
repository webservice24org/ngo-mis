import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card } from "@/components/ui/card"

export function IndicatorTrendChart({ data, unit }: any) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">Progress Over Time</h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm text-muted-foreground mt-2">
        Unit: {unit}
      </p>
    </Card>
  )
}
