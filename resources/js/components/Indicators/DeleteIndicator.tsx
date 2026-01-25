import { router } from "@inertiajs/react"
import toast from "react-hot-toast"

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"

declare function route(name: string, params?: any): string

export function DeleteIndicator({ indicatorId }: { indicatorId: number }) {
  const handleDelete = () => {
    router.delete(route("admin.indicators.destroy", indicatorId), {
      onSuccess: () => {
        toast.success("Indicator deleted successfully")
      },
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Indicator?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.  
            The indicator will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
