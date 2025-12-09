'use client'

import { MessageSquare, Clock, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface ConversationSummaryProps {
  id: string
  chatbotName: string
  summary: string
  messageCount: number
  timestamp: string
  firstMessage?: string
  onDelete?: (id: string) => void
}

export default function ConversationSummary({
  id,
  chatbotName,
  summary,
  messageCount,
  timestamp,
  firstMessage,
  onDelete
}: ConversationSummaryProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete conversation')
      }

      // Call the onDelete callback if provided
      if (onDelete) {
        onDelete(id)
      }
    } catch (error) {
      console.error('Error deleting conversation:', error)
      alert('Failed to delete conversation. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all hover:border-indigo-300 dark:hover:border-indigo-700 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {chatbotName}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3" />
              <span>{formatTimestamp(timestamp)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              {messageCount} message{messageCount !== 1 ? 's' : ''}
            </span>
          </div>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete conversation"
          >
            <Trash2 className={`h-4 w-4 ${isDeleting ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      </div>

      {/* First Message */}
      {firstMessage && (
        <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">First message:</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            "{firstMessage}"
          </p>
        </div>
      )}

      {/* Summary */}
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Conversation summary:</p>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {summary || 'No summary available yet. Summary will be generated after the conversation.'}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
          View full conversation →
        </button>
      </div>
    </div>
  )
}
