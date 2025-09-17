"use client"

import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline"
import { clsx } from "clsx"

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
}

export function MetricCard({
  title,
  value,
  subtitle,
  change,
  changeType = "neutral",
}: MetricCardProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {change && (
          <div
            className={clsx(
              "flex items-center text-sm font-medium",
              changeType === "positive" && "text-green-600",
              changeType === "negative" && "text-red-600",
              changeType === "neutral" && "text-gray-600"
            )}
          >
            {changeType === "positive" && (
              <ArrowUpIcon className="h-4 w-4 mr-1" />
            )}
            {changeType === "negative" && (
              <ArrowDownIcon className="h-4 w-4 mr-1" />
            )}
            {change}
          </div>
        )}
      </div>
    </div>
  )
}
