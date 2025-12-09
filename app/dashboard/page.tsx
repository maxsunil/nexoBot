import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, MessageSquare, Code, Bot, TrendingUp, Users, Sparkles } from 'lucide-react'
import StatsCard from './components/StatsCard'
import ConversationList from './components/ConversationList'
import ChatbotList from './components/ChatbotList'
import AnalyticsChart from './components/AnalyticsChart'

async function getAnalytics() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/analytics`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return null;
  }
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: chatbots } = await supabase
    .from('chatbots')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  // Fetch conversations
  const { data: conversations } = await supabase
    .from('conversations')
    .select(`
      *,
      chatbots (
        id,
        name,
        brand_name
      )
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  // Filter conversations for user's chatbots
  const userConversations = conversations?.filter(conv => 
    chatbots?.some(bot => bot.id === conv.chatbot_id)
  ) || []

  // Calculate basic stats
  const totalChatbots = chatbots?.length || 0
  const totalConversations = userConversations.length
  const totalMessages = userConversations.reduce((sum, conv) => sum + (conv.message_count || 0), 0)

  // Prepare chatbot stats for chart
  const chatbotStats = chatbots?.map(bot => {
    const botConversations = userConversations.filter(conv => conv.chatbot_id === bot.id)
    return {
      label: bot.name,
      value: botConversations.length
    }
  }).filter(stat => stat.value > 0) || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your chatbots.
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105 shadow-lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create New Bot
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Chatbots"
          value={totalChatbots}
          icon={Bot}
          color="blue"
          trend={totalChatbots > 0 ? { value: 12, isPositive: true } : undefined}
        />
        <StatsCard
          title="Conversations"
          value={totalConversations}
          icon={MessageSquare}
          color="purple"
          trend={totalConversations > 0 ? { value: 8, isPositive: true } : undefined}
        />
        <StatsCard
          title="Total Messages"
          value={totalMessages}
          icon={TrendingUp}
          color="green"
          trend={totalMessages > 0 ? { value: 15, isPositive: true } : undefined}
        />
        <StatsCard
          title="Active Users"
          value={userConversations.filter(c => c.user_identifier).length}
          icon={Users}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <AnalyticsChart
            title="Conversations by Chatbot"
            data={chatbotStats.length > 0 ? chatbotStats : [
              { label: 'No data yet', value: 0 }
            ]}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/dashboard/new"
              className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition-all group"
            >
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Create Chatbot</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Set up a new AI bot</p>
              </div>
            </Link>

            <button className="w-full flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30 transition-all group">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg group-hover:scale-110 transition-transform">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">View Analytics</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Detailed insights</p>
              </div>
            </button>

            <button className="w-full flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-all group">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
                <Code className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">Get Embed Code</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Add to your site</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Conversations */}
      <ConversationList initialConversations={userConversations} />

      {/* Your Chatbots */}
      <ChatbotList initialChatbots={chatbots || []} />
    </div>
  )
}
