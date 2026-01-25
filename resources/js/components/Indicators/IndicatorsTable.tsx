declare function route(
  name: string,
  params?: any
): string
import { useState, useMemo } from "react"
import { router } from "@inertiajs/react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { EditIndicator } from "@/components/Indicators/EditIndicator"
import { DeleteIndicator } from "@/components/Indicators/DeleteIndicator"

const PER_PAGE = 5

export function IndicatorsTable({ indicators }: { indicators: any[] }) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  /* ---------------- Filter ---------------- */
  const filtered = useMemo(() => {
    const value = search.toLowerCase()

    return indicators.filter((indicator) =>
      indicator.name.toLowerCase().includes(value) ||
      indicator.indicator_type.toLowerCase().includes(value) ||
      indicator.unit?.toLowerCase().includes(value)
    )
  }, [search, indicators])

  /* ---------------- Pagination ---------------- */
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const paginatedIndicators = useMemo(() => {
    const start = (page - 1) * PER_PAGE
    return filtered.slice(start, start + PER_PAGE)
  }, [filtered, page])

  return (
    <div className="space-y-4">

      {/* Search */}
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search indicators..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="w-64"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="border-r">Name</TableHead>
              <TableHead className="border-r">Type</TableHead>
              <TableHead className="border-r">Target</TableHead>
              <TableHead className="border-r">Baseline</TableHead>
              <TableHead className="border-r">Unit</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedIndicators.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-6"
                >
                  No indicators found
                </TableCell>
              </TableRow>
            )}

            {paginatedIndicators.map((indicator) => (
              <TableRow key={indicator.id} className="hover:bg-muted/40">
                <TableCell className="font-medium border-r">
                  {indicator.name}
                </TableCell>

                <TableCell className="border-r">
                  <Badge variant="secondary">
                    {indicator.indicator_type}
                  </Badge>
                </TableCell>

                <TableCell className="border-r">
                  {indicator.target_value ?? "-"}
                </TableCell>

                <TableCell className="border-r">
                  {indicator.baseline_value ?? "-"}
                </TableCell>

                <TableCell className="border-r">
                  {indicator.unit ?? "-"}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* Values */}
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        router.visit(
                          route("admin.indicators.values.index", indicator.id)
                        )
                      }
                    >
                      Values
                    </Button>

                    <EditIndicator indicator={indicator} />
                    <DeleteIndicator indicatorId={indicator.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>

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
  )
}
