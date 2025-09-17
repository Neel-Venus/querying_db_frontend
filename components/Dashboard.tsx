"use client"

import { useQuery } from "react-query"
import { api } from "@/lib/api"
import { MetricCard } from "./MetricCard"
import { RecentActivity } from "./RecentActivity"
import { TopPerformers } from "./TopPerformers"
import { Alerts } from "./Alerts"
import { QuickStats } from "./QuickStats"

export function Dashboard() {
  const { data: overview, isLoading: overviewLoading } = useQuery(
    "dashboard-overview",
    () => api.get("/dashboard/overview").then((res) => res.data)
  )

  const { data: recentActivity, isLoading: activityLoading } = useQuery(
    "dashboard-activity",
    () => api.get("/dashboard/recent-activity?limit=10").then((res) => res.data)
  )

  const { data: topPerformers, isLoading: performersLoading } = useQuery(
    "dashboard-performers",
    () => api.get("/dashboard/top-performers").then((res) => res.data)
  )

  const { data: alerts, isLoading: alertsLoading } = useQuery(
    "dashboard-alerts",
    () => api.get("/dashboard/alerts").then((res) => res.data)
  )

  const { data: quickStats, isLoading: quickStatsLoading } = useQuery(
    "dashboard-quick-stats",
    () => api.get("/dashboard/quick-stats").then((res) => res.data)
  )

  if (overviewLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Overview of your takedowns management system
        </p>
      </div>

      {/* Quick Stats */}
      {quickStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Findings (24h)"
            value={quickStats.findingsLast24h}
            change="+12%"
            changeType="positive"
          />
          <MetricCard
            title="Findings (7d)"
            value={quickStats.findingsLast7d}
            change="+8%"
            changeType="positive"
          />
          <MetricCard
            title="New Clients (7d)"
            value={quickStats.newClientsLast7d}
            change="+3%"
            changeType="positive"
          />
          <MetricCard
            title="Resolved (7d)"
            value={quickStats.resolvedLast7d}
            change="+15%"
            changeType="positive"
          />
        </div>
      )}

      {/* Overview Metrics */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Clients"
            value={overview.totalClients}
            subtitle={`${overview.activeClients} active`}
          />
          <MetricCard
            title="Total Findings"
            value={overview.totalFindings}
            subtitle={`${overview.resolvedFindings} resolved`}
          />
          <MetricCard
            title="Resolution Rate"
            value={`${overview.resolutionRate.toFixed(1)}%`}
            subtitle={`${overview.pendingFindings} pending`}
          />
          <MetricCard
            title="High Priority"
            value={overview.highPriorityClients}
            subtitle="clients"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          {activityLoading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : (
            <RecentActivity data={recentActivity} />
          )}
        </div>

        {/* Top Performers */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top Performers
          </h2>
          {performersLoading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : (
            <TopPerformers data={topPerformers} />
          )}
        </div>
      </div>

      {/* Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            System Alerts
          </h2>
          <Alerts data={alerts} />
        </div>
      )}
    </div>
  )
}
