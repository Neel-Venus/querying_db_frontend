"use client"

import { useState } from "react"
import { useMutation } from "react-query"
import { api } from "@/lib/api"
import { toast } from "react-hot-toast"

interface SimpleQueryBuilderProps {
  onResults: (results: any) => void
  query?: any
  onQueryChange?: (query: any) => void
}

export function SimpleQueryBuilder({
  onResults,
  query: controlledQuery,
  onQueryChange,
}: SimpleQueryBuilderProps) {
  const [localQuery, setLocalQuery] = useState({
    collection: "google_findings",
    clientName: "",
    status: "",
    priority: "",
    dateFrom: "",
    dateTo: "",
    searchText: "",
    limit: 10,
    page: 1,
  })

  const query = controlledQuery || localQuery
  const setQuery = onQueryChange || setLocalQuery

  const executeQuery = useMutation(
    (queryData: any) => api.post("/query/simple-query", queryData),
    {
      onSuccess: (response) => {
        onResults(response.data)
        toast.success("Query executed successfully")
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Query execution failed")
      },
    }
  )

  const handleExecute = () => {
    executeQuery.mutate(query)
  }

  const collectionOptions = [
    { value: "google_findings", label: "Google Findings" },
    { value: "twitter_findings", label: "Twitter Findings" },
    { value: "reddit_data", label: "Reddit Data" },
    { value: "colab_links", label: "Colab Links" },
    { value: "clients", label: "Clients" },
  ]

  const statusOptions = [
    { value: "", label: "Any Status" },
    { value: "rejected", label: "Rejected" },
    { value: "delisted", label: "Delisted" },
    { value: "counter-notice", label: "Counter-notice" },
  ]

  const priorityOptions = [
    { value: "", label: "Any Priority" },
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
    { value: "Critical", label: "Critical" },
  ]

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        🚀 Simple Query Builder
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Ask simple questions about your data - just fill in what you're looking
        for!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Collection */}
        <div>
          <label className="label">What type of data?</label>
          <select
            className="input"
            value={query.collection}
            onChange={(e) =>
              setQuery((prev) => ({ ...prev, collection: e.target.value }))
            }
          >
            {collectionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Client Name */}
        <div>
          <label className="label">Client name (optional)</label>
          <input
            type="text"
            className="input"
            placeholder="e.g., Claire Stone, John Doe"
            value={query.clientName}
            onChange={(e) =>
              setQuery((prev) => ({ ...prev, clientName: e.target.value }))
            }
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to search all clients
          </p>
        </div>

        {/* Status */}
        <div>
          <label className="label">Status (optional)</label>
          <select
            className="input"
            value={query.status}
            onChange={(e) =>
              setQuery((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="label">Priority (optional)</label>
          <select
            className="input"
            value={query.priority}
            onChange={(e) =>
              setQuery((prev) => ({ ...prev, priority: e.target.value }))
            }
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date From */}
        <div>
          <label className="label">From date (optional)</label>
          <input
            type="date"
            className="input"
            value={query.dateFrom}
            onChange={(e) =>
              setQuery((prev) => ({ ...prev, dateFrom: e.target.value }))
            }
          />
        </div>

        {/* Date To */}
        <div>
          <label className="label">To date (optional)</label>
          <input
            type="date"
            className="input"
            value={query.dateTo}
            onChange={(e) =>
              setQuery((prev) => ({ ...prev, dateTo: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Search Text */}
      <div className="mb-6">
        <label className="label">Search for specific content (optional)</label>
        <input
          type="text"
          className="input"
          placeholder="e.g., sierra skye, domain name, specific keywords"
          value={query.searchText}
          onChange={(e) =>
            setQuery((prev) => ({ ...prev, searchText: e.target.value }))
          }
        />
        <p className="text-xs text-gray-500 mt-1">
          Search in titles, descriptions, and content
        </p>
      </div>

      {/* Limit */}
      <div className="mb-6">
        <label className="label">How many results?</label>
        <select
          className="input w-32"
          value={query.limit}
          onChange={(e) =>
            setQuery((prev) => ({ ...prev, limit: parseInt(e.target.value) }))
          }
        >
          <option value={10}>10 results</option>
          <option value={25}>25 results</option>
          <option value={50}>50 results</option>
          <option value={100}>100 results</option>
        </select>
      </div>

      {/* Example Queries */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          Example questions you can ask:
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• "Show me all Google findings with status 'delisted'"</li>
          <li>
            • "Find Google findings for client 'Claire Stone' from last month"
          </li>
          <li>• "Show high priority findings created this year"</li>
          <li>• "Search for 'sierra skye' in all Google findings"</li>
        </ul>
      </div>

      <button
        onClick={handleExecute}
        disabled={executeQuery.isLoading}
        className="btn btn-primary w-full"
      >
        {executeQuery.isLoading ? "Searching..." : "🔍 Search"}
      </button>
    </div>
  )
}
