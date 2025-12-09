import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'blue' | 'purple' | 'green' | 'orange'
  loading?: boolean
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'blue',
  loading = false 
}: StatsCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    green: 'from-green-500 to-emerald-500',
    orange: 'from-orange-500 to-red-500',
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all transform hover:-translate-y-1 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        
        {trend && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
            trend.isPositive 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
          }`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  )
}
