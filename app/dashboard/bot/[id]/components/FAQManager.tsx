'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Check, X, HelpCircle } from 'lucide-react'

interface FAQ {
    id: string
    question: string
    answer: string
}

interface FAQManagerProps {
    chatbotId: string
}

export default function FAQManager({ chatbotId }: FAQManagerProps) {
    const [faqs, setFaqs] = useState<FAQ[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [newQuestion, setNewQuestion] = useState('')
    const [newAnswer, setNewAnswer] = useState('')
    const [editQuestion, setEditQuestion] = useState('')
    const [editAnswer, setEditAnswer] = useState('')

    useEffect(() => {
        fetchFaqs()
    }, [chatbotId])

    const fetchFaqs = async () => {
        try {
            const response = await fetch(`/api/chatbots/${chatbotId}/faqs`)
            if (response.ok) {
                const data = await response.json()
                setFaqs(data)
            }
        } catch (error) {
            console.error('Error fetching FAQs:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = async () => {
        if (!newQuestion.trim() || !newAnswer.trim()) return

        try {
            const response = await fetch(`/api/chatbots/${chatbotId}/faqs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: newQuestion, answer: newAnswer })
            })

            if (response.ok) {
                const newFaq = await response.json()
                setFaqs([newFaq, ...faqs])
                setNewQuestion('')
                setNewAnswer('')
                setIsAdding(false)
            }
        } catch (error) {
            console.error('Error adding FAQ:', error)
        }
    }

    const handleUpdate = async (id: string) => {
        try {
            const response = await fetch(`/api/chatbots/${chatbotId}/faqs/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: editQuestion, answer: editAnswer })
            })

            if (response.ok) {
                const updatedFaq = await response.json()
                setFaqs(faqs.map(f => f.id === id ? updatedFaq : f))
                setEditingId(null)
            }
        } catch (error) {
            console.error('Error updating FAQ:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this FAQ?')) return

        try {
            const response = await fetch(`/api/chatbots/${chatbotId}/faqs/${id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setFaqs(faqs.filter(f => f.id !== id))
            }
        } catch (error) {
            console.error('Error deleting FAQ:', error)
        }
    }

    const startEditing = (faq: FAQ) => {
        setEditingId(faq.id)
        setEditQuestion(faq.question)
        setEditAnswer(faq.answer)
    }

    if (loading) return <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
    </div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <HelpCircle className="mr-2 h-5 w-5 text-indigo-500" />
                    Frequently Asked Questions
                </h3>
                <button
                    onClick={() => setIsAdding(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add FAQ
                </button>
            </div>

            {isAdding && (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Question
                        </label>
                        <input
                            type="text"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="What is your return policy?"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Answer
                        </label>
                        <textarea
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-24"
                            placeholder="Our return policy lasts 30 days..."
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                        >
                            Save FAQ
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {faqs.length === 0 && !isAdding ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                        No FAQs added yet.
                    </p>
                ) : (
                    faqs.map((faq) => (
                        <div
                            key={faq.id}
                            className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group"
                        >
                            {editingId === faq.id ? (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={editQuestion}
                                        onChange={(e) => setEditQuestion(e.target.value)}
                                        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    <textarea
                                        value={editAnswer}
                                        onChange={(e) => setEditAnswer(e.target.value)}
                                        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-24"
                                    />
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="p-2 text-gray-500 hover:text-gray-700"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleUpdate(faq.id)}
                                            className="p-2 text-green-600 hover:text-green-700"
                                        >
                                            <Check className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                            {faq.question}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                            {faq.answer}
                                        </p>
                                    </div>
                                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => startEditing(faq)}
                                            className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(faq.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
