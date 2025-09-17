"use client"

import { useQuery } from "react-query"
import { api } from "@/lib/api"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

export function Analytics() {
  const { data: dashboardStats, isLoading: dashboardLoading } = useQuery(
    "analytics-dashboard",
    () => api.get("/analytics/dashboard").then((res) => res.data)
  )

  const { data: clientAnalytics, isLoading: clientLoading } = useQuery(
    "analytics-clients",
    () => api.get("/analytics/clients").then((res) => res.data)
  )

  const { data: findingAnalytics, isLoading: findingLoading } = useQuery(
    "analytics-findings",
    () => api.get("/analytics/findings").then((res) => res.data)
  )

  const { data: performanceMetrics, isLoading: performanceLoading } = useQuery(
    "analytics-performance",
    () => api.get("/analytics/performance").then((res) => res.data)
  )

  if (
    dashboardLoading ||
    clientLoading ||
    findingLoading ||
    performanceLoading
  ) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">
          Comprehensive analytics and insights for your takedowns system
        </p>
      </div>

      {/* Overview Cards */}
      {dashboardStats?.overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="card">
            <div className="text-2xl font-bold text-primary-600">
              {dashboardStats.overview.totalClients}
            </div>
            <div className="text-sm text-gray-600">Total Clients</div>
          </div>
          <div className="card">
            <div className="text-2xl font-bold text-green-600">
              {dashboardStats.overview.totalGoogleFindings}
            </div>
            <div className="text-sm text-gray-600">Google Findings</div>
          </div>
          <div className="card">
            <div className="text-2xl font-bold text-blue-600">
              {dashboardStats.overview.totalColabLinks}
            </div>
            <div className="text-sm text-gray-600">Colab Links</div>
          </div>
          <div className="card">
            <div className="text-2xl font-bold text-purple-600">
              {dashboardStats.overview.totalTwitterFindings}
            </div>
            <div className="text-sm text-gray-600">Twitter Findings</div>
          </div>
          <div className="card">
            <div className="text-2xl font-bold text-orange-600">
              {dashboardStats.overview.totalRedditData}
            </div>
            <div className="text-sm text-gray-600">Reddit Data</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Analytics */}
        {clientAnalytics && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Client Distribution
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  By Status
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={clientAnalytics.clientsByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {clientAnalytics.clientsByStatus.map(
                        (entry: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  By Priority
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={clientAnalytics.clientsByPriority}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Finding Analytics */}
        {findingAnalytics && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Finding Analytics
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Google Findings by Type
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={findingAnalytics.googleFindingsByType}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Twitter Findings by Status
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={findingAnalytics.twitterFindingsByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {findingAnalytics.twitterFindingsByStatus.map(
                        (entry: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Performance Metrics */}
      {performanceMetrics && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Performance Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {performanceMetrics.successRates.googleSuccessRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Google Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {performanceMetrics.successRates.twitterSuccessRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Twitter Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {performanceMetrics.responseTimeMetrics.averageResponseTime.toFixed(
                  1
                )}
                d
              </div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {performanceMetrics.processingTimes.averageProcessingTime.toFixed(
                  1
                )}
                d
              </div>
              <div className="text-sm text-gray-600">Avg Processing Time</div>
            </div>
          </div>
        </div>
      )}

      {/* Trends */}
      {findingAnalytics?.findingsOverTime && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Findings Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={findingAnalytics.findingsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="_id"
                tickFormatter={(value) =>
                  `${value.year}-${value.month}-${value.day}`
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) =>
                  `${value.year}-${value.month}-${value.day}`
                }
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
