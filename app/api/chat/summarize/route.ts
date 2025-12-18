import OpenAI from 'openai';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { conversationId } = await req.json();

        if (!conversationId) {
            return new Response('Missing conversationId', { status: 400 });
        }

        const supabase = await createClient();

        // Fetch messages for this conversation
        const { data: messages, error: msgsError } = await supabase
            .from('messages')
            .select('role, content')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });

        if (msgsError || !messages || messages.length === 0) {
            return new Response('No messages found', { status: 404 });
        }

        // Prepare conversation text for AI
        const conversationText = messages.map(m => `${m.role}: ${m.content}`).join('\n');

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
            defaultHeaders: {
                "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
                "X-Title": "AI Chatbot SaaS",
            },
        });

        const completion = await openai.chat.completions.create({
            model: "meta-llama/llama-3.3-70b-instruct:free",
            messages: [
                {
                    role: "system",
                    content: "Summarize the following conversation in 20 words or less. Focus on the main topic or user intent."
                },
                { role: "user", content: conversationText }
            ],
        });

        const summary = completion.choices[0].message.content?.trim();

        if (summary) {
            await supabase
                .from('conversations')
                .update({ summary })
                .eq('id', conversationId);
        }

        return NextResponse.json({ summary });

    } catch (error) {
        console.error("Error in summarization API:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
