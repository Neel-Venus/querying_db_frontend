"use client"

interface CollectionSelectorProps {
  collections: string[]
  value: string
  onChange: (collection: string) => void
}

export function CollectionSelector({
  collections,
  value,
  onChange,
}: CollectionSelectorProps) {
  return (
    <select
      className="input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {collections?.map((collection) => (
        <option key={collection} value={collection}>
          {collection
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        </option>
      ))}
    </select>
  )
}
