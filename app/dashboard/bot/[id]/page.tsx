import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Copy, ExternalLink, Settings } from 'lucide-react'

export default async function BotDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: bot } = await supabase
    .from('chatbots')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!bot) {
    notFound()
  }

  const scriptUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/widget.js`
  const iframeCode = `<script src="${scriptUrl}" data-chat-id="${bot.public_id}"></script>`

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {bot.name}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {bot.brand_name}
            </p>
          </div>
          <div className="flex space-x-3">
             <Link
              href={`/embed/${bot.public_id}`}
              target="_blank"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Widget
            </Link>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Bot ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{bot.id}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Public ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{bot.public_id}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{bot.description}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">System Prompt</dt>
              <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md font-mono whitespace-pre-wrap">
                {bot.system_prompt}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Integration
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Copy this code to embed the chatbot on your website.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="relative rounded-md shadow-sm">
            <pre className="block w-full rounded-md border-gray-300 bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm">
              {iframeCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
