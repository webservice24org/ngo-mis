import AppLayout from "@/layouts/app-layout"
import { CreateIndicatorValue } from "@/components/IndicatorValues/CreateIndicatorValue"
import { Progress } from "@/components/ui/progress"
import { IndicatorValuesTable } from "@/components/IndicatorValues/IndicatorValuesTable"

export default function Index({ indicator, values, stats }: any) {
  return (
    <AppLayout
      breadcrumbs={[
        { title: "Projects", href: "/admin/projects" },
        {
          title: indicator.activity.project.name,
          href: `/admin/projects/${indicator.activity.project.id}`,
        },
        {
          title: indicator.activity.name,
          href: `/admin/projects/${indicator.activity.project.id}/activities`,
        },
        {
          title: "Indicators",
          href: `/admin/activities/${indicator.activity.id}/indicators`,
        },
        { title: indicator.name },
      ]}
    >
      <div className="p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{indicator.name}</h1>
            <p className="text-muted-foreground">
              {indicator.indicator_type.toUpperCase()} indicator
            </p>
          </div>

          <CreateIndicatorValue indicatorId={indicator.id} />
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Baseline" value={stats.baseline ?? "-"} />
          <StatCard title="Target" value={stats.target ?? "-"} />
          <StatCard title="Collected" value={stats.collected ?? 0} />
          <StatCard title="Achievement">
            <div className="space-y-2">
              <Progress value={stats.achievement} />
              <span className="text-sm text-muted-foreground">
                {stats.achievement}%
              </span>
            </div>
          </StatCard>
        </div>

        {/* VALUES TABLE */}
        <IndicatorValuesTable values={values} />

      </div>
    </AppLayout>
  )
}

/* ---------------- SMALL REUSABLE CARD ---------------- */

function StatCard({
  title,
  value,
  children,
}: {
  title: string
  value?: any
  children?: React.ReactNode
}) {
  return (
    <div className="border rounded-lg p-4 bg-background">
      <p className="text-sm text-muted-foreground mb-1">{title}</p>

      {children ?? (
        <p className="text-2xl font-semibold">{value}</p>
      )}
    </div>
  )
}
