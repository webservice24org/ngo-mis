import AppLayout from "@/layouts/app-layout"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Show({ project, activities, stats }: any) {
  return (
    <AppLayout
      breadcrumbs={[
        { title: "Projects", href: "/admin/projects" },
        { title: project.name, href: `/admin/projects/${project.id}` },
      ]}
    >
      <div className="p-6 space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">
            Project Dashboard
          </p>
        </div>

        {/* PROJECT KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Kpi title="Activities" value={stats.activities} />
          <Kpi title="Indicators" value={stats.indicators} />
          <Kpi title="Avg Achievement">
            <Progress value={stats.avg_achievement} />
            <span className="text-sm">{stats.avg_achievement}%</span>
          </Kpi>
          <Kpi
            title="Status"
            value={
              stats.avg_achievement >= 80
                ? "On Track"
                : "Needs Attention"
            }
            badge={
              stats.avg_achievement >= 80
                ? "default"
                : "destructive"
            }
          />
        </div>




        {/* ACTIVITIES ROLL-UP */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="p-3 text-left border-r">Activity</TableHead>
              <TableHead className="border-r">Indicators</TableHead>
              <TableHead className="border-r">Achievement</TableHead>
              <TableHead className="border-r">Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {activities.map((a: any) => (
              <TableRow key={a.id}>
                <TableCell className="p-3 font-medium border-r">
                  {a.name}
                </TableCell>

                <TableCell className="border-r">
                  {a.indicators_count}
                </TableCell>

                <TableCell className="space-y-1 border-r">
                  <Progress value={a.avg_achievement} />
                  <span className="text-xs block">
                    {a.avg_achievement}%
                  </span>
                </TableCell>

                <TableCell className="border-r">
                  <Badge
                    variant={
                      a.avg_achievement >= 80
                        ? "default"
                        : "destructive"
                    }
                  >
                    {a.avg_achievement >= 80
                      ? "On Track"
                      : "Off Track"}
                  </Badge>
                </TableCell>

                <TableCell className="text-right border-r">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      (window.location.href =
                        `/admin/activities/${a.id}`)
                    }
                  >
                    View
                  </Button>
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

function Kpi({ title, value, children, badge }: any) {
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
