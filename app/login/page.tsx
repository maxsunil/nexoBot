'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, Bot, Sparkles, ArrowRight, Mail, Lock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding & Illustration */}
          <div className="hidden md:block">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-3 mb-6">
                <div className="relative">
                  <Bot className="h-16 w-16 text-indigo-600 dark:text-indigo-400 animate-float" />
                  <div className="absolute inset-0 bg-indigo-600 dark:bg-indigo-400 rounded-full blur-md opacity-50"></div>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  AI NexBot
                </h1>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Intelligent conversations powered by AI
              </p>
            </div>

            {/* Animated Chatbot Illustration */}
            <div className="relative max-w-md mx-auto">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-transform">
                {/* Robot Head */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto bg-white/90 rounded-3xl shadow-lg relative">
                    {/* Antenna */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-1 h-6 bg-indigo-600 rounded-full">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse shadow-lg"></div>
                    </div>
                    
                    {/* Eyes */}
                    <div className="flex justify-center items-center h-full space-x-6">
                      <div className="relative">
                        <div className="w-8 h-8 bg-indigo-600 rounded-full animate-pulse"></div>
                        <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <div className="relative">
                        <div className="w-8 h-8 bg-indigo-600 rounded-full animate-pulse animation-delay-200"></div>
                        <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Smile */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-8 border-b-4 border-indigo-600 rounded-full"></div>
                  </div>
                </div>

                {/* Chat Bubbles */}
                <div className="space-y-3">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 animate-float">
                    <p className="text-sm text-indigo-900">👋 Welcome back!</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 animate-float animation-delay-2000">
                    <p className="text-sm text-indigo-900">Ready to chat?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="mb-8">
                <div className="flex items-center justify-center md:hidden mb-6">
                  <Bot className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mr-3" />
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                    AI NexBot
                  </h1>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">
                  Welcome Back
                </h2>
                <p className="text-center text-gray-600 dark:text-gray-400">
                  Sign in to manage your chatbots
                </p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-6">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* Error/Success Message */}
                {message && (
                  <div className={`flex items-start space-x-2 p-4 rounded-xl ${
                    message.type === 'error' 
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200' 
                      : 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                  }`}>
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{message.text}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link
                    href="/signup"
                    className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
                  >
                    Create one now
                  </Link>
                </p>
              </div>

              {/* Features */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">AI Powered</p>
                  </div>
                  <div>
                    <Bot className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Easy Setup</p>
                  </div>
                  <div>
                    <div className="h-6 w-6 mx-auto mb-2 flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">24/7 Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
