'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bot, MessageSquare, Code, Trash2 } from 'lucide-react'

interface ChatbotCardProps {
  id: string
  name: string
  brandName: string
  description: string | null
  publicId: string
  onDelete?: (id: string) => void
}

export default function ChatbotCard({
  id,
  name,
  brandName,
  description,
  publicId,
  onDelete
}: ChatbotCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will permanently delete the chatbot and all its conversations. This action cannot be undone.`)) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/chatbots/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to delete chatbot')
      }

      // Call the onDelete callback if provided
      if (onDelete) {
        onDelete(id)
      }
    } catch (error) {
      console.error('Error deleting chatbot:', error)
      alert('Failed to delete chatbot. Please try again.')
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all hover:border-indigo-300 dark:hover:border-indigo-700 group">
      <div className="px-6 py-5">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {brandName}
            </p>
          </div>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete chatbot"
          >
            <Trash2 className={`h-5 w-5 ${isDeleting ? 'animate-pulse' : ''}`} />
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
          {description || 'No description provided'}
        </p>
      </div>
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex justify-between border-t border-gray-200 dark:border-gray-700">
        <Link
          href={`/dashboard/bot/${id}`}
          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center transition-colors"
        >
          <MessageSquare className="mr-1 h-4 w-4" />
          Manage
        </Link>
        <Link
          href={`/embed/${publicId}`}
          target="_blank"
          className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 flex items-center transition-colors"
        >
          <Code className="mr-1 h-4 w-4" />
          Test Widget
        </Link>
      </div>
    </div>
  )
}
