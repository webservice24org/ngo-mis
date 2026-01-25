import { Head } from "@inertiajs/react"
import { useState } from "react"

import AppLayout from "@/layouts/app-layout"
import { type BreadcrumbItem } from "@/types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import { CreateUser } from "@/components/Users/CreateUser"
import { EditUser } from "@/components/Users/EditUser"
import { DeleteUser } from "@/components/Users/DeleteUser"

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table"

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Users Management", href: "/admin/users" },
]

/* Highlight search matches */
function highlightMatch(text: string, search: string) {
  if (!search) return text

  const regex = new RegExp(`(${search})`, "gi")
  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <span
        key={i}
        className="bg-yellow-200 dark:bg-yellow-500 px-0.5 rounded-sm"
      >
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

export default function Users({ users, roles }: any) {
  const [search, setSearch] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  /* Table Columns */
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => row.original.id,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0 font-semibold"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Name
        </Button>
      ),
      cell: ({ getValue }) =>
        highlightMatch(getValue<string>(), search),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0 font-semibold"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Email
        </Button>
      ),
      cell: ({ getValue }) =>
        highlightMatch(getValue<string>(), search),
    },
    {
      accessorKey: "roles",
      header: "Role",
      cell: ({ getValue }) => (
        <div className="flex flex-wrap gap-1">
          {getValue<any[]>().map((role) => (
            <Badge key={role.id} variant="secondary">
              {role.name}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <EditUser user={row.original} roles={roles} />
          <DeleteUser user={row.original} />
        </div>
      ),
    },
  ]

  /* Table Instance */
  const table = useReactTable({
    data: users,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="User Management" />

      <div className="p-6 space-y-4">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-bold">User Management</h1>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => {
                const value = e.target.value
                setSearch(value)
                table.getColumn("name")?.setFilterValue(value)
                table.getColumn("email")?.setFilterValue(value)
              }}
              className="w-64 h-9"
            />
            <CreateUser roles={roles} />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/50">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center h-24"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>

          {Array.from(
            { length: table.getPageCount() },
            (_, i) => (
              <Button
                key={i}
                size="sm"
                variant={
                  i === table.getState().pagination.pageIndex
                    ? "default"
                    : "outline"
                }
                onClick={() => table.setPageIndex(i)}
              >
                {i + 1}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
