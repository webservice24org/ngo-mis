declare function route(name: string, params?: any): string

import AppLayout from "@/layouts/app-layout"
import { Head, useForm, router, Link } from "@inertiajs/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"

import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Copy, Pencil, Trash2 } from "lucide-react"

interface Field {
  id: number
  label: string
  field_name: string
  field_type: string
  is_required: boolean
}

interface Form {
  id: number
  name: string
  fields: Field[]
}

interface Project {
  id: number
  name: string
}

interface Props {
  project: Project
  form: Form
}

function SortableField({
  field,
  onDelete,
  onEdit,
  onDuplicate,
}: {
  field: Field
  onDelete: (id: number) => void
  onEdit: (field: Field) => void
  onDuplicate: (id: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg p-4 flex justify-between items-center bg-white"
    >
      <div className="flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab text-gray-400 hover:text-gray-600"
        >
          <GripVertical size={18} />
        </div>

        <div>
          <div className="font-medium">{field.label}</div>
          <div className="text-xs text-gray-500">
            {field.field_type}
            {field.is_required && (
              <span className="ml-2 text-red-500">• Required</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => onEdit(field)}>
          <Pencil size={14} />
        </Button>

        <Button size="sm" variant="secondary" onClick={() => onDuplicate(field.id)}>
          <Copy size={14} />
        </Button>

        
        <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="destructive">
            <Trash2 size={14} />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Field?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete
              <strong> {field.label} </strong>
              from the form.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={() => onDelete(field.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      </div>
    </div>
  )
}

export default function Builder({ project, form }: Props) {
  const sensors = useSensors(useSensor(PointerSensor))
  const [items, setItems] = useState<Field[]>(form.fields)
  const [editingField, setEditingField] = useState<Field | null>(null)
  const [showOptions, setShowOptions] = useState(false)

  useEffect(() => {
    setItems(form.fields)
  }, [form.fields])

  // ---------------------------
  // DRAG REORDER
  // ---------------------------
  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    const newItems = arrayMove(items, oldIndex, newIndex)

    setItems(newItems)

    router.post(
      route("admin.projects.forms.fields.reorder", [project.id, form.id]),
      { fields: newItems.map((f) => f.id) },
      { preserveScroll: true }
    )
  }

  // ---------------------------
  // ADD FIELD
  // ---------------------------
  const { data, setData, reset, processing, errors } = useForm({
    label: "",
    field_name: "",
    field_type: "text",
    options: "",
    is_required: false,
  })

  const fieldTypes = [
    { value: "text", label: "Text" },
    { value: "number", label: "Number" },
    { value: "date", label: "Date" },
    { value: "dropdown", label: "Dropdown" },
    { value: "checkbox", label: "Checkbox" },
  ]

  useEffect(() => {
    if (!data.label) {
      setData("field_name", "")
      return
    }

    const generated = data.label
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, "_")

    setData("field_name", generated)
  }, [data.label])

  const handleTypeChange = (type: string) => {
    setData("field_type", type)
    if (type === "dropdown" || type === "checkbox") {
      setShowOptions(true)
    } else {
      setShowOptions(false)
      setData("options", "")
    }
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    router.post(
      route("admin.projects.forms.fields.store", [project.id, form.id]),
      data,
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("Field added successfully")
          reset()
          setShowOptions(false)
        },
        onError: () => toast.error("Fix validation errors"),
      }
    )
  }

  // ---------------------------
  // DELETE
  // ---------------------------
  const deleteField = (id: number) => {
  router.delete(
    route("admin.projects.forms.fields.destroy", [
      project.id,
      form.id,
      id,
    ]),
    {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Field deleted successfully")
      },
    }
  )
}


  // ---------------------------
  // DUPLICATE
  // ---------------------------
  const duplicateField = (id: number) => {
    router.post(
      route("admin.projects.forms.fields.duplicate", [
        project.id,
        form.id,
        id,
      ]),
      {},
      {
        preserveScroll: true,
        onSuccess: () => toast.success("Field duplicated"),
      }
    )
  }

  return (
    <AppLayout>
      <Head title={`Builder - ${form.name}`} />

      <div className="p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              Form Builder — {form.name}
            </h1>
            <p className="text-sm text-gray-500">
              Project: {project.name}
            </p>
          </div>

          <Link
            href={route("admin.projects.forms.submissions.index", [
              project.id,
              form.id,
            ])}
            className="text-indigo-600 underline"
          >
            View Submissions
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* LEFT — FIELDS */}
          <div className="col-span-2 bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold">Form Fields</h2>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {items.map((field) => (
                    <SortableField
                      key={field.id}
                      field={field}
                      onDelete={deleteField}
                      onEdit={setEditingField}
                      onDuplicate={duplicateField}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* RIGHT — ADD FIELD */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              Add Field
            </h2>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label>Label</Label>
                <Input
                  value={data.label}
                  onChange={(e) => setData("label", e.target.value)}
                />
                {errors.label && (
                  <p className="text-xs text-red-500">{errors.label}</p>
                )}
              </div>

              <div>
                <Label>Field Name (auto)</Label>
                <Input value={data.field_name} readOnly className="bg-gray-100" />
              </div>

              <div>
                <Label>Field Type</Label>
                <select
                  className="w-full border rounded-md p-2"
                  value={data.field_type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                >
                  {fieldTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={data.is_required}
                  onChange={(e) => setData("is_required", e.target.checked)}
                />
                <Label>Required</Label>
              </div>

              <Button disabled={processing} className="w-full">
                Add Field
              </Button>
            </form>
          </div>

        </div>

        {/* EDIT MODAL */}
        {editingField && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-96 space-y-4">
              <h2 className="text-lg font-semibold">Edit Field</h2>

              <Input
                value={editingField.label}
                onChange={(e) =>
                  setEditingField({
                    ...editingField,
                    label: e.target.value,
                  })
                }
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingField.is_required}
                  onChange={(e) =>
                    setEditingField({
                      ...editingField,
                      is_required: e.target.checked,
                    })
                  }
                />
                <Label>Required</Label>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setEditingField(null)}
                >
                  Cancel
                </Button>

                <Button
                  onClick={() => {
                    router.put(
                    route("admin.projects.forms.fields.update", [
                      project.id,
                      form.id,
                      editingField.id,
                    ]),
                    {
                      label: editingField.label,
                      is_required: editingField.is_required,
                    },
                    {
                      preserveScroll: true,
                      onSuccess: () => {
                        toast.success("Field updated")
                        setEditingField(null)
                      },
                    }
                  )

                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
