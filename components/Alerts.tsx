"use client"

import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline"
import { clsx } from "clsx"

interface Alert {
  type: "warning" | "error" | "info"
  title: string
  message: string
  count: number
  data: any[]
}

interface AlertsProps {
  data: Alert[]
}

export function Alerts({ data }: AlertsProps) {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">No alerts</div>
  }

  return (
    <div className="space-y-4">
      {data.map((alert, index) => (
        <div
          key={index}
          className={clsx(
            "p-4 rounded-lg border-l-4",
            alert.type === "error" && "bg-red-50 border-red-400",
            alert.type === "warning" && "bg-yellow-50 border-yellow-400",
            alert.type === "info" && "bg-blue-50 border-blue-400"
          )}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              {alert.type === "error" || alert.type === "warning" ? (
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              ) : (
                <InformationCircleIcon className="h-5 w-5 text-blue-400" />
              )}
            </div>
            <div className="ml-3">
              <h3
                className={clsx(
                  "text-sm font-medium",
                  alert.type === "error" && "text-red-800",
                  alert.type === "warning" && "text-yellow-800",
                  alert.type === "info" && "text-blue-800"
                )}
              >
                {alert.title}
              </h3>
              <div
                className={clsx(
                  "mt-2 text-sm",
                  alert.type === "error" && "text-red-700",
                  alert.type === "warning" && "text-yellow-700",
                  alert.type === "info" && "text-blue-700"
                )}
              >
                <p>{alert.message}</p>
                {alert.data && alert.data.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Affected items:</p>
                    <ul className="list-disc list-inside mt-1">
                      {alert.data.slice(0, 3).map((item, i) => (
                        <li key={i}>
                          {item.client_name || item._id || `Item ${i + 1}`}
                          {item.pendingCount &&
                            ` (${item.pendingCount} pending)`}
                        </li>
                      ))}
                      {alert.data.length > 3 && (
                        <li>... and {alert.data.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
