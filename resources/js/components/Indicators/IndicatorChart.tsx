import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

export function IndicatorChart({ indicator }: any) {
  const data = indicator.values ?? []

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />
          <YAxis />

          <Tooltip />

          {/* Target Line */}
          {indicator.target > 0 && (
            <ReferenceLine
              y={indicator.target}
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
