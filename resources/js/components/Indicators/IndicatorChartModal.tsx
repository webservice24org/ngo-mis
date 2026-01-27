import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { IndicatorChart } from "./IndicatorChart"

export function IndicatorChartModal({ indicator }: any) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          📊 Chart
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{indicator.name} Progress</DialogTitle>
        </DialogHeader>

        <IndicatorChart indicator={indicator} />
      </DialogContent>
    </Dialog>
  )
}
