import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: chatbotId } = await params;
        const supabase = await createClient();

        const { data: faqs, error } = await supabase
            .from('faqs')
            .select('*')
            .eq('chatbot_id', chatbotId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching FAQs:', error);
            return new Response('Error fetching FAQs', { status: 500 });
        }

        return NextResponse.json(faqs);
    } catch (error) {
        console.error('Error in FAQs GET API:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: chatbotId } = await params;
        const { question, answer } = await req.json();

        if (!question || !answer) {
            return new Response('Missing question or answer', { status: 400 });
        }

        const supabase = await createClient();

        const { data: faq, error } = await supabase
            .from('faqs')
            .insert({
                chatbot_id: chatbotId,
                question,
                answer,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating FAQ:', error);
            return new Response('Error creating FAQ', { status: 500 });
        }

        return NextResponse.json(faq);
    } catch (error) {
        console.error('Error in FAQs POST API:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
