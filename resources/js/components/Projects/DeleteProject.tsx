declare function route(
  name: string,
  params?: any
): string
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { router } from "@inertiajs/react"
import toast from "react-hot-toast"

export function DeleteProject({ projectId }: { projectId: number }) {
  const destroy = () => {
    router.delete(route("admin.projects.destroy", projectId), {
      onSuccess: () => toast.success("Project deleted"),
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
        
      </AlertDialogTrigger>

      <AlertDialogContent>
        <p>Are you sure?</p>
        <p>This action cannot be undone.</p>
        <div className="flex justify-end space-x-2 mt-4">
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={destroy}>
          Delete
        </AlertDialogAction>
        </div>
        

        
      </AlertDialogContent>
    </AlertDialog>
  )
}
