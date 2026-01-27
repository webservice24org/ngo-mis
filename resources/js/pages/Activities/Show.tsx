import AppLayout from "@/layouts/app-layout"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { IndicatorChartModal } from "@/components/Indicators/IndicatorChartModal"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Show({ activity, indicators, stats }: any) {
  return (
    <AppLayout
      breadcrumbs={[
        { title: "Projects", href: "/admin/projects" },
        {
          title: activity.project.name,
          href: `/admin/projects/${activity.project.id}`,
        },
        {
          title: "Activities",
          href: `/admin/projects/${activity.project.id}/activities`,
        },
        { title: activity.name, href: `/admin/activities/${activity.id}` },
      ]}
    >
      <div className="p-6 space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">{activity.name}</h1>
          <p className="text-muted-foreground">
            Activity dashboard
          </p>
        </div>

        {/* KPI SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Stat title="Indicators" value={stats.total_indicators} />
          <Stat title="Avg Achievement">
            <div className="space-y-2">
              <Progress value={stats.avg_achievement} />
              <span className="text-sm">
                {stats.avg_achievement}%
              </span>
            </div>
          </Stat>
          <Stat
            title="Status"
            value={
              stats.avg_achievement >= 80
                ? "On Track"
                : "Needs Attention"
            }
            badge={
              stats.avg_achievement >= 80
                ? "success"
                : "destructive"
            }
          />
        </div>

        {/* INDICATORS TABLE */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="p-3 text-left">
                    Indicator
                  </TableHead>
                  <TableHead className="border-r">Target</TableHead>
                  <TableHead className="border-r">Collected</TableHead>
                  <TableHead className="border-r">Achievement</TableHead>
                  <TableHead className="border-r">Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>

              <TableBody>
                {indicators.map((i: any) => (
                  <TableRow key={i.id}>
                    <TableCell className="p-3 font-medium border-r">
                      {i.name}
                    </TableCell>

                    <TableCell className="border-r">
                      {i.target}
                    </TableCell>

                    <TableCell className="border-r">
                      {i.collected}
                    </TableCell>

                    <TableCell className="space-y-1 border-r">
                      <Progress value={i.achievement} />
                      <span className="text-xs block">
                        {i.achievement}%
                      </span>
                    </TableCell>

                    <TableCell className="border-r">
                      <Badge
                        variant={
                          i.achievement >= 80
                            ? "default"
                            : "destructive"
                        }
                      >
                        {i.achievement >= 80
                          ? "On Track"
                          : "Off Track"}
                      </Badge>
                    </TableCell>

                    <TableCell className="flex gap-2 border-r justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          (window.location.href =
                            `/admin/indicators/${i.id}/values`)
                        }
                      >
                        View
                      </Button>

                      <IndicatorChartModal indicator={i} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

      </div>
    </AppLayout>
  )
}

function Stat({
  title,
  value,
  children,
  badge,
}: any) {
  return (
    <div className="border rounded-lg p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      {children ?? <p className="text-2xl font-semibold">{value}</p>}
      {badge && (
        <Badge variant={badge} className="mt-2">
          {value}
        </Badge>
      )}
    </div>
  )
}
