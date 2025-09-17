"use client"

import { useState } from "react"

interface QueryResultsProps {
  data: {
    data: any[]
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
    executionTime: number
  }
}

export function QueryResults({ data }: QueryResultsProps) {
  const [currentPage, setCurrentPage] = useState(data.page)

  if (!data.data || data.data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No results found</div>
    )
  }

  const getKeys = () => {
    const allKeys = new Set()
    data.data.forEach((item) => {
      Object.keys(item).forEach((key) => allKeys.add(key))
    })
    return Array.from(allKeys) as string[]
  }

  const keys = getKeys()

  return (
    <div className="space-y-4">
      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {(currentPage - 1) * data.limit + 1} to{" "}
          {Math.min(currentPage * data.limit, data.total)} of {data.total}{" "}
          results
        </span>
        <span>Executed in {data.executionTime}ms</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {keys.map((key) => (
                <th
                  key={key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {keys.map((key) => (
                  <td
                    key={key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {renderCellValue(item[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={!data.hasPrevPage}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {data.totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(data.totalPages, prev + 1))
              }
              disabled={!data.hasNextPage}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function renderCellValue(value: any): string {
  if (value === null || value === undefined) {
    return "-"
  }

  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return value.length > 0 ? `[${value.length} items]` : "[]"
    }
    return "[Object]"
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No"
  }

  if (typeof value === "string" && value.length > 50) {
    return value.substring(0, 50) + "..."
  }

  return String(value)
}
