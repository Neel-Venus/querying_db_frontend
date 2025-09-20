"use client"

import { useState } from "react"
import { useQuery, useMutation } from "react-query"
import { api } from "@/lib/api"
import { QueryCondition } from "./QueryCondition"
import { QueryResults } from "./QueryResults"
import { PredefinedQueries } from "./PredefinedQueries"
import { CollectionSelector } from "./CollectionSelector"
import { JoinBuilder } from "./JoinBuilder"
import { SortBuilder } from "./SortBuilder"
import { SimpleQueryBuilder } from "./SimpleQueryBuilder"
import { QuickStartGuide } from "./QuickStartGuide"
import { toast } from "react-hot-toast"

interface QueryRequest {
  collection: string
  conditions: any[]
  joins: any[]
  sort: any[]
  select: string[]
  page: number
  limit: number
  search?: string
}

export function QueryBuilder() {
  const [query, setQuery] = useState<QueryRequest>({
    collection: "clients",
    conditions: [],
    joins: [],
    sort: [],
    select: [],
    page: 1,
    limit: 10,
    search: "",
  })

  const [results, setResults] = useState<any>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [activeTab, setActiveTab] = useState<"simple" | "advanced">("simple")
  const [simpleQuery, setSimpleQuery] = useState({
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

  const { data: collections } = useQuery("collections", () =>
    api.get("/query/collections").then((res) => res.data)
  )

  const { data: predefinedQueries } = useQuery("predefined-queries", () =>
    api.get("/query/predefined-queries").then((res) => res.data)
  )

  const executeQuery = useMutation(
    (queryData: QueryRequest) => api.post("/query/execute", queryData),
    {
      onSuccess: (response) => {
        setResults(response.data)
        toast.success("Query executed successfully")
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Query execution failed")
      },
      onSettled: () => {
        setIsExecuting(false)
      },
    }
  )

  const handleExecute = () => {
    setIsExecuting(true)
    executeQuery.mutate(query)
  }

  const handlePredefinedQuery = (predefinedQuery: any) => {
    setQuery({
      collection: predefinedQuery.collection,
      conditions: predefinedQuery.conditions || [],
      joins: predefinedQuery.joins || [],
      sort: predefinedQuery.sort || [],
      select: predefinedQuery.select || [],
      page: 1,
      limit: 10,
      search: "",
    })
  }

  const addCondition = () => {
    setQuery((prev) => ({
      ...prev,
      conditions: [
        ...prev.conditions,
        { field: "", operator: "equals", value: "" },
      ],
    }))
  }

  const updateCondition = (index: number, condition: any) => {
    setQuery((prev) => ({
      ...prev,
      conditions: prev.conditions.map((c, i) => (i === index ? condition : c)),
    }))
  }

  const removeCondition = (index: number) => {
    setQuery((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index),
    }))
  }

  const addJoin = () => {
    setQuery((prev) => ({
      ...prev,
      joins: [
        ...prev.joins,
        { collection: "", localField: "", foreignField: "", as: "" },
      ],
    }))
  }

  const updateJoin = (index: number, join: any) => {
    setQuery((prev) => ({
      ...prev,
      joins: prev.joins.map((j, i) => (i === index ? join : j)),
    }))
  }

  const removeJoin = (index: number) => {
    setQuery((prev) => ({
      ...prev,
      joins: prev.joins.filter((_, i) => i !== index),
    }))
  }

  const addSort = () => {
    setQuery((prev) => ({
      ...prev,
      sort: [...prev.sort, { field: "", direction: "asc" }],
    }))
  }

  const updateSort = (index: number, sort: any) => {
    setQuery((prev) => ({
      ...prev,
      sort: prev.sort.map((s, i) => (i === index ? sort : s)),
    }))
  }

  const removeSort = (index: number) => {
    setQuery((prev) => ({
      ...prev,
      sort: prev.sort.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Query Builder</h1>
        <p className="text-gray-600">
          Build and execute queries on your data - choose simple or advanced
          mode
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("simple")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "simple"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          🚀 Simple Query
        </button>
        <button
          onClick={() => setActiveTab("advanced")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "advanced"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          ⚙️ Advanced Query
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Query Builder Panel */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "simple" ? (
            <SimpleQueryBuilder
              onResults={setResults}
              query={simpleQuery}
              onQueryChange={setSimpleQuery}
            />
          ) : (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Query Configuration
              </h2>

              {/* Collection Selection */}
              <div className="mb-6">
                <label className="label">Collection</label>
                <CollectionSelector
                  collections={collections}
                  value={query.collection}
                  onChange={(collection) =>
                    setQuery((prev) => ({ ...prev, collection }))
                  }
                />
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="label">Search</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter search terms..."
                  value={query.search}
                  onChange={(e) =>
                    setQuery((prev) => ({ ...prev, search: e.target.value }))
                  }
                />
              </div>

              {/* Conditions */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="label mb-0">Conditions</label>
                  <button
                    onClick={addCondition}
                    className="btn btn-secondary text-sm"
                  >
                    Add Condition
                  </button>
                </div>
                <div className="space-y-3">
                  {query.conditions.map((condition, index) => (
                    <QueryCondition
                      key={index}
                      condition={condition}
                      collection={query.collection}
                      onChange={(updatedCondition) =>
                        updateCondition(index, updatedCondition)
                      }
                      onRemove={() => removeCondition(index)}
                    />
                  ))}
                  {query.conditions.length === 0 && (
                    <p className="text-sm text-gray-500 italic">
                      No conditions added
                    </p>
                  )}
                </div>
              </div>

              {/* Joins */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="label mb-0">Joins</label>
                  <button
                    onClick={addJoin}
                    className="btn btn-secondary text-sm"
                  >
                    Add Join
                  </button>
                </div>
                <div className="space-y-3">
                  {query.joins.map((join, index) => (
                    <JoinBuilder
                      key={index}
                      join={join}
                      collections={collections}
                      currentCollection={query.collection}
                      onChange={(updatedJoin) => updateJoin(index, updatedJoin)}
                      onRemove={() => removeJoin(index)}
                    />
                  ))}
                  {query.joins.length === 0 && (
                    <p className="text-sm text-gray-500 italic">
                      No joins added
                    </p>
                  )}
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="label mb-0">Sort</label>
                  <button
                    onClick={addSort}
                    className="btn btn-secondary text-sm"
                  >
                    Add Sort
                  </button>
                </div>
                <div className="space-y-3">
                  {query.sort.map((sort, index) => (
                    <SortBuilder
                      key={index}
                      sort={sort}
                      collection={query.collection}
                      onChange={(updatedSort) => updateSort(index, updatedSort)}
                      onRemove={() => removeSort(index)}
                    />
                  ))}
                  {query.sort.length === 0 && (
                    <p className="text-sm text-gray-500 italic">
                      No sorting added
                    </p>
                  )}
                </div>
              </div>

              {/* Pagination */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="label">Page</label>
                  <input
                    type="number"
                    className="input"
                    min="1"
                    value={query.page}
                    onChange={(e) =>
                      setQuery((prev) => ({
                        ...prev,
                        page: parseInt(e.target.value) || 1,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="label">Limit</label>
                  <input
                    type="number"
                    className="input"
                    min="1"
                    max="100"
                    value={query.limit}
                    onChange={(e) =>
                      setQuery((prev) => ({
                        ...prev,
                        limit: parseInt(e.target.value) || 10,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Execute Button */}
              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className="btn btn-primary w-full"
              >
                {isExecuting ? "Executing..." : "Execute Query"}
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Start Guide for Simple Mode */}
          {activeTab === "simple" && (
            <QuickStartGuide
              onSelectExample={(example) => {
                setSimpleQuery((prev) => ({ ...prev, ...example }))
              }}
            />
          )}

          {/* Predefined Queries for Advanced Mode */}
          {activeTab === "advanced" && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Predefined Queries
              </h2>
              <PredefinedQueries
                queries={predefinedQueries}
                onSelect={handlePredefinedQuery}
              />
            </div>
          )}

          {/* Query Stats */}
          {results && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Query Results
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Records:</span>
                  <span className="font-medium">{results.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Page:</span>
                  <span className="font-medium">
                    {results.page} of {results.totalPages}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Execution Time:</span>
                  <span className="font-medium">{results.executionTime}ms</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Query Results
          </h2>
          <QueryResults data={results} />
        </div>
      )}
    </div>
  )
}
