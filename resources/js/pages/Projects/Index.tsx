
import { useState, useMemo } from "react"
import AppLayout from "@/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { router } from "@inertiajs/react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { CreateProject } from "@/components/Projects/CreateProject"
import { EditProject } from "@/components/Projects/EditProject"
import { DeleteProject } from "@/components/Projects/DeleteProject"

export default function Index({ projects, donors, managers, enumerators }: any) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const pageSize = 10

  // 🔍 Search filter
  const filteredProjects = useMemo(() => {
    const value = search.toLowerCase()

    return projects.filter((project: any) => (
      project.name.toLowerCase().includes(value) ||
      project.code?.toLowerCase().includes(value) ||
      project.donor?.name?.toLowerCase().includes(value)
    ))
  }, [projects, search])

  // 📄 Pagination
  const totalPages = Math.ceil(filteredProjects.length / pageSize)

  const paginatedProjects = filteredProjects.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Projects", href: "/admin/projects" },
      ]}
    >
      <div className="p-6 space-y-4">

        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <h1 className="text-2xl font-bold">Projects</h1>

          <div className="flex gap-2">
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1) // reset page on search
              }}
              className="w-64"
            />

            <CreateProject
              donors={donors}
              managers={managers}
              enumerators={enumerators}
            />
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow >
                <TableHead className="border-r">Name</TableHead>
                <TableHead className="border-r">Code</TableHead>
                <TableHead className="border-r">Donor</TableHead>
                <TableHead className="border-r">Manager</TableHead>
                <TableHead className="border-r">Status</TableHead>
                <TableHead className="text-right border-r">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedProjects.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-6"
                  >
                    No projects found
                  </TableCell>
                </TableRow>
              )}

              {paginatedProjects.map((project: any) => (
                <TableRow key={project.id} className="hover:bg-muted/50 border-b">
                  <TableCell className="font-medium border-r">
                    {project.name}
                  </TableCell>

                  <TableCell className="border-r">{project.code}</TableCell>

                  <TableCell className="border-r">
                    {project.donor?.name ?? "-"}
                  </TableCell>

                  <TableCell className="space-x-1 border-r">
                    {project.manager?.map((m: any) => (
                      <Badge key={m.id} variant="secondary">
                        {m.name}
                      </Badge>
                    ))}
                  </TableCell>

                  <TableCell className="border-r">
                    <Badge
                      variant={project.status === "active" ? "default" : "outline"}
                    >
                      {project.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right border-r">
                    <div className="flex justify-end gap-2">
                      {/* Activities */}
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          router.visit(`/admin/projects/${project.id}`)
                        }
                      >
                        View Project
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          router.visit(`/admin/projects/${project.id}/activities`)
                        }
                      >
                        Activities
                      </Button>

                      <EditProject
                        project={project}
                        donors={donors}
                        managers={managers}
                        enumerators={enumerators}
                      />

                      <DeleteProject projectId={project.id} />
                    </div>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNumber = i + 1
                return (
                  <Button
                    key={pageNumber}
                    size="sm"
                    variant={page === pageNumber ? "default" : "outline"}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                )
              })}

              <Button
                size="sm"
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  )
}
