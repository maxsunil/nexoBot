'use client'

import { useState } from 'react'
import ConversationSummary from './ConversationSummary'

interface Conversation {
  id: string
  chatbot_id: string
  session_id: string
  user_identifier: string | null
  message_count: number
  first_message: string | null
  summary: string | null
  created_at: string
  updated_at: string
  chatbots: {
    id: string
    name: string
    brand_name: string
  } | null
}

interface ConversationListProps {
  initialConversations: Conversation[]
}

export default function ConversationList({ initialConversations }: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)

  const handleDelete = (id: string) => {
    // Remove the conversation from the list
    setConversations(prev => prev.filter(conv => conv.id !== id))
  }

  if (conversations.length === 0) {
    return null
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Recent Conversations
        </h2>
        <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
          View all →
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {conversations.slice(0, 4).map((conversation) => (
          <ConversationSummary
            key={conversation.id}
            id={conversation.id}
            chatbotName={
              typeof conversation.chatbots === 'object' && conversation.chatbots !== null
                ? conversation.chatbots.name || 'Unknown Bot'
                : 'Unknown Bot'
            }
            summary={conversation.summary || ''}
            messageCount={conversation.message_count || 0}
            timestamp={conversation.created_at}
            firstMessage={conversation.first_message || undefined}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}
