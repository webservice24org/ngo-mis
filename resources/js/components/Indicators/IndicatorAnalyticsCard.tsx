import { Progress } from "@/components/ui/progress"

export function IndicatorAnalyticsCard({ indicator }: any) {
  return (
    <div className="border rounded-lg p-4 space-y-3">

      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{indicator.name}</h3>
        <span className="text-sm text-muted-foreground">
          {indicator.direction === "increase" ? "↑ Increase" : "↓ Decrease"}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <Stat label="Baseline" value={indicator.baseline} />
        <Stat label="Current" value={indicator.current} />
        <Stat label="Target" value={indicator.target} />
      </div>

      <Progress value={indicator.progress} />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{indicator.progress}% achieved</span>
        <span>
          Gap: {indicator.gap} {indicator.unit}
        </span>
      </div>
    </div>
  )
}

function Stat({ label, value }: any) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">{value ?? "-"}</p>
    </div>
  )
}
