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
  onPageChange?: (page: number) => void
}

export function QueryResults({ data, onPageChange }: QueryResultsProps) {
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
          Showing {(data.page - 1) * data.limit + 1} to{" "}
          {Math.min(data.page * data.limit, data.total)} of {data.total} results
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
                  <td key={key} className="px-6 py-4 text-sm text-gray-900">
                    <CellRenderer value={item[key]} />
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
              onClick={() => {
                const newPage = Math.max(1, data.page - 1)
                if (onPageChange) {
                  onPageChange(newPage)
                }
              }}
              disabled={!data.hasPrevPage}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {data.page} of {data.totalPages}
            </span>
            <button
              onClick={() => {
                const newPage = Math.min(data.totalPages, data.page + 1)
                if (onPageChange) {
                  onPageChange(newPage)
                }
              }}
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

function CellRenderer({ value }: { value: any }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [showObjectModal, setShowObjectModal] = useState(false)

  if (value === null || value === undefined) {
    return <span className="text-gray-400 italic">null</span>
  }

  if (typeof value === "object") {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-gray-400">[]</span>
      }
      return (
        <div className="relative">
          <button
            onClick={() => setShowObjectModal(true)}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            [{value.length} items]
          </button>
          {showObjectModal && (
            <ObjectModal
              value={value}
              onClose={() => setShowObjectModal(false)}
              title="Array Contents"
            />
          )}
        </div>
      )
    }

    // Special handling for client objects (from joins)
    if (value.client_name) {
      return (
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{value.client_name}</div>
          <div className="text-xs text-gray-500">
            {value.plan && (
              <span className="bg-blue-100 text-blue-800 px-1 rounded">
                {value.plan}
              </span>
            )}
            {value.priority && (
              <span className="ml-1 bg-orange-100 text-orange-800 px-1 rounded">
                {value.priority}
              </span>
            )}
          </div>
          <button
            onClick={() => setShowObjectModal(true)}
            className="text-blue-600 hover:text-blue-800 underline text-xs"
          >
            View full details
          </button>
          {showObjectModal && (
            <ObjectModal
              value={value}
              onClose={() => setShowObjectModal(false)}
              title="Client Details"
            />
          )}
        </div>
      )
    }

    return (
      <div className="relative">
        <button
          onClick={() => setShowObjectModal(true)}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {Object.keys(value).length} fields
        </button>
        {showObjectModal && (
          <ObjectModal
            value={value}
            onClose={() => setShowObjectModal(false)}
            title="Object Details"
          />
        )}
      </div>
    )
  }

  if (typeof value === "boolean") {
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {value ? "Yes" : "No"}
      </span>
    )
  }

  const stringValue = String(value)
  const isTruncated = stringValue.length > 50
  const displayValue = isTruncated
    ? stringValue.substring(0, 50) + "..."
    : stringValue

  if (isTruncated) {
    return (
      <div className="relative">
        <span
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(stringValue)
              // Show a brief success indication
              const originalContent = document.activeElement?.textContent
              if (document.activeElement) {
                const element = document.activeElement as HTMLElement
                const originalText = element.textContent
                element.textContent = "Copied!"
                setTimeout(() => {
                  if (element.textContent === "Copied!") {
                    element.textContent = originalText
                  }
                }, 1000)
              }
            } catch (err) {
              console.error("Failed to copy text: ", err)
            }
          }}
          className="cursor-pointer hover:bg-gray-100 rounded px-1"
          title="Click to copy full text"
        >
          {displayValue}
        </span>
        {showTooltip && (
          <div className="absolute z-50 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg max-w-md whitespace-normal break-words bottom-full left-0 mb-2">
            <div className="mb-2">{stringValue}</div>
            <div className="text-xs text-gray-300 border-t border-gray-700 pt-2">
              💡 Click the text above to copy to clipboard
            </div>
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>
    )
  }

  // Special handling for dates
  if (stringValue.includes("T") && stringValue.includes("Z")) {
    try {
      const date = new Date(stringValue)
      return (
        <span className="text-gray-600">
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </span>
      )
    } catch {
      return <span>{displayValue}</span>
    }
  }

  // Special handling for URLs
  if (stringValue.startsWith("http")) {
    return (
      <a
        href={stringValue}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline max-w-xs truncate block"
      >
        {displayValue}
      </a>
    )
  }

  return <span>{displayValue}</span>
}

function ObjectModal({
  value,
  onClose,
  title,
}: {
  value: any
  onClose: () => void
  title: string
}) {
  const jsonString = JSON.stringify(value, null, 2)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString)
      // You could add a toast notification here
      console.log("JSON copied to clipboard")
    } catch (err) {
      console.error("Failed to copy JSON: ", err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl max-h-96 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={copyToClipboard}
              className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 bg-blue-50 rounded hover:bg-blue-100"
              title="Copy to clipboard"
            >
              📋 Copy
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto select-all">
          {jsonString}
        </pre>
        <div className="mt-2 text-xs text-gray-500">
          💡 You can also select and copy text directly from the JSON above
        </div>
      </div>
    </div>
  )
}
