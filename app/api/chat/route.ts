import OpenAI from 'openai';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { messages, publicId, conversationId } = await req.json();

        if (!publicId) {
            return new Response('Missing publicId', { status: 400 });
        }

        const supabase = await createClient();

        // Fetch chatbot info and FAQs
        const { data: chatbot } = await supabase
            .from('chatbots')
            .select('id, system_prompt')
            .eq('public_id', publicId)
            .single();

        if (!chatbot) {
            return new Response('Chatbot not found', { status: 404 });
        }

        const { data: faqs } = await supabase
            .from('faqs')
            .select('question, answer')
            .eq('chatbot_id', chatbot.id);

        // Build FAQ context
        const faqContext = faqs && faqs.length > 0
            ? `\n\nFrequently Asked Questions:\n${faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n')}`
            : '';

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
            defaultHeaders: {
                "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
                "X-Title": "AI Chatbot SaaS",
            },
        });

        const apiMessages = messages.map((m: any) => ({
            role: m.role,
            content: m.content
        }));

        const completion = await openai.chat.completions.create({
            model: "meta-llama/llama-3.3-70b-instruct:free",
            messages: [
                { role: "system", content: chatbot.system_prompt + faqContext },
                ...apiMessages
            ],
        });

        const aiMessage = completion.choices[0].message;

        // Save messages if conversationId is provided
        if (conversationId) {
            const userMessage = messages[messages.length - 1];
            await supabase.from('messages').insert([
                {
                    chatbot_id: chatbot.id,
                    conversation_id: conversationId,
                    role: 'user',
                    content: userMessage.content
                },
                {
                    chatbot_id: chatbot.id,
                    conversation_id: conversationId,
                    role: 'assistant',
                    content: aiMessage.content
                }
            ]);

            // Update conversation count and first message if needed
            if (messages.length === 1) {
                await supabase.from('conversations')
                    .update({ first_message: userMessage.content })
                    .eq('id', conversationId);
            }

            await supabase.rpc('increment_message_count', { conv_id: conversationId });
        }

        return NextResponse.json(aiMessage);

    } catch (error) {
        console.error("Error in chat API:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
