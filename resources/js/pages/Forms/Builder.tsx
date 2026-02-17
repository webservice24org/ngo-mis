import { useForm, router } from "@inertiajs/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import { Link } from "lucide-react"

export default function Builder({ project, form }: any) {
  const [showOptions, setShowOptions] = useState(false)

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
    { value: "multiple_choice", label: "Multiple Choice" },
    { value: "checkbox", label: "Checkbox" },
    { value: "gps", label: "GPS" },
    { value: "file", label: "File Upload" },
  ]

  // 🔥 Auto-generate field_name from label
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

    if (
      type === "dropdown" ||
      type === "multiple_choice" ||
      type === "checkbox"
    ) {
      setShowOptions(true)
    } else {
      setShowOptions(false)
      setData("options", "")
    }
  }

  const submit = (e: any) => {
    e.preventDefault()

    let formattedOptions: string[] | null = null

    if (
      showOptions &&
      data.options
    ) {
      formattedOptions = data.options
        .split("\n")
        .map((opt) => opt.trim())
        .filter((opt) => opt !== "")
    }

    const payload = {
      ...data,
      options: formattedOptions,
    }

    router.post(
      `/admin/projects/${project.id}/forms/${form.id}/fields`,
      payload,
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("Field added")
          reset()
          setShowOptions(false)
        },
        onError: () => {
          toast.error("Fix errors")
        },
      }
    )
  }

  const deleteField = (id: number) => {
    if (!confirm("Delete this field?")) return

    router.delete(
      `/admin/projects/${project.id}/forms/${form.id}/fields/${id}`,
      {
        preserveScroll: true,
        onSuccess: () => toast.success("Field deleted"),
      }
    )
  }

  return (
    <div className="p-6 grid grid-cols-3 gap-6">
      <Link
        href={`/admin/projects/${project.id}/forms/${form.id}/submissions`}
        className="text-blue-600 underline"
      >
        View Submissions
      </Link>

      {/* LEFT SIDE — Existing Fields */}
      <div className="col-span-2 bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold">Form Fields</h2>

        {form.fields.length === 0 && (
          <p className="text-sm text-gray-500">
            No fields added yet.
          </p>
        )}

        {form.fields.map((field: any) => (
          <div
            key={field.id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <div className="font-medium">
                {field.label}
              </div>

              <div className="text-xs text-gray-500">
                {field.field_type}
                {field.is_required && (
                  <span className="ml-2 text-red-500">
                    • Required
                  </span>
                )}
              </div>
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteField(field.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>

      {/* RIGHT SIDE — Add Field */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Add Field
        </h2>

        <form onSubmit={submit} className="space-y-4">

          {/* Label */}
          <div>
            <Label>Label</Label>
            <Input
              value={data.label}
              onChange={(e) =>
                setData("label", e.target.value)
              }
            />
            {errors.label && (
              <p className="text-xs text-red-500">
                {errors.label}
              </p>
            )}
          </div>

          {/* Auto Field Name (readonly) */}
          <div>
            <Label>Field Name (auto)</Label>
            <Input
              value={data.field_name}
              readOnly
              className="bg-gray-100"
            />
          </div>

          {/* Field Type */}
          <div>
            <Label>Field Type</Label>
            <select
              className="w-full border rounded-md p-2"
              value={data.field_type}
              onChange={(e) =>
                handleTypeChange(e.target.value)
              }
            >
              {fieldTypes.map((type) => (
                <option
                  key={type.value}
                  value={type.value}
                >
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Options */}
          {showOptions && (
            <div>
              <Label>
                Options (one per line)
              </Label>
              <textarea
                className="w-full border rounded-md p-2"
                rows={4}
                value={data.options}
                onChange={(e) =>
                  setData("options", e.target.value)
                }
              />
            </div>
          )}

          {/* Required */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.is_required}
              onChange={(e) =>
                setData("is_required", e.target.checked)
              }
            />
            <Label>Required</Label>
          </div>

          <Button
            disabled={processing}
            className="w-full"
          >
            Add Field
          </Button>

        </form>
      </div>
    </div>
  )
}
