"use client"

import { XMarkIcon } from "@heroicons/react/24/outline"
import { COLLECTION_SCHEMAS } from "@/lib/schemas"

interface JoinBuilderProps {
  join: any
  collections: string[]
  currentCollection: string
  onChange: (join: any) => void
  onRemove: () => void
}

export function JoinBuilder({
  join,
  collections,
  currentCollection,
  onChange,
  onRemove,
}: JoinBuilderProps) {
  const currentSchema = COLLECTION_SCHEMAS[currentCollection]
  const joinSchema = COLLECTION_SCHEMAS[join.collection]
  const handleCollectionChange = (collection: string) => {
    onChange({ ...join, collection })
  }

  const handleLocalFieldChange = (localField: string) => {
    onChange({ ...join, localField })
  }

  const handleForeignFieldChange = (foreignField: string) => {
    onChange({ ...join, foreignField })
  }

  const handleAsChange = (as: string) => {
    onChange({ ...join, as })
  }

  return (
    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <select
          className="input text-sm"
          value={join.collection}
          onChange={(e) => handleCollectionChange(e.target.value)}
        >
          <option value="">Select Collection</option>
          {collections?.map((collection) => (
            <option key={collection} value={collection}>
              {collection
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <select
          className="input text-sm"
          value={join.localField}
          onChange={(e) => handleLocalFieldChange(e.target.value)}
        >
          <option value="">Select Local Field</option>
          {currentSchema &&
            Object.keys(currentSchema).map((field) => {
              const fieldInfo = currentSchema[field]
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
          value={join.foreignField}
          onChange={(e) => handleForeignFieldChange(e.target.value)}
        >
          <option value="">Select Foreign Field</option>
          {joinSchema &&
            Object.keys(joinSchema).map((field) => {
              const fieldInfo = joinSchema[field]
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
        <input
          type="text"
          className="input text-sm"
          placeholder="As"
          value={join.as}
          onChange={(e) => handleAsChange(e.target.value)}
        />
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
