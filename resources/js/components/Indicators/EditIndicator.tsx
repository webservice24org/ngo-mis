import { useState } from "react"
import { useForm } from "@inertiajs/react"
import toast from "react-hot-toast"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

declare function route(name: string, params?: any): string

export function EditIndicator({ indicator }: any) {
  const [open, setOpen] = useState(false)

  const { data, setData, put, processing, errors } = useForm({
    name: indicator.name ?? "",
    indicator_type: indicator.indicator_type ?? "output",
    target_value: indicator.target_value ?? "",
    baseline_value: indicator.baseline_value ?? "",
    unit: indicator.unit ?? "",
  })

  const submit = () => {
    put(route("admin.indicators.update", indicator.id), {
      onSuccess: () => {
        toast.success("Indicator updated successfully")
        setOpen(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Indicator</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          {/* Name */}
          <div className="space-y-1">
            <Label>Name</Label>
            <Input
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-1">
            <Label>Indicator Type</Label>
            <Select
              value={data.indicator_type}
              onValueChange={(value) =>
                setData("indicator_type", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="output">Output</SelectItem>
                <SelectItem value="outcome">Outcome</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Target + Baseline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Target Value</Label>
              <Input
                type="number"
                value={data.target_value}
                onChange={(e) =>
                  setData("target_value", e.target.value)
                }
              />
            </div>

            <div className="space-y-1">
              <Label>Baseline Value</Label>
              <Input
                type="number"
                value={data.baseline_value}
                onChange={(e) =>
                  setData("baseline_value", e.target.value)
                }
              />
            </div>
          </div>

          {/* Unit */}
          <div className="space-y-1">
            <Label>Unit</Label>
            <Input
              placeholder="households, people, schools…"
              value={data.unit}
              onChange={(e) => setData("unit", e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button onClick={submit} disabled={processing}>
              {processing ? "Updating..." : "Update Indicator"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
