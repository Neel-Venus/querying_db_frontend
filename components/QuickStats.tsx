"use client"

interface QuickStatsProps {
  data: {
    findingsLast24h: number
    findingsLast7d: number
    newClientsLast7d: number
    resolvedLast7d: number
  }
}

export function QuickStats({ data }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-primary-600">
          {data.findingsLast24h}
        </div>
        <div className="text-sm text-gray-600">Findings (24h)</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary-600">
          {data.findingsLast7d}
        </div>
        <div className="text-sm text-gray-600">Findings (7d)</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">
          {data.newClientsLast7d}
        </div>
        <div className="text-sm text-gray-600">New Clients (7d)</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">
          {data.resolvedLast7d}
        </div>
        <div className="text-sm text-gray-600">Resolved (7d)</div>
      </div>
    </div>
  )
}
