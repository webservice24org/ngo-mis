import { useState, useMemo, useEffect, useRef } from "react"
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

export default function Index({
  projects,
  donors,
  managers,
  enumerators,
  locations,
  filters,
}: any) {

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    filters?.location_ids || []
  )
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const pageSize = 10

  /* ---------------------------------------------------- */
  /* 🔥 Close dropdown on outside click */
  /* ---------------------------------------------------- */

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  /* ---------------------------------------------------- */
  /* 🔥 Build Recursive Location Options */
  /* ---------------------------------------------------- */

  const buildOptions = (nodes: any[], level = 0): any[] => {
    return nodes.flatMap((node) => [
      { id: node.id, name: `${"— ".repeat(level)}${node.name}` },
      ...(node.children ? buildOptions(node.children, level + 1) : []),
    ])
  }

  const flatLocations = useMemo(() => buildOptions(locations), [locations])

  /* ---------------------------------------------------- */
  /* 🔥 Multi Select Toggle */
  /* ---------------------------------------------------- */

  const toggleLocation = (id: string) => {
    let updated

    if (selectedLocations.includes(id)) {
      updated = selectedLocations.filter((l) => l !== id)
    } else {
      updated = [...selectedLocations, id]
    }

    setSelectedLocations(updated)
    setPage(1)

    router.get(
      "/admin/projects",
      { location_ids: updated },
      { preserveState: true, replace: true }
    )
  }

  const clearFilter = () => {
    setSelectedLocations([])
    router.get(
      "/admin/projects",
      {},
      { preserveState: true, replace: true }
    )
  }

  /* ---------------------------------------------------- */
  /* 🔍 Search */
  /* ---------------------------------------------------- */

  const filteredProjects = useMemo(() => {
    const value = search.toLowerCase()

    return projects.filter((project: any) =>
      project.name?.toLowerCase().includes(value) ||
      project.code?.toLowerCase().includes(value) ||
      project.donor?.name?.toLowerCase().includes(value)
    )
  }, [projects, search])

  const totalPages = Math.ceil(filteredProjects.length / pageSize)

  const paginatedProjects = filteredProjects.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  /* ---------------------------------------------------- */
  /* UI */
  /* ---------------------------------------------------- */

  return (
    <AppLayout breadcrumbs={[{ title: "Projects", href: "/admin/projects" }]}>
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <h1 className="text-2xl font-bold">Projects</h1>

          <div className="flex gap-3 flex-wrap items-center">

            {/* 🔍 Search */}
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-64"
            />

            {/* 🔥 Location Dropdown */}
            <div className="relative w-64" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="w-full border rounded-md px-3 py-2 text-sm text-left bg-white flex justify-between items-center"
              >
                <span>
                  {selectedLocations.length > 0
                    ? `${selectedLocations.length} location(s) selected`
                    : "Filter by Location"}
                </span>
                <span className="text-xs">{open ? "▲" : "▼"}</span>
              </button>

              {open && (
                <div className="absolute z-50 mt-2 w-full border rounded-md bg-white shadow-lg max-h-64 overflow-y-auto p-3 space-y-1">

                  {flatLocations.map((loc) => (
                    <label
                      key={loc.id}
                      className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted px-2 py-1 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(String(loc.id))}
                        onChange={() => toggleLocation(String(loc.id))}
                      />
                      {loc.name}
                    </label>
                  ))}

                  {selectedLocations.length > 0 && (
                    <button
                      onClick={clearFilter}
                      className="text-xs text-red-500 pt-2"
                    >
                      Clear filter
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Create Modal */}
            <CreateProject
              donors={donors}
              managers={managers}
              enumerators={enumerators}
              locations={locations}
            />
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="border-r">Name</TableHead>
                <TableHead className="border-r">Code</TableHead>
                <TableHead className="border-r">Donor</TableHead>
                <TableHead className="border-r">Manager</TableHead>
                <TableHead className="border-r">Locations</TableHead>
                <TableHead className="border-r">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              {paginatedProjects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No projects found
                  </TableCell>
                </TableRow>
              )}

              {paginatedProjects.map((project: any) => (
                <TableRow key={project.id}>
                  <TableCell className="border-r">{project.name}</TableCell>
                  <TableCell className="border-r">{project.code}</TableCell>
                  <TableCell className="border-r">{project.donor?.name ?? "-"}</TableCell>

                  <TableCell className="space-x-1 border-r">
                    {project.manager?.map((m: any) => (
                      <Badge key={m.id} variant="secondary">
                        {m.name}
                      </Badge>
                    ))}
                  </TableCell>

                  <TableCell className="space-x-1 border-r">
                    {project.locations?.map((loc: any) => (
                      <Badge key={loc.id} variant="outline">
                        {loc.name}
                      </Badge>
                    ))}
                  </TableCell>

                  <TableCell className="border-r">
                    <Badge
                      variant={
                        project.status === "active"
                          ? "default"
                          : "outline"
                      }
                    >
                      {project.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          router.visit(`/admin/projects/${project.id}`)
                        }
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          router.visit(`/admin/projects/${project.id}/beneficiaries`)
                        }
                      >
                        beneficiaries
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          router.visit(`/admin/projects/${project.id}/forms`)
                        }
                      >
                        Forms
                      </Button>
                      


                      <EditProject
                        project={project}
                        donors={donors}
                        managers={managers}
                        enumerators={enumerators}
                        locations={locations}
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
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>

            <span className="px-3 py-1 text-sm">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}

      </div>
    </AppLayout>
  )
}
