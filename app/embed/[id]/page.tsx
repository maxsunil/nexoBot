'use client'

import { useEffect, useRef, useState, FormEvent } from 'react'
import { Send, Bot, MessageCircle, X } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useParams } from 'next/navigation'

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export default function EmbedPage() {
  const params = useParams()
  const publicId = params.id as string
  const [brandName, setBrandName] = useState('')
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize session and fetch bot info
  useEffect(() => {
    const init = async () => {
      // Fetch bot info
      const supabase = createClient()
      const { data: bot } = await supabase
        .from('chatbots')
        .select('id, brand_name')
        .eq('public_id', publicId)
        .single()

      if (bot) {
        setBrandName(bot.brand_name)
        
        // Handle session
        let sid = localStorage.getItem(`chat_session_${publicId}`)
        if (!sid) {
          sid = Math.random().toString(36).substring(7)
          localStorage.setItem(`chat_session_${publicId}`, sid)
        }
        setSessionId(sid)

        // Find or create conversation
        try {
          const resp = await fetch('/api/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chatbot_id: bot.id,
              session_id: sid,
            })
          })
          if (resp.ok) {
            const conv = await resp.json()
            setConversationId(conv.id)
            
            // Optionally fetch existing messages for this session
            const { data: existingMessages } = await supabase
              .from('messages')
              .select('role, content')
              .eq('conversation_id', conv.id)
              .order('created_at', { ascending: true })
            
            if (existingMessages && existingMessages.length > 0) {
              setMessages(existingMessages as Message[])
            }
          }
        } catch (err) {
          console.error('Error syncing conversation:', err)
        }
      }
      setLoading(false)
    }

    if (publicId) init()
  }, [publicId])

  // Handle background transparency and resizing messages
  useEffect(() => {
    // Make body and html transparent
    document.body.style.background = 'transparent'
    document.documentElement.style.background = 'transparent'
    
    // Notify parent about initial size (closed)
    if (window.parent) {
      window.parent.postMessage({ type: 'CHATBOT_RESIZE', isOpen }, '*')
    }
  }, [isOpen])

  // Scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isSending) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsSending(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          publicId,
          conversationId // Pass conversationId to save messages
        })
      })

      if (!response.ok) throw new Error('Failed to send message')

      const aiMessage = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: aiMessage.content }])

      // Trigger summarization check (could be debounced or server-side)
      if (messages.length > 3) {
        fetch('/api/chat/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId })
        }).catch(err => console.error('Summary error:', err))
      }

    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-transparent">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 bg-transparent right-0 flex flex-col items-end space-y-4 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[350px] h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-in slide-in-from-bottom-10 fade-in duration-300 bg-white">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-indigo-600 text-white shadow-sm">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/20">
                <Bot className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <h1 className="text-sm font-semibold">{brandName || 'AI Assistant'}</h1>
                <p className="text-xs text-indigo-100">Online</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8 text-sm">
                <p>👋 Hi! How can I help you with {brandName} today?</p>
              </div>
            )}

            {messages.map((m, index) => (
              <div
                key={index}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex max-w-[80%] ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm'
                      : 'bg-white text-gray-900 shadow-sm border border-gray-100 rounded-2xl rounded-tl-sm'
                  } px-4 py-2.5`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</div>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div className="bg-white shadow-sm border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <input
                className="flex-1 min-w-0 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <div className="mt-2 text-center">
              <a
                href="https://your-saas-url.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
              >
                Powered by AI NexBot
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all hover:scale-105 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <MessageCircle className="h-8 w-8" />
        </button>
      )}
      
      <style jsx global>{`
        html, body {
          background: transparent !important;
        }
      `}</style>
    </div>
  )
}
