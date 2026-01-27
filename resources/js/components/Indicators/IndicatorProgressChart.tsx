import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

export function IndicatorProgressChart({
  values,
  target,
  unit,
}: {
  values: any[]
  target?: number
  unit?: string
}) {
  if (!values || values.length === 0) {
    return (
      <div className="border rounded-lg p-6 text-center text-muted-foreground">
        No data available yet
      </div>
    )
  }

  const data = values
    .slice()
    .reverse()
    .map((v) => ({
      date: v.reporting_date,
      value: v.value,
    }))

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-4">
        Indicator Progress {unit && `(${unit})`}
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            strokeWidth={2}
            dot={{ r: 4 }}
          />

          {target && (
            <ReferenceLine
              y={target}
              strokeDasharray="4 4"
              label={{
                value: `Target (${target})`,
                position: "right",
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
