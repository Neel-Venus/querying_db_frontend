"use client"

import { XMarkIcon } from "@heroicons/react/24/outline"
import { COLLECTION_SCHEMAS } from "@/lib/schemas"

interface SortBuilderProps {
  sort: any
  collection: string
  onChange: (sort: any) => void
  onRemove: () => void
}

export function SortBuilder({
  sort,
  collection,
  onChange,
  onRemove,
}: SortBuilderProps) {
  const schema = COLLECTION_SCHEMAS[collection]
  const handleFieldChange = (field: string) => {
    onChange({ ...sort, field })
  }

  const handleDirectionChange = (direction: string) => {
    onChange({ ...sort, direction })
  }

  return (
    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <select
          className="input text-sm"
          value={sort.field}
          onChange={(e) => handleFieldChange(e.target.value)}
        >
          <option value="">Select Field</option>
          {schema &&
            Object.keys(schema).map((field) => {
              const fieldInfo = schema[field]
              const displayName = field
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())
              const typeInfo = `(${fieldInfo.type})`
              return (
                <option key={field} value={field}>
                  {displayName} {typeInfo}
                </option>
              )
            })}
        </select>
      </div>

      <div className="flex-1">
        <select
          className="input text-sm"
          value={sort.direction}
          onChange={(e) => handleDirectionChange(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <button
        onClick={onRemove}
        className="p-2 text-red-500 hover:text-red-700"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  )
}
