'use client'

import { useState, useEffect } from 'react'
import { Bot, Sparkles, Code, Zap, Check, ArrowRight, MessageCircle, Copy, CheckCircle, Menu, X, Star, Users, TrendingUp, Shield } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const copyToClipboard = (text: string, stepIndex: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(stepIndex)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const integrationSteps = [
    {
      title: 'Sign Up & Create Your Bot',
      description: 'Create an account and set up your first AI chatbot in minutes',
      code: null,
    },
    {
      title: 'Get Your Embed Code',
      description: 'Copy the simple script tag from your dashboard',
      code: `<script src="https://ainexbot.com/widget.js" data-chat-id="YOUR_BOT_ID"></script>`,
    },
    {
      title: 'Add to Your Website',
      description: 'Paste the code before the closing </body> tag',
      code: `<!DOCTYPE html>
<html>
  <head>
    <title>My Website</title>
  </head>
  <body>
    <!-- Your website content -->
    
    <!-- AI Chatbot Widget -->
    <script src="https://ainexbot.com/widget.js" data-chat-id="YOUR_BOT_ID"></script>
  </body>
</html>`,
    },
    {
      title: 'You\'re Live!',
      description: 'Your AI chatbot is now ready to engage with visitors',
      code: null,
    },
  ]

  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: 'AI-Powered Responses',
      description: 'Intelligent conversations powered by advanced language models',
      stat: '99.9% Accuracy',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Instant Setup',
      description: 'Get your chatbot running in under 5 minutes',
      stat: '<5 min Setup',
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: 'Easy Integration',
      description: 'Simple script tag - works with any website',
      stat: '1 Line of Code',
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: 'Customizable',
      description: 'Tailor responses to match your brand voice',
      stat: 'Unlimited Styles',
    },
  ]

  const stats = [
    { icon: <Users className="h-8 w-8" />, value: '50K+', label: 'Active Users' },
    { icon: <MessageCircle className="h-8 w-8" />, value: '10M+', label: 'Messages Processed' },
    { icon: <TrendingUp className="h-8 w-8" />, value: '95%', label: 'Customer Satisfaction' },
    { icon: <Shield className="h-8 w-8" />, value: '99.9%', label: 'Uptime' },
  ]

  const pricingPlans = [
    {
      name: 'Starter',
      price: 'Free',
      features: ['1 Chatbot', '100 messages/month', 'Basic customization', 'Community support'],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      features: ['5 Chatbots', 'Unlimited messages', 'Advanced customization', 'Priority support', 'Analytics dashboard'],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: ['Unlimited chatbots', 'Unlimited messages', 'White-label solution', 'Dedicated support', 'Custom integrations'],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 transition-colors overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="relative">
                <Bot className="h-8 w-8 text-indigo-600 dark:text-indigo-400 transition-transform group-hover:scale-110 group-hover:rotate-12" />
                <div className="absolute inset-0 bg-indigo-600 dark:bg-indigo-400 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                AI NexBot
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
              <a href="#integration" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Integration</a>
              <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</a>
              <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full transition-all transform hover:scale-105 hover:shadow-lg">
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 animate-slide-down">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
              <a href="#integration" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Integration</a>
              <a href="#pricing" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</a>
              <button className="block w-full py-2 text-left text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sign In</button>
              <button className="block w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg">Get Started</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center px-4 py-2 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-indigo-200 dark:border-indigo-800 shadow-lg hover:scale-105 transition-transform">
              <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mr-2 animate-pulse" />
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Powered by Advanced AI</span>
              <Star className="h-4 w-4 text-yellow-500 ml-2 animate-spin-slow" />
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Add an AI Chatbot to<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 animate-gradient">
                Your Website
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
              Create intelligent, customized chatbots for your website in minutes. No coding required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
              <button className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full font-medium transition-all hover:scale-105 hover:shadow-2xl">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#integration"
                className="inline-flex items-center px-8 py-4 bg-white/60 dark:bg-white/10 backdrop-blur-sm hover:bg-white dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-full font-medium transition-all hover:scale-105 border border-gray-300 dark:border-gray-700"
              >
                See How It Works
              </a>
            </div>

            {/* 3D Interactive Robot */}
            <div 
              className="mt-16 relative animate-float"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div 
                className="max-w-sm mx-auto relative"
                style={{
                  transform: isHovering 
                    ? `perspective(1000px) rotateY(${(mousePosition.x - window.innerWidth / 2) / 50}deg) rotateX(${-(mousePosition.y - window.innerHeight / 2) / 50}deg)`
                    : 'perspective(1000px) rotateY(0deg) rotateX(0deg)',
                  transition: 'transform 0.1s ease-out'
                }}
              >
                {/* 3D Robot Card */}
                <div className="relative preserve-3d">
                  {/* Shadow */}
                  <div className="absolute inset-0 bg-indigo-600/20 blur-3xl rounded-full transform translate-y-8 scale-90"></div>
                  
                  {/* Main Robot Container */}
                  <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 shadow-2xl transform-gpu">
                    {/* Robot Head */}
                    <div className="relative mb-6">
                      <div className="w-32 h-32 mx-auto bg-white/90 rounded-3xl shadow-lg transform hover:scale-110 transition-transform relative"
                        style={{
                          transform: isHovering ? 'translateZ(40px)' : 'translateZ(0px)',
                          transition: 'transform 0.3s ease-out'
                        }}
                      >
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
                      
                      {/* Floating Particles */}
                      <div className="absolute top-0 left-0 w-3 h-3 bg-yellow-300 rounded-full animate-float-delayed opacity-70" style={{transform: 'translateZ(60px)'}}></div>
                      <div className="absolute top-4 right-4 w-2 h-2 bg-pink-300 rounded-full animate-float opacity-70" style={{transform: 'translateZ(50px)'}}></div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-300 rounded-full animate-float-delayed-2 opacity-70" style={{transform: 'translateZ(55px)'}}></div>
                    </div>
                    
                    {/* Robot Body */}
                    <div className="relative">
                      <div 
                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl"
                        style={{
                          transform: isHovering ? 'translateZ(30px)' : 'translateZ(0px)',
                          transition: 'transform 0.3s ease-out'
                        }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <Bot className="h-5 w-5 text-indigo-600" />
                            <span className="text-indigo-900 font-semibold">AI Assistant</span>
                          </div>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse animation-delay-200"></div>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse animation-delay-400"></div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-3">
                            <p className="text-sm text-indigo-900 dark:text-indigo-100">👋 Hi! I'm your AI assistant</p>
                          </div>
                          <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-3 animate-pulse">
                            <p className="text-sm text-indigo-900 dark:text-indigo-100">Ready to help 24/7</p>
                          </div>
                          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-3 ml-auto max-w-[80%]">
                            <p className="text-sm text-white">Awesome! Let's get started 🚀</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Arms */}
                      <div 
                        className="absolute -left-8 top-8 w-6 h-20 bg-white/80 rounded-full shadow-lg animate-wave"
                        style={{transform: 'translateZ(20px)'}}
                      ></div>
                      <div 
                        className="absolute -right-8 top-8 w-6 h-20 bg-white/80 rounded-full shadow-lg animate-wave animation-delay-400"
                        style={{transform: 'translateZ(20px)'}}
                      ></div>
                    </div>
                    
                    {/* Energy Rings */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-white/30 animate-ping-slow"></div>
                    <div className="absolute inset-0 rounded-3xl border-2 border-white/20 animate-ping-slow animation-delay-1000"></div>
                  </div>
                </div>
                
                {/* Hover instruction */}
                <p className="mt-6 text-sm text-gray-600 dark:text-gray-400 animate-bounce-slow">
                  ✨ Hover to interact
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Floating Cards Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features in 3D
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Hover over the cards to see them in action
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🚀', title: 'Lightning Fast', desc: 'Instant responses powered by AI', color: 'from-blue-500 to-cyan-500' },
              { icon: '🎨', title: 'Customizable', desc: 'Match your brand perfectly', color: 'from-purple-500 to-pink-500' },
              { icon: '📊', title: 'Analytics', desc: 'Track every conversation', color: 'from-orange-500 to-red-500' }
            ].map((item, index) => (
              <div
                key={index}
                className="group perspective-1000"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative preserve-3d transition-transform duration-500 hover:rotate-y-12 hover:-translate-y-4">
                  <div className={`relative bg-gradient-to-br ${item.color} rounded-3xl p-8 shadow-2xl transform-gpu`}>
                    {/* 3D Depth layers */}
                    <div className="absolute inset-0 bg-white/10 rounded-3xl transform translate-z-2"></div>
                    <div className="absolute inset-0 bg-white/5 rounded-3xl transform translate-z-4"></div>
                    
                    <div className="relative z-10">
                      <div className="text-6xl mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-white/90">{item.desc}</p>
                      
                      {/* Floating particles */}
                      <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-float opacity-60"></div>
                      <div className="absolute bottom-4 left-4 w-2 h-2 bg-white rounded-full animate-float-delayed opacity-60"></div>
                    </div>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl transform -skew-x-12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <div className="text-white">{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose AI NexBot?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to provide exceptional customer support with AI
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer ${
                  activeFeature === index ? 'ring-2 ring-indigo-600 dark:ring-indigo-400 shadow-2xl -translate-y-2' : ''
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="relative mb-6">
                  <div className="h-14 w-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg">
                    {feature.icon}
                  </div>
                  <div className="absolute inset-0 bg-indigo-600 dark:bg-indigo-400 rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {feature.description}
                </p>
                <div className="inline-flex items-center px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                  <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{feature.stat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Guide */}
      <section id="integration" className="py-20 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Get Started in 4 Simple Steps
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Integration takes less than 5 minutes
            </p>
          </div>
          
          <div className="space-y-8">
            {integrationSteps.map((step, index) => (
              <div
                key={index}
                className="relative pl-12 pb-8 border-l-2 border-indigo-300 dark:border-indigo-700 last:border-0 last:pb-0 group animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute -left-6 top-0 h-12 w-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {step.description}
                  </p>
                  
                  {step.code && (
                    <div className="relative group/code">
                      <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-6 rounded-xl overflow-x-auto text-sm border border-gray-700 shadow-inner">
                        <code>{step.code}</code>
                      </pre>
                      <button
                        onClick={() => copyToClipboard(step.code!, index)}
                        className="absolute top-3 right-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all hover:scale-110 shadow-lg"
                        title="Copy code"
                      >
                        {copiedStep === index ? (
                          <CheckCircle className="h-5 w-5 text-green-400 animate-scale-in" />
                        ) : (
                          <Copy className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  )}
                  
                  {!step.code && index === 3 && (
                    <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="h-6 w-6 animate-bounce" />
                      <span className="font-semibold">All set! Your chatbot is live.</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Choose the plan that fits your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 shadow-2xl scale-105 ring-4 ring-indigo-300 dark:ring-indigo-800'
                    : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.highlighted && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-sm font-bold rounded-full shadow-lg animate-bounce-slow">
                    ⭐ Most Popular
                  </div>
                )}
                
                <h3 className={`text-2xl font-bold mb-4 ${plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {plan.name}
                </h3>
                
                <div className="mb-6">
                  <span className={`text-5xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-lg ${plan.highlighted ? 'text-indigo-100' : 'text-gray-600 dark:text-gray-400'}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        plan.highlighted ? 'bg-white/20' : 'bg-indigo-100 dark:bg-indigo-900/30'
                      }`}>
                        <Check className={`h-4 w-4 ${plan.highlighted ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
                      </div>
                      <span className={`ml-3 ${plan.highlighted ? 'text-indigo-100' : 'text-gray-600 dark:text-gray-400'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <button
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-center transition-all hover:scale-105 shadow-lg ${
                    plan.highlighted
                      ? 'bg-white text-indigo-600 hover:bg-gray-100'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 shadow-2xl animate-fade-in-up">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Ready to Transform Your Customer Support?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of businesses using AI NexBot to engage with their customers
            </p>
            <button className="group inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold transition-all hover:scale-105 hover:shadow-2xl">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="mt-4 text-center text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} AI NexBot. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
    );
}