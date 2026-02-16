import { Checkbox } from "@/components/ui/checkbox"

export function LocationSelector({
  locations = [],
  selected,
  onChange,
}: {
  locations?: any[]
  selected: number[]
  onChange: (ids: number[]) => void
}) {

  function toggle(id: number) {
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div className="space-y-2">
      {locations.map((location) => (
        <LocationNode
          key={location.id}
          location={location}
          selected={selected}
          toggle={toggle}
          level={0}
        />
      ))}
    </div>
  )
}

function LocationNode({
  location,
  selected,
  toggle,
  level,
}: any) {
  return (
    <div className="space-y-1">
      <div
        className="flex items-center gap-2"
        style={{ marginLeft: level * 20 }}
      >
        <Checkbox
          checked={selected.includes(location.id)}
          onCheckedChange={() => toggle(location.id)}
        />

        <span className="text-sm">
          {location.name}
          <span className="ml-2 text-muted-foreground text-xs">
            ({location.type})
          </span>
        </span>
      </div>

      {location.children?.length > 0 && (
        <div>
          {location.children.map((child: any) => (
            <LocationNode
              key={child.id}
              location={child}
              selected={selected}
              toggle={toggle}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
