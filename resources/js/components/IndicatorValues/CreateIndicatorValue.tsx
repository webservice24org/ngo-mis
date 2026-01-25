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


export function CreateIndicatorValue({ indicatorId }: any) {
  const { data, setData, post, processing, reset } = useForm({
    reporting_date: "",
    value: "",
  })

  const submit = () => {
    post(route("admin.indicators.values.store", indicatorId), {
      onSuccess: () => reset(),
    })
  }

  return (
    <Dialog>
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
