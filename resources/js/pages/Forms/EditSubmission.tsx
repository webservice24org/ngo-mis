import { useForm } from "@inertiajs/react"

export default function EditSubmission({ form, submission, answers }: any) {

  const { data, setData, put, processing } = useForm(answers)

  const handleSubmit = (e: any) => {
    e.preventDefault()

    put(`/forms/${form.id}/submissions/${submission.id}`)
  }

  const renderField = (field: any) => {
    switch (field.field_type) {

      case "text":
        return (
          <input
            type="text"
            value={data[field.field_name] || ""}
            onChange={(e) =>
              setData(field.field_name, e.target.value)
            }
            className="border p-2 w-full rounded"
          />
        )

      case "number":
        return (
          <input
            type="number"
            value={data[field.field_name] || ""}
            onChange={(e) =>
              setData(field.field_name, e.target.value)
            }
            className="border p-2 w-full rounded"
          />
        )

      case "date":
        return (
          <input
            type="date"
            value={data[field.field_name] || ""}
            onChange={(e) =>
              setData(field.field_name, e.target.value)
            }
            className="border p-2 w-full rounded"
          />
        )

      case "dropdown":
        return (
          <select
            value={data[field.field_name] || ""}
            onChange={(e) =>
              setData(field.field_name, e.target.value)
            }
            className="border p-2 w-full rounded"
          >
            <option value="">Select</option>
            {field.options?.map((opt: string) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )

      default:
        return null
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">

      <h1 className="text-2xl font-semibold mb-6">
        Edit Submission
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {form.fields.map((field: any) => (
          <div key={field.id}>
            <label className="block mb-2 font-medium">
              {field.label}
            </label>

            {renderField(field)}
          </div>
        ))}

        <button
          type="submit"
          disabled={processing}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Update
        </button>

      </form>
    </div>
  )
}
