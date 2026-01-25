declare function route(
  name: string,
  params?: any
): string
import { router } from "@inertiajs/react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EditActivity } from "./EditActivity"
import { DeleteActivity } from "./DeleteActivity"
import { Button } from "@/components/ui/button"

export function ActivitiesTable({ activities }: any) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {activities.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No activities found
              </TableCell>
            </TableRow>
          )}

          {activities.map((activity: any) => (
            <TableRow key={activity.id}>
              <TableCell className="font-medium border-r">
                {activity.name}
              </TableCell>

              <TableCell className="border-r">
                {activity.target_value ?? "-"}
              </TableCell>

              <TableCell className="border-r">
                {activity.unit ?? "-"}
              </TableCell>

              <TableCell className="text-sm text-muted-foreground border-r">
                {activity.start_date} → {activity.end_date}
              </TableCell>

              <TableCell className="text-right ">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      router.visit(
                        route("admin.activities.indicators.index", activity.id)
                      )
                    }
                  >
                    Indicators
                  </Button>
                  <EditActivity activity={activity} />
                  <DeleteActivity activityId={activity.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
