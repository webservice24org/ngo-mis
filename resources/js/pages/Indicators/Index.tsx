import AppLayout from "@/layouts/app-layout"
import { CreateIndicator } from "@/components/Indicators/CreateIndicator"
import { IndicatorsTable } from "@/components/Indicators/IndicatorsTable"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Index({ activity, indicators, kpis }: any) {
  return (
    <AppLayout
      breadcrumbs={[
        { title: "Projects", href: "/admin/projects" },
        {
          title: activity.project?.name,
          href: `/admin/projects/${activity.project_id}/activities`,
        },
        {
          title: activity.name,
          href: `/admin/activities/${activity.id}/indicators`,
        },
        { title: "Indicators", href: "#" },
      ]}
    >
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Indicators — {activity.name}
          </h1>

          <CreateIndicator activityId={activity.id} />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Kpi label="Total" value={kpis.total} />
          <Kpi label="Output" value={kpis.output} />
          <Kpi label="Outcome" value={kpis.outcome} />
          <Kpi label="Target Sum" value={kpis.target_sum} />
          <Kpi label="Baseline Sum" value={kpis.baseline_sum} />
        </div>

        {/* Indicators Table */}
        <IndicatorsTable indicators={indicators} />
      </div>
    </AppLayout>
  )
}

function Kpi({ label, value }: any) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}



