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
import { Plus } from "lucide-react"

export function CreateLocation({ parentId, type }: any) {
  const [open, setOpen] = useState(false)

  if (!type) return null

  const { data, setData, post, processing, errors } = useForm({
    name: "",
    type,
    parent_id: parentId,
  })

  function submit(e: React.FormEvent) {
    e.preventDefault()

    post("/admin/locations", {
      onSuccess: () => setOpen(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <Plus size={14} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add {type}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <Input
            placeholder={`${type} name`}
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
          />

          {errors.name && (
            <p className="text-sm text-red-500">{errors.name}</p>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={processing}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
