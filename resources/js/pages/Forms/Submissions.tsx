import { Link } from "@inertiajs/react"

export default function Submissions({ form }: any) {

  return (
    <div className="p-6">

      <h1 className="text-2xl font-semibold mb-6">
        Submissions - {form.name}
      </h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border-collapse">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">#</th>

              {form.fields.map((field: any) => (
                <th key={field.id} className="p-3 border">
                  {field.label}
                </th>
              ))}

              <th className="p-3 border">Submitted At</th>
            </tr>
          </thead>

          <tbody>
            {form.submissions.map((submission: any, index: number) => (

              <tr key={submission.id} className="hover:bg-gray-50">
                <td className="p-3 border">{index + 1}</td>

                {form.fields.map((field: any) => {

                  const valueObj = submission.values.find(
                    (v: any) => v.form_field_id === field.id
                  )

                  let value = valueObj?.value

                  // Decode checkbox
                  try {
                    const parsed = JSON.parse(value)
                    if (Array.isArray(parsed)) {
                      value = parsed.join(", ")
                    }
                  } catch {}

                  return (
                    <td key={field.id} className="p-3 border">
                      {value}
                    </td>
                  )
                })}

                <td className="p-3 border">
                  {new Date(submission.created_at).toLocaleString()}
                </td>
              </tr>

            ))}
          </tbody>

        </table>
      </div>

    </div>
  )
}
