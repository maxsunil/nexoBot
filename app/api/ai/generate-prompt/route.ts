import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { brandName, description } = await req.json()

        if (!brandName || !description) {
            return NextResponse.json(
                { error: 'Brand name and description are required' },
                { status: 400 }
            )
        }

        const openai = createOpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: process.env.OPENROUTER_API_KEY,
        })

        const { text } = await generateText({
            model: openai('meta-llama/llama-3.3-70b-instruct:free'), // Using a good default model
            system: 'You are an expert AI prompt engineer.',
            prompt: `Create a system prompt for an AI customer support chatbot for a brand named "${brandName}".
      
      Brand Description: ${description}
      
      The system prompt should define the bot's persona, tone, and specific instructions on how to handle queries related to this brand.
      It should be concise but comprehensive.
      
      Output ONLY the system prompt text, nothing else.`,
        })

        return NextResponse.json({ systemPrompt: text })
    } catch (error) {
        console.error('Error generating prompt:', error)
        return NextResponse.json(
            { error: 'Failed to generate prompt' },
            { status: 500 }
        )
    }
}
