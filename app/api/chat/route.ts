import OpenAI from 'openai';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { messages, publicId } = await req.json();

        if (!publicId) {
            return new Response('Missing publicId', { status: 400 });
        }

        const supabase = await createClient();
        const { data: chatbot } = await supabase
            .from('chatbots')
            .select('system_prompt')
            .eq('public_id', publicId)
            .single();

        if (!chatbot) {
            return new Response('Chatbot not found', { status: 404 });
        }

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
            defaultHeaders: {
                "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
                "X-Title": "AI Chatbot SaaS",
            },
        });

        // Ensure messages are in the correct format for OpenAI SDK
        // We might need to filter out any extra properties if the frontend sends them
        const apiMessages = messages.map((m: any) => ({
            role: m.role,
            content: m.content
        }));

        const completion = await openai.chat.completions.create({
            model: "meta-llama/llama-3.3-70b-instruct:free",
            messages: [
                { role: "system", content: chatbot.system_prompt },
                ...apiMessages
            ],
        });

        const aiMessage = completion.choices[0].message;

        return NextResponse.json(aiMessage);

    } catch (error) {
        console.error("Error in chat API:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
