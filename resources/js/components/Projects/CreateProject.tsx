declare function route(
  name: string,
  params?: any
): string
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "@inertiajs/react"
import { useState } from "react"
import toast from "react-hot-toast"
import { LocationSelector } from "@/components/Locations/LocationSelector"

export function CreateProject({ donors, managers, enumerators, locations}: any) {
  const [open, setOpen] = useState(false)
  


  const { data, setData, post, reset, processing, errors } = useForm({
  name: "",
  code: "",
  description: "",
  start_date: "",
  end_date: "",
  user_id: "",
  manager_id: "",
  team_ids: [] as number[],
  location_ids: [] as number[], // 🔥 FIX HERE
  status: "active",
})


  const submit = () => {
    post(route("admin.projects.store"), {
      onSuccess: () => {
        toast.success("Project created successfully")
        reset()
        setOpen(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Project</Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
      <DialogTitle>Edit Project</DialogTitle>
    </DialogHeader>
          <div className="space-y-4">

         <div className="space-y-1">
          <Label>Name</Label>
          <Input value={data.name} onChange={e => setData("name", e.target.value)} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="space-y-1">
          <Label>Code</Label>
          <Input value={data.code} onChange={e => setData("code", e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Description</Label>
          <Textarea
            placeholder="Type your message here."
            value={data.description}
            onChange={e => setData("description", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Start Date</Label>
            <Input
              type="date"
              value={data.start_date}
              onChange={e => setData("start_date", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>End Date</Label>
            <Input
              type="date"
              value={data.end_date}
              onChange={e => setData("end_date", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Donor</Label>
          <Select
            value={data.user_id ? String(data.user_id) : ""}
            onValueChange={value => setData("user_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Donor" />
            </SelectTrigger>
            <SelectContent>
              {donors.map((donor: any) => (
                <SelectItem key={donor.id} value={String(donor.id)}>
                  {donor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Project Manager</Label>
          <Select
            value={data.manager_id ? String(data.manager_id) : ""}
            onValueChange={value => setData("manager_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Manager" />
            </SelectTrigger>
            <SelectContent>
              {managers.map((manager: any) => (
                <SelectItem key={manager.id} value={String(manager.id)}>
                  {manager.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>



        <div className="space-y-2">
          <Label>Project Team (Enumerators)</Label>

          <div className="grid grid-cols-2 gap-2 border rounded p-3 max-h-48 overflow-y-auto">
            {enumerators.map((user: any) => {
              const checked = data.team_ids.includes(user.id)

              return (
                <label key={user.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setData("team_ids", [...data.team_ids, user.id])
                      } else {
                        setData(
                          "team_ids",
                          data.team_ids.filter((id: number) => id !== user.id)
                        )
                      }
                    }}
                  />
                  <span>{user.name}</span>
                </label>
              )
            })}
          </div>
        </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Project Locations</label>

            <LocationSelector
              locations={locations ?? []}
              selected={data.location_ids ?? []}
              onChange={(ids) => setData("location_ids", ids)}
            />

          </div>

        {/* Status */}
        <div className="space-y-1">
          <Label>Status</Label>
          <Select value={data.status} onValueChange={value => setData("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={submit} disabled={processing}>
          {processing ? "Saving..." : "Save"}
        </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
