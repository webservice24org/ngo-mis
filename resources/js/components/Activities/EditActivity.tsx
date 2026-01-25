declare function route(
  name: string,
  params?: any
): string
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "@inertiajs/react"
import { useState } from "react"
import toast from "react-hot-toast"

export function EditActivity({ activity }: any) {
  const [open, setOpen] = useState(false)

  const { data, setData, put, processing, errors } = useForm({
    name: activity.name ?? "",
    description: activity.description ?? "",
    start_date: activity.start_date ?? "",
    end_date: activity.end_date ?? "",
    target_value: activity.target_value ?? "",
    unit: activity.unit ?? "",
  })

  const submit = () => {
    put(route("admin.activities.update", activity.id), {
      onSuccess: () => {
        toast.success("Activity updated")
        setOpen(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">Edit</Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Activity</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={data.name}
              onChange={e => setData("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={data.description}
              onChange={e => setData("description", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={data.start_date}
                onChange={e => setData("start_date", e.target.value)}
              />
            </div>

            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={data.end_date}
                onChange={e => setData("end_date", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Target Value</Label>
              <Input
                type="number"
                value={data.target_value}
                onChange={e => setData("target_value", e.target.value)}
              />
            </div>

            <div>
              <Label>Unit</Label>
              <Input
                placeholder="households / people"
                value={data.unit}
                onChange={e => setData("unit", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button onClick={submit} disabled={processing}>
              {processing ? "Updating..." : "Update Activity"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
