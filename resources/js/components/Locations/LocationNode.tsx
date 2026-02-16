import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Plus } from "lucide-react"
import { CreateLocation } from "./CreateLocation"

export function LocationNode({ location }: any) {
  const [open, setOpen] = useState(true)

  return (
    <div className="ml-4 border-l pl-4">

      <div className="flex items-center gap-2 py-1">
        {location.children?.length > 0 && (
          <button onClick={() => setOpen(!open)}>
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}

        <span className="font-medium">
          {location.name}
        </span>

        <span className="text-xs text-muted-foreground">
          ({location.type})
        </span>

        <CreateLocation
          parentId={location.id}
          type={nextType(location.type)}
        />
      </div>

      {open && location.children?.length > 0 && (
        <div className="space-y-1">
          {location.children.map((child: any) => (
            <LocationNode key={child.id} location={child} />
          ))}
        </div>
      )}
    </div>
  )
}

function nextType(type: string) {
  if (type === "country") return "district"
  if (type === "district") return "upazila"
  if (type === "upazila") return "union"
  return null
}
