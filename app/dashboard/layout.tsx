import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Bot, LogOut, Plus, LayoutDashboard } from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const user = session // session object has id, email, etc.

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <Bot className="w-8 h-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">AI Chatbot</span>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              <Link
                href="/dashboard"
                className="group flex items-center px-2 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-50"
              >
                <LayoutDashboard className="mr-3 flex-shrink-0 h-6 w-6 text-gray-500 group-hover:text-gray-500" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/new"
                className="group flex items-center px-2 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-50"
              >
                <Plus className="mr-3 flex-shrink-0 h-6 w-6 text-gray-500 group-hover:text-gray-500" />
                New Chatbot
              </Link>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user.email}
                </p>
                <form action="/api/auth/logout" method="post">
                  <button
                    type="submit"
                    className="flex items-center text-xs font-medium text-gray-500 hover:text-gray-700 mt-1"
                  >
                    <LogOut className="mr-1 h-3 w-3" />
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
