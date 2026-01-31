
import AppLayout from "@/layouts/app-layout"
import { CreateIndicatorValue } from "@/components/IndicatorValues/CreateIndicatorValue"
import { Progress } from "@/components/ui/progress"
import { IndicatorValuesTable } from "@/components/IndicatorValues/IndicatorValuesTable"
import { IndicatorProgressChart } from "@/components/Indicators/IndicatorProgressChart"
import { IndicatorLineChart } from "@/components/Indicators/IndicatorLineChart"
import { IndicatorAnalyticsCard } from "@/components/Indicators/IndicatorAnalyticsCard"
import { IndicatorTrendChart } from "@/components/Indicators/IndicatorTrendChart"




export default function Index({ indicator, values, stats, timeSeries }: any) {
  //console.log("VALUES FROM BACKEND:", values)
  return (
    <AppLayout
    
      breadcrumbs={[
        { title: "Projects", href: "/admin/projects" },
        {
          title: indicator.activity.project.name,
          href: `/admin/projects/${indicator.activity.project.id}`,
        },
        {
          title: "Activities",
          href: `/admin/projects/${indicator.activity.project.id}/activities`,
        },
        {
          title: indicator.activity.name,
          href: `/admin/activities/${indicator.activity.id}/indicators`,
        },
        {
          title: "Indicators",
          href: `/admin/activities/${indicator.activity.id}/indicators`,
        },
        {
          title: indicator.name,
          href: `/admin/indicators/${indicator.id}/values`,
        },
      ]}
    >
      <div className="p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{indicator.name}</h1>
            <p className="text-muted-foreground">
              Unit: {indicator.unit}
            </p>
          </div>

          <CreateIndicatorValue indicatorId={indicator.id} />
        </div>

        {/* CHART */}
          <IndicatorProgressChart
            values={values}
            target={stats.target}
            unit={indicator.unit}
          />

          {/* CHART */}
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold mb-2">
              Indicator Progress Over Time
            </h2>

            <IndicatorLineChart
              data={values.map((v: any) => ({
                date: v.reporting_date,
                value: v.value,
              }))}
              target={indicator.target_value}
            />
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

        <IndicatorAnalyticsCard indicator={indicator} />
        

        {/* TREND CHART */}
        <IndicatorTrendChart
          data={timeSeries}
          unit={indicator.unit}
        />



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
