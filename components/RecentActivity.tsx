"use client"

import { formatDistanceToNow } from "date-fns"

interface ActivityItem {
  id: string
  type: string
  client: string
  customer: string
  domain?: string
  status: string
  createdAt: string
}

interface RecentActivityProps {
  data: ActivityItem[]
}

export function RecentActivity({ data }: RecentActivityProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No recent activity</div>
    )
  }

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.id} className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">
                {item.type} for {item.client}
              </p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(item.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              {item.customer} • {item.domain || "N/A"}
            </p>
            <div className="mt-1">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === "resolved" || item.status === "delisted"
                    ? "bg-green-100 text-green-800"
                    : item.status === "pending" || item.status === "in_progress"
                    ? "bg-yellow-100 text-yellow-800"
                    : item.status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {item.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
