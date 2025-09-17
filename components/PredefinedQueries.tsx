"use client"

interface PredefinedQueriesProps {
  queries: any
  onSelect: (query: any) => void
}

export function PredefinedQueries({
  queries,
  onSelect,
}: PredefinedQueriesProps) {
  if (!queries) {
    return (
      <div className="text-center py-4 text-gray-500">
        Loading predefined queries...
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {Object.entries(queries).map(([key, query]: [string, any]) => (
        <button
          key={key}
          onClick={() => onSelect(query)}
          className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <div className="font-medium text-sm text-gray-900">{query.name}</div>
          <div className="text-xs text-gray-600 mt-1">{query.description}</div>
        </button>
      ))}
    </div>
  )
}
