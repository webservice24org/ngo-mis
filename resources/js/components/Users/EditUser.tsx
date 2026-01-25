declare function route(
  name: string,
  params?: any
): string
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "@inertiajs/react"
import { useState } from "react"
import toast from "react-hot-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface EditUserProps {
  user: any
  roles: any[]
}

export function EditUser({ user, roles }: EditUserProps) {
  const [open, setOpen] = useState(false)

  const { data, setData, put, processing, errors } = useForm({
    name: user.name,
    email: user.email,
    role: user.roles[0]?.name || "", // assuming single role
  })

  const submit = (e: React.MouseEvent) => {
    e.preventDefault()

    put(route("admin.users.update", user.id), {
      onSuccess: () => {
        toast.success("User updated successfully!")
        setOpen(false)
      },
      onError: () => {
        toast.error("Failed to update user.")
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Name"
          value={data.name}
          onChange={(e) => setData("name", e.target.value)}
        />
        {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}

        <Input
          placeholder="Email"
          value={data.email}
          onChange={(e) => setData("email", e.target.value)}
        />
        {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}

        {/* Role */}
        <div className="mt-2 space-y-1">
          
          <Select
            value={data.role}
            onValueChange={(value) => setData("role", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>

            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.name}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {errors.role && <div className="text-red-500 text-sm">{errors.role}</div>}

        <Button
          onClick={submit}
          disabled={processing}
          className="mt-4"
        >
          {processing ? "Updating..." : "Update"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
