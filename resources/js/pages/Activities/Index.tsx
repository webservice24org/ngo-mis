import { useMemo, useState } from "react"
import AppLayout from "@/layouts/app-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CreateActivity } from "@/components/Activities/CreateActivity"
import { ActivitiesTable } from "@/components/Activities/ActivitiesTable"

export default function Index({ project, activities }: any) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const perPage = 10

  /* ---------------- SEARCH ---------------- */
  const filteredActivities = useMemo(() => {
    const value = search.toLowerCase()

    return activities.filter((activity: any) =>
      activity.name.toLowerCase().includes(value) ||
      activity.unit?.toLowerCase().includes(value)
    )
  }, [search, activities])

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filteredActivities.length / perPage)

  const paginatedActivities = useMemo(() => {
    const start = (page - 1) * perPage
    return filteredActivities.slice(start, start + perPage)
  }, [filteredActivities, page])

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Projects", href: "/admin/projects" },
        {
          title: project.name,
          href: `/admin/projects/${project.id}`,
        },
        {
          title: "Activities",
          href: `/admin/projects/${project.id}/activities`,
        },
      ]}
    >
      <div className="p-6 space-y-4">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">
            Activities – {project.name}
          </h1>

          <div className="flex gap-2">
            <Input
              placeholder="Search activities..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-64"
            />

            <CreateActivity projectId={project.id} />
          </div>
        </div>

        {/* Table */}
        <ActivitiesTable activities={paginatedActivities} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant={page === i + 1 ? "default" : "outline"}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}

      </div>
    </AppLayout>
  )
}
