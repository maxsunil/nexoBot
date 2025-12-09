'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, MessageSquare } from 'lucide-react'
import ChatbotCard from './ChatbotCard'

interface Chatbot {
  id: string
  user_id: string
  name: string
  brand_name: string
  description: string | null
  system_prompt: string | null
  public_id: string
  created_at: string
}

interface ChatbotListProps {
  initialChatbots: Chatbot[]
}

export default function ChatbotList({ initialChatbots }: ChatbotListProps) {
  const [chatbots, setChatbots] = useState<Chatbot[]>(initialChatbots)

  const handleDelete = (id: string) => {
    // Remove the chatbot from the list
    setChatbots(prev => prev.filter(bot => bot.id !== id))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Chatbots
        </h2>
      </div>

      {chatbots && chatbots.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {chatbots.map((bot) => (
            <ChatbotCard
              key={bot.id}
              id={bot.id}
              name={bot.name}
              brandName={bot.brand_name}
              description={bot.description}
              publicId={bot.public_id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="inline-flex p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
            <MessageSquare className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No chatbots yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Get started by creating your first AI-powered chatbot. It only takes a few minutes!
          </p>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105 shadow-lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Your First Chatbot
          </Link>
        </div>
      )}
    </div>
  )
}
