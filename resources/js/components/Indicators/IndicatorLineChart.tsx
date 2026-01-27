import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

export function IndicatorLineChart({
  data,
  target,
}: {
  data: { date: string; value: number }[]
  target?: number
}) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No data available for chart
      </p>
    )
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />

          {target && (
            <ReferenceLine
              y={target}
              stroke="red"
              strokeDasharray="4 4"
              label="Target"
            />
          )}

          <Line
            type="monotone"
            dataKey="value"
            strokeWidth={2}
            dot
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
