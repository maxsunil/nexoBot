'use client'

interface AnalyticsChartProps {
  data: {
    label: string
    value: number
    color?: string
  }[]
  title: string
  type?: 'bar' | 'line'
}

export default function AnalyticsChart({ 
  data, 
  title,
  type = 'bar' 
}: AnalyticsChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1)
  
  const defaultColors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {title}
      </h3>
      
      {data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => {
            const percentage = (item.value / maxValue) * 100
            const colorClass = item.color || defaultColors[index % defaultColors.length]
            
            return (
              <div key={index} className="group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {item.value}
                  </span>
                </div>
                <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colorClass} rounded-full transition-all duration-500 ease-out group-hover:opacity-90`}
                    style={{ width: `${percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
