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
      <div className="text-xs text-gray-500 mb-2">
        💡 Click any query below to load it, then modify the parameters as
        needed!
      </div>
      {Object.entries(queries).map(([key, query]: [string, any]) => (
        <button
          key={key}
          onClick={() => onSelect(query)}
          className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-blue-200"
        >
          <div className="font-medium text-sm text-gray-900">{query.name}</div>
          <div className="text-xs text-gray-600 mt-1">{query.description}</div>
          {query.conditions &&
            query.conditions.some(
              (c: any) =>
                c.value === "client_name_here" ||
                c.value === "subreddit_name" ||
                c.value === "removed"
            ) && (
              <div className="text-xs text-orange-600 mt-1 font-medium">
                ⚠️ Requires parameter changes
              </div>
            )}
        </button>
      ))}
    </div>
  )
}
