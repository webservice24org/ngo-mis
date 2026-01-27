import { useState } from "react"
import { useForm } from "@inertiajs/react"
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
import { toast } from "react-hot-toast"

export function EditIndicatorValue({ value }: any) {
  const [open, setOpen] = useState(false)

  const { data, setData, put, processing, errors, reset } = useForm({
    reporting_date: value.reporting_date ?? "",
    value: value.value ?? "",
    notes: value.notes ?? "",
  })


  function submit(e: React.FormEvent) {
    e.preventDefault()

    put(
      `/admin/indicator-values/${value.id}`,
      {
        onSuccess: () => {
        toast.success("Indicator Value submitted successfully")
        reset()
        setOpen(false)
      },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Indicator Value</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={data.reporting_date}
              onChange={(e) => setData("reporting_date", e.target.value)}
            />

            {errors.reporting_date && (
              <p className="text-sm text-red-500">{errors.reporting_date}</p>
            )}

          </div>

          <div>
            <Label>Value</Label>
            <Input
              type="number"
              value={data.value}
              onChange={(e) => setData("value", e.target.value)}
            />
            {errors.value && (
              <p className="text-sm text-red-500">{errors.value}</p>
            )}
          </div>

          <div>
            <Label>Notes</Label>
            <Input
              value={data.notes}
              onChange={(e) => setData("notes", e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={processing}>
              Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
