import { LocationNode } from "@/components/Locations/LocationNode"

export function LocationTree({ locations }: any) {
  return (
    <div className="space-y-2">
      {locations.map((location: any) => (
        <LocationNode key={location.id} location={location} />
      ))}
    </div>
  )
}
