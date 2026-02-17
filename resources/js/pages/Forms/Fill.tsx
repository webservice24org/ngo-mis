import { useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMemo } from "react"
import toast from "react-hot-toast"

export default function Fill({ form }: any) {

  // Build dynamic default values
  const initialData = useMemo(() => {
    const obj: any = {}
    form.fields.forEach((field: any) => {
      obj[field.field_name] = ""
    })
    return obj
  }, [form.fields])

  const { data, setData, post, processing, errors } = useForm(initialData)

  const submit = (e: any) => {
    e.preventDefault()

    post(`/forms/${form.id}/submit`, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Form submitted successfully")
      },
      onError: () => {
        toast.error("Please fix errors")
      },
    })
  }

  const renderField = (field: any) => {
    switch (field.field_type) {

      case "text":
      case "number":
      case "date":
        return (
          <Input
            type={field.field_type}
            value={data[field.field_name]}
            onChange={(e) =>
              setData(field.field_name, e.target.value)
            }
          />
        )

      case "dropdown":
        return (
          <select
            className="w-full border rounded-md p-2"
            value={data[field.field_name]}
            onChange={(e) =>
              setData(field.field_name, e.target.value)
            }
          >
            <option value="">Select option</option>
            {field.options?.map((option: string, index: number) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case "multiple_choice":
        return field.options?.map((option: string, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="radio"
              name={field.field_name}
              value={option}
              checked={data[field.field_name] === option}
              onChange={() =>
                setData(field.field_name, option)
              }
            />
            <span>{option}</span>
          </div>
        ))

      case "checkbox":
        return field.options?.map((option: string, index: number) => {
          const values = data[field.field_name] || []

          const toggle = () => {
            if (values.includes(option)) {
              setData(
                field.field_name,
                values.filter((v: string) => v !== option)
              )
            } else {
              setData(field.field_name, [...values, option])
            }
          }

          return (
            <div key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={values.includes(option)}
                onChange={toggle}
              />
              <span>{option}</span>
            </div>
          )
        })

      case "file":
        return (
          <Input
            type="file"
            onChange={(e: any) =>
              setData(field.field_name, e.target.files[0])
            }
          />
        )

      default:
        return (
          <Input
            value={data[field.field_name]}
            onChange={(e) =>
              setData(field.field_name, e.target.value)
            }
          />
        )
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-semibold mb-6">
        {form.name}
      </h1>

      <form onSubmit={submit} className="space-y-6">

        {form.fields.map((field: any) => (
          <div key={field.id}>

            <Label className="block mb-2">
              {field.label}
              {field.is_required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </Label>

            {renderField(field)}

            {errors[field.field_name] && (
              <p className="text-sm text-red-500 mt-1">
                {errors[field.field_name]}
              </p>
            )}
          </div>
        ))}

        <Button disabled={processing} className="w-full">
          Submit
        </Button>

      </form>
    </div>
  )
}
