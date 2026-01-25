declare function route(
  name: string,
  params?: any
): string
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useForm } from "@inertiajs/react"
import toast from "react-hot-toast"

interface DeleteUserProps {
  user: any
}

export function DeleteUser({ user }: DeleteUserProps) {
  const { delete: destroy, processing } = useForm({})

  const handleDelete = () => {
    destroy(route("admin.users.destroy", user.id), {
      onSuccess: () => {
        toast.success("User deleted successfully!")
      },
      onError: () => {
        toast.error("Failed to delete user.")
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
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <p>This action cannot be undone.</p>
        </AlertDialogHeader>
        <div className="flex justify-end space-x-2 mt-4">
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={processing}
            >
              {processing ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
