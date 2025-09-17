"use client"

import { useState } from "react"
import { useQuery, useMutation } from "react-query"
import { api } from "@/lib/api"
import { toast } from "react-hot-toast"
import { format } from "date-fns"

export function Reports() {
  const [selectedReport, setSelectedReport] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [clientId, setClientId] = useState<string>("")
  const [agency, setAgency] = useState<string>("")

  const { data: reportTemplates } = useQuery("report-templates", () =>
    api.get("/reports/templates").then((res) => res.data)
  )

  const { data: clients } = useQuery("clients-list", () =>
    api.get("/clients").then((res) => res.data.clients)
  )

  const { data: agencies } = useQuery("agencies-list", () =>
    api.get("/clients").then((res) => {
      const uniqueAgencies = Array.from(
        new Set(res.data.clients.map((client: any) => client.agency))
      )
      return uniqueAgencies
    })
  )

  const generateReport = useMutation(
    (params: any) => {
      const { reportType, ...queryParams } = params
      return api.get(`/reports/${reportType}`, { params: queryParams })
    },
    {
      onSuccess: (response) => {
        // Create and download the report
        const reportData = response.data
        const blob = new Blob([JSON.stringify(reportData, null, 2)], {
          type: "application/json",
        })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${selectedReport}-${format(
          new Date(),
          "yyyy-MM-dd"
        )}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast.success("Report generated and downloaded successfully")
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || "Failed to generate report"
        )
      },
    }
  )

  const handleGenerateReport = () => {
    if (!selectedReport) {
      toast.error("Please select a report type")
      return
    }

    const params: any = {}

    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate

    if (selectedReport === "client" && clientId) {
      params.clientId = clientId
    } else if (selectedReport === "agency" && agency) {
      params.agency = agency
    }

    generateReport.mutate({ reportType: selectedReport, ...params })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600">
          Generate comprehensive reports for your takedowns data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Configuration */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Generate Report
          </h2>

          <div className="space-y-4">
            {/* Report Type */}
            <div>
              <label className="label">Report Type</label>
              <select
                className="input"
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
              >
                <option value="">Select Report Type</option>
                {reportTemplates &&
                  Object.entries(reportTemplates).map(
                    ([key, template]: [string, any]) => (
                      <option key={key} value={key}>
                        {template.name}
                      </option>
                    )
                  )}
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Start Date</label>
                <input
                  type="date"
                  className="input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="label">End Date</label>
                <input
                  type="date"
                  className="input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Client Selection (for client reports) */}
            {selectedReport === "client" && (
              <div>
                <label className="label">Client</label>
                <select
                  className="input"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                >
                  <option value="">Select Client</option>
                  {clients?.map((client: any) => (
                    <option key={client._id} value={client._id}>
                      {client.client_name} ({client.customer})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Agency Selection (for agency reports) */}
            {selectedReport === "agency" && (
              <div>
                <label className="label">Agency</label>
                <select
                  className="input"
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                >
                  <option value="">Select Agency</option>
                  {agencies?.map((agencyName: any) => (
                    <option key={agencyName} value={agencyName}>
                      {agencyName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerateReport}
              disabled={generateReport.isLoading}
              className="btn btn-primary w-full"
            >
              {generateReport.isLoading ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </div>

        {/* Report Templates */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Available Reports
          </h2>

          <div className="space-y-4">
            {reportTemplates &&
              Object.entries(reportTemplates).map(
                ([key, template]: [string, any]) => (
                  <div
                    key={key}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <h3 className="font-medium text-gray-900">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {template.description}
                    </p>
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">
                        Parameters:{" "}
                      </span>
                      <span className="text-xs text-gray-700">
                        {template.parameters.join(", ")}
                      </span>
                    </div>
                  </div>
                )
              )}
          </div>
        </div>
      </div>

      {/* Quick Report Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Reports
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => {
              setSelectedReport("executive-summary")
              setStartDate("")
              setEndDate("")
            }}
            className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Executive Summary</h3>
            <p className="text-sm text-gray-600 mt-1">
              High-level overview for executives
            </p>
          </button>

          <button
            onClick={() => {
              setSelectedReport("performance")
              setStartDate("")
              setEndDate("")
            }}
            className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Performance Report</h3>
            <p className="text-sm text-gray-600 mt-1">
              System performance metrics
            </p>
          </button>

          <button
            onClick={() => {
              setSelectedReport("client")
              setStartDate("")
              setEndDate("")
            }}
            className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Client Report</h3>
            <p className="text-sm text-gray-600 mt-1">
              Detailed client analysis
            </p>
          </button>

          <button
            onClick={() => {
              setSelectedReport("agency")
              setStartDate("")
              setEndDate("")
            }}
            className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Agency Report</h3>
            <p className="text-sm text-gray-600 mt-1">
              Agency-wide performance
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}
