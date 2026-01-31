import { useState } from "react"
import { router } from "@inertiajs/react"
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

  function changePeriod(period: "monthly" | "quarterly") {
    router.reload({
      data: { period },
      preserveUrl: true,
    })
  }

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

        {/* PERIOD SWITCHER */}
        <div className="flex gap-2 mb-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => changePeriod("monthly")}
          >
            Monthly
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => changePeriod("quarterly")}
          >
            Quarterly
          </Button>
        </div>

        {/* CHART */}
        <IndicatorChart indicator={indicator} />
      </DialogContent>
    </Dialog>
  )
}
