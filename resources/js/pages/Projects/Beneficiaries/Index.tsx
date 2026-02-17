import { useState, useEffect } from "react"
import AppLayout from "@/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { router } from "@inertiajs/react"
import BeneficiaryModal from "@/components/Beneficiaries/BeneficiaryModal"

export default function Index({
  project,
  beneficiaries,
  filters,
  stats,
  locations,
}: any) {

  const [search, setSearch] = useState(filters?.search || "")
  const [open, setOpen] = useState(false)
  const [editBeneficiary, setEditBeneficiary] = useState<any>(null)

  /* -----------------------------
     Debounced Search
  ------------------------------*/
  useEffect(() => {
    const delay = setTimeout(() => {
      router.get(
        `/admin/projects/${project.id}/beneficiaries`,
        { search },
        { preserveState: true, replace: true }
      )
    }, 400)

    return () => clearTimeout(delay)
  }, [search])

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Projects", href: "/admin/projects" },
        { title: project.name, href: "#" },
        { title: "Beneficiaries", href: "#" },
      ]}
    >
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <Input
            placeholder="Search by unique code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />

          <Button onClick={() => setOpen(true)}>
            Add Beneficiary
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard title="Total" value={stats.total} />
          <StatCard title="Male" value={stats.male} />
          <StatCard title="Female" value={stats.female} />
          <StatCard title="Other" value={stats.other} />
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Gender</th>
                <th className="p-3 text-left">Age</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">National ID</th>

                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {beneficiaries.data.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6">
                    No beneficiaries found
                  </td>
                </tr>
              )}

              {beneficiaries.data.map((b: any) => (
                <tr key={b.id} className="border-t">
                  <td className="p-3 font-medium">{b.unique_code}</td>
                  <td className="p-3">
                    {b.gender ? (
                      <Badge variant="outline">{b.gender}</Badge>
                    ) : "-"}
                  </td>
                  <td className="p-3">{b.calculated_age ?? "-"}</td>
                  <td className="p-3">{b.phone ?? "-"}</td>
                  <td className="p-3">{b.national_id ?? "-"}</td>

                  <td className="p-3">{b.location?.name ?? "-"}</td>
                  <td className="p-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditBeneficiary(b)
                        setOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2">
          {beneficiaries.links?.map((link: any, i: number) => (
            <button
              key={i}
              dangerouslySetInnerHTML={{ __html: link.label }}
              disabled={!link.url}
              onClick={() => link.url && router.visit(link.url)}
              className={`px-3 py-1 border rounded text-sm ${
                link.active ? "bg-primary text-white" : ""
              }`}
            />
          ))}
        </div>

        {/* Modal */}
        <BeneficiaryModal
          projectId={project.id}
          beneficiary={editBeneficiary}
          locations={locations}
          open={open}
          onClose={() => {
            setOpen(false)
            setEditBeneficiary(null)
          }}
        />

      </div>
    </AppLayout>
  )
}

function StatCard({ title, value }: any) {
  return (
    <div className="p-4 border rounded-lg">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}
