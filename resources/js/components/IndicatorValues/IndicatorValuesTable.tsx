import { useMemo, useState } from "react"
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
import { EditIndicatorValue } from "./EditIndicatorValue"
import { DeleteIndicatorValue } from "./DeleteIndicatorValue"

const PER_PAGE = 10

export function IndicatorValuesTable({ values }: any) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  /* ---------------- FILTER ---------------- */
  const filtered = useMemo(() => {
    const q = search.toLowerCase()

    return values.filter((v: any) =>
      v.notes?.toLowerCase().includes(q) ||
      v.collected_by?.name?.toLowerCase().includes(q)
    )
  }, [values, search])

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const paginatedValues = useMemo(() => {
    const start = (page - 1) * PER_PAGE
    return filtered.slice(start, start + PER_PAGE)
  }, [filtered, page])

  return (
    <div className="space-y-4">

      {/* SEARCH */}
      <div className="flex justify-end">
        <Input
          placeholder="Search values..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="w-64"
        />
      </div>

      {/* TABLE */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Collected By</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedValues.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-6"
                >
                  No indicator values found
                </TableCell>
              </TableRow>
            )}

            {paginatedValues.map((value: any) => (
              <TableRow key={value.id}>
                <TableCell>{value.date}</TableCell>

                <TableCell className="font-medium">
                  {value.value}
                </TableCell>

                <TableCell>
                  {value.collected_by?.name ?? "-"}
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {value.notes ?? "-"}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <EditIndicatorValue value={value} />
                    <DeleteIndicatorValue valueId={value.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
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
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
