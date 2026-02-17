import { useForm } from "@inertiajs/react"
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"

export default function BeneficiaryModal({
  projectId,
  beneficiary = null,
  locations,
  open,
  onClose,
}: any) {
  const isEdit = !!beneficiary

  const { data, setData, post, put, processing, errors, reset } =
    useForm({
      unique_code: "",
      gender: "",
      date_of_birth: "",
      location_id: "",
      vulnerability_type: "",
      phone: "",
      national_id: "",
    })

  /* ---------------- Populate when editing ---------------- */
  useEffect(() => {
    if (beneficiary) {
      setData({
        unique_code: beneficiary.unique_code || "",
        gender: beneficiary.gender || "",
        date_of_birth: beneficiary.date_of_birth || "",
        location_id: beneficiary.location_id || "",
        vulnerability_type: beneficiary.vulnerability_type || "",
        phone: beneficiary.phone || "",
        national_id: beneficiary.national_id || "",
      })
    } else {
      reset()
    }
  }, [beneficiary])

  useEffect(() => {
    if (!open) reset()
  }, [open])

  /* ---------------- Age Calculator ---------------- */
  const calculateAge = (dob: string) => {
    if (!dob) return ""
    const birthDate = new Date(dob)
    const today = new Date()

    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  /* ---------------- Dropdown State ---------------- */
  const [openDropdown, setOpenDropdown] = useState(false)
  const [search, setSearch] = useState("")
  const [expanded, setExpanded] = useState<string[]>([])
  const dropdownRef = useRef<any>(null)

  const toggleExpand = (id: string) => {
    setExpanded((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    )
  }

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () =>
      document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  /* ---------------- Recursive Tree Render ---------------- */
  const renderTree = (nodes: any[], level = 0) => {
    return nodes
      .filter((node) =>
        node.name.toLowerCase().includes(search.toLowerCase())
      )
      .map((node) => {
        const hasChildren = node.children_recursive?.length > 0
        const isExpanded = expanded.includes(String(node.id))

        return (
          <div key={node.id}>
            <div
              className={`flex items-center gap-2 text-sm cursor-pointer px-2 py-1 rounded hover:bg-gray-100`}
              style={{ paddingLeft: `${level * 18 + 8}px` }}
            >
              {hasChildren && (
                <span
                  onClick={() => toggleExpand(String(node.id))}
                  className="text-xs w-4"
                >
                  {isExpanded ? "▼" : "▶"}
                </span>
              )}

              <span
                className="flex-1"
                onClick={() => {
                  setData("location_id", String(node.id))
                  setOpenDropdown(false)
                }}
              >
                {node.name}
              </span>
            </div>

            {hasChildren && isExpanded &&
              renderTree(node.children_recursive, level + 1)}
          </div>
        )
      })
  }

  const selectedLocation = (function find(nodes: any[]): any {
    for (let node of nodes) {
      if (String(node.id) === String(data.location_id)) {
        return node
      }
      if (node.children_recursive?.length) {
        const found = find(node.children_recursive)
        if (found) return found
      }
    }
    return null
  })(locations)

  /* ---------------- Submit ---------------- */
  const submit = (e: any) => {
    e.preventDefault()

    const options = {
      preserveScroll: true,
      onSuccess: () => {
        toast.success(
          isEdit
            ? "Beneficiary updated successfully"
            : "Beneficiary created successfully"
        )
        reset()
        onClose()
      },
      onError: () => {
        toast.error("Please fix the errors")
      },
    }

    if (isEdit) {
      put(
        `/admin/projects/${projectId}/beneficiaries/${beneficiary.id}`,
        options
      )
    } else {
      post(`/admin/projects/${projectId}/beneficiaries`, options)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-162.5 rounded-2xl p-6 space-y-6 shadow-xl">

        <h2 className="text-xl font-semibold">
          {isEdit ? "Edit Beneficiary" : "Create Beneficiary"}
        </h2>

        <form onSubmit={submit} className="space-y-4">

          {/* ROW 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Unique Code</Label>
              <Input
                value={data.unique_code}
                onChange={(e) =>
                  setData("unique_code", e.target.value)
                }
              />
            </div>

            <div>
              <Label>Gender</Label>
              <select
                className="w-full border rounded-md p-2"
                value={data.gender}
                onChange={(e) =>
                  setData("gender", e.target.value)
                }
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* ROW 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date of Birth</Label>
              <Input
                type="date"
                value={data.date_of_birth}
                onChange={(e) =>
                  setData("date_of_birth", e.target.value)
                }
              />
              {data.date_of_birth && (
                <p className="text-xs text-gray-500 mt-1">
                  Age: {calculateAge(data.date_of_birth)} years
                </p>
              )}
            </div>

            <div className="relative" ref={dropdownRef}>
              <Label>Location</Label>

              <button
                type="button"
                onClick={() => setOpenDropdown(!openDropdown)}
                className="w-full border rounded-md px-3 py-2 text-sm bg-white flex justify-between items-center"
              >
                <span>
                  {selectedLocation
                    ? selectedLocation.name
                    : "Select Location"}
                </span>
                <span className="text-xs">
                  {openDropdown ? "▲" : "▼"}
                </span>
              </button>

              {openDropdown && (
                <div className="absolute z-50 mt-2 w-full border rounded-xl bg-white shadow-lg max-h-80 overflow-y-auto p-2 space-y-2">

                  {/* SEARCH */}
                  <Input
                    placeholder="Search location..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <div className="pt-2">
                    {renderTree(locations)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ROW 3 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Phone</Label>
              <Input
                value={data.phone}
                onChange={(e) =>
                  setData("phone", e.target.value)
                }
              />
            </div>

            <div>
              <Label>National ID</Label>
              <Input
                value={data.national_id}
                onChange={(e) =>
                  setData("national_id", e.target.value)
                }
              />
            </div>
          </div>

          {/* ROW 4 */}
          <div>
            <Label>Vulnerability Type</Label>
            <Input
              value={data.vulnerability_type}
              onChange={(e) =>
                setData("vulnerability_type", e.target.value)
              }
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                onClose()
              }}
            >
              Cancel
            </Button>

            <Button disabled={processing}>
              {processing
                ? "Processing..."
                : isEdit
                ? "Update"
                : "Create"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}
