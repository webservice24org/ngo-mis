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

export function CreateIndicator({ activityId }: { activityId: number }) {
  const [open, setOpen] = useState(false)

  const { data, setData, post, reset, processing, errors } = useForm({
    name: "",
    indicator_type: "output",
    target_value: "",
    baseline_value: "",
    unit: "",
  })

  const submit = () => {
    post(route("admin.activities.indicators.store", activityId), {
      onSuccess: () => {
        toast.success("Indicator created successfully")
        reset()
        setOpen(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Indicator</Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Indicator</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          {/* Name */}
          <div className="space-y-1">
            <Label>Name</Label>
            <Input
              value={data.name}
              onChange={e => setData("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Indicator Type */}
          <div className="space-y-1">
            <Label>Indicator Type</Label>
            <Select
              value={data.indicator_type}
              onValueChange={value => setData("indicator_type", value)}
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
                onChange={e => setData("target_value", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label>Baseline Value</Label>
              <Input
                type="number"
                value={data.baseline_value}
                onChange={e => setData("baseline_value", e.target.value)}
              />
            </div>
          </div>

          {/* Unit */}
          <div className="space-y-1">
            <Label>Unit</Label>
            <Input
              placeholder="e.g. households, people"
              value={data.unit}
              onChange={e => setData("unit", e.target.value)}
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
              {processing ? "Saving..." : "Save Indicator"}
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
