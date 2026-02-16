import AppLayout from "@/layouts/app-layout"
import { LocationTree } from "@/components/Locations/LocationTree"

export default function Index({ locations }: any) {
  return (
    <AppLayout
      breadcrumbs={[
        { title: "Locations", href: "/admin/locations" },
      ]}
    >
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Location Management</h1>

        <LocationTree locations={locations} />
      </div>
    </AppLayout>
  )
}
