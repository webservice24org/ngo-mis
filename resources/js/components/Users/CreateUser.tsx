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
//import route from "ziggy-js" // ✅ FIX

export function CreateUser({ roles }: any) {
  const { data, setData, post, processing } = useForm({
    name: "",
    email: "",
    password: "",
    role: ""
  })

  const submit = () => {
    post(route("admin.users.store"))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create User</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Name"
          onChange={e => setData("name", e.target.value)}
        />

        <Input
          placeholder="Email"
          onChange={e => setData("email", e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          onChange={e => setData("password", e.target.value)}
        />

        <select
          className="w-full border rounded p-2"
          onChange={e => setData("role", e.target.value)}
        >
          <option value="">Select Role</option>
          {roles.map((role: any) => (
            <option key={role.id} value={role.name}>
              {role.name}
            </option>
          ))}
        </select>

        <Button onClick={submit} disabled={processing}>
          Save
        </Button>
      </DialogContent>
    </Dialog>
  )
}
function route(arg0: string): string {
    throw new Error("Function not implemented.")
}


