'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Loader2 } from 'lucide-react'

export default function NewChatbotPage() {
  const [name, setName] = useState('')
  const [brandName, setBrandName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Generate System Prompt via API
      const promptResponse = await fetch('/api/ai/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandName, description }),
      })

      if (!promptResponse.ok) {
        throw new Error('Failed to generate system prompt')
      }

      const { systemPrompt } = await promptResponse.json()

      // 2. Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      // 3. Save to Supabase
      const { error } = await supabase.from('chatbots').insert({
        user_id: user.id,
        name,
        brand_name: brandName,
        description,
        system_prompt: systemPrompt,
      })

      if (error) throw error

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Error creating chatbot:', error)
      alert('Failed to create chatbot. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Create New Chatbot
      </h1>
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Bot Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2 border"
                  placeholder="e.g. Support Bot"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="brandName"
                className="block text-sm font-medium text-gray-700"
              >
                Brand Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="brandName"
                  id="brandName"
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2 border"
                  placeholder="e.g. Acme Corp"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description & Purpose
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2 border"
                  placeholder="Describe what your company does and what this bot should handle..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Our AI will use this to generate a custom personality and knowledge base for your bot.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Generating...
                  </>
                ) : (
                  'Create Chatbot'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
