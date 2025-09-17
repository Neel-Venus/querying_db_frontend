"use client"

interface Performer {
  _id: string
  clientId: string
  totalFindings: number
  resolvedFindings: number
  resolutionRate: number
  customer: string
  agency: string
}

interface TopPerformersProps {
  data: Performer[]
}

export function TopPerformers({ data }: TopPerformersProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No performance data available
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {data.map((performer, index) => (
        <div
          key={performer._id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-700">
                  {index + 1}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {performer._id}
              </p>
              <p className="text-xs text-gray-500">
                {performer.customer} • {performer.agency}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {performer.resolutionRate.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">
              {performer.resolvedFindings}/{performer.totalFindings} resolved
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
