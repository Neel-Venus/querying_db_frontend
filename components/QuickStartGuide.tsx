"use client"

interface QuickStartGuideProps {
  onSelectExample: (example: any) => void
}

export function QuickStartGuide({ onSelectExample }: QuickStartGuideProps) {
  const examples = [
    {
      id: "google-findings-search",
      title: "Search Google Findings",
      description: "Find Google findings with text search (like 'sierra skye')",
      icon: "🔍",
      action: () =>
        onSelectExample({
          collection: "google_findings",
          searchText: "sierra skye",
          status: "",
          clientName: "",
        }),
    },
    {
      id: "client-specific-findings",
      title: "Findings by Client",
      description: "Find all findings for a specific client",
      icon: "👤",
      action: () =>
        onSelectExample({
          collection: "google_findings",
          clientName: "Claire Stone",
          status: "",
          searchText: "",
        }),
    },
    {
      id: "status-based-search",
      title: "Filter by Status",
      description: "Find items with specific status (pending, removed, etc.)",
      icon: "📊",
      action: () =>
        onSelectExample({
          collection: "google_findings",
          status: "removed",
          clientName: "",
          searchText: "",
        }),
    },
    {
      id: "date-range-search",
      title: "Date Range Query",
      description: "Find items created within a specific time period",
      icon: "📅",
      action: () =>
        onSelectExample({
          collection: "google_findings",
          dateFrom: "2024-01-01",
          dateTo: "2024-12-31",
          clientName: "",
          searchText: "",
        }),
    },
  ]

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        🚀 Quick Start Examples
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Click an example to get started with common queries:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {examples.map((example) => (
          <button
            key={example.id}
            onClick={example.action}
            className="p-3 text-left bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg border border-blue-200 transition-colors"
          >
            <div className="flex items-start space-x-2">
              <span className="text-lg">{example.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-900">
                  {example.title}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {example.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="text-sm text-green-800">
          <strong>Pro tip:</strong> Start with Simple Query mode for basic
          searches, then switch to Advanced mode for complex joins and
          filtering.
        </div>
      </div>
    </div>
  )
}
