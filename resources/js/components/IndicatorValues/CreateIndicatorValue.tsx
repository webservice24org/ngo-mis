declare function route(
  name: string,
  params?: any
): string
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
import { useState } from "react"
import { toast } from "react-hot-toast"


export function CreateIndicatorValue({ indicatorId }: any) {
  const [open, setOpen] = useState(false)
  const { data, setData, post, processing, reset } = useForm({
    reporting_date: "",
    value: "",
  })

  const submit = () => {
    post(route("admin.indicators.values.store", indicatorId), {
      onSuccess: () => {
        toast.success("Indicator Value submitted successfully")
        reset()
        setOpen(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Value</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Indicator Value</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            type="date"
            value={data.reporting_date}
            onChange={e => setData("reporting_date", e.target.value)}
          />

          <Input
            type="number"
            placeholder="Value"
            value={data.value}
            onChange={e => setData("value", e.target.value)}
          />

          <Button onClick={submit} disabled={processing}>
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
